// Vercel Serverless Function: Paid tool submission (donasi via Midtrans).
// Alur: (1) verifikasi pembayaran ke Midtrans langsung (server key di env
// Vercel — sama seperti api/midtrans-token.js); (2) cek keamanan server-side
// (URL hidup, bukan duplikat, blocklist judi/porn/malware); (3) simpan ke
// tabel tool_submissions via Supabase REST dengan anon key (RLS: anon boleh
// INSERT; portal_token dibuat server-side dengan crypto.randomUUID).
// Auto-ACC: donasi >= Rp50.000 + lolos cek keamanan -> submit_status =
// 'auto_approved', boost 30 hari, langsung tampil di katalog lewat RPC
// list_live_paid_tools (tanpa menunggu sync ai_tools).
// Donasi < Rp50.000 -> 'pending' (antrean moderasi admin).

const SUPABASE_URL = 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';
const BLOCKED_HOST_KEYWORDS = [
  'casino', 'judi', 'slot', 'togel', 'poker', 'betting', 'porn', 'xxx',
  'sex', 'bokep', 'phishing', 'malware', 'crack', 'keygen',
];
const BLOCKED_TLDS = ['.ru', '.su'];

function isBlockedHost(hostname) {
  const h = (hostname || '').toLowerCase();
  if (BLOCKED_HOST_KEYWORDS.some((k) => h.includes(k))) return true;
  if (BLOCKED_TLDS.some((t) => h.endsWith(t))) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return true; // IP mentah
  return false;
}

async function verifyMidtransPaid(orderId) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return { checked: false, isPaid: false, error: 'Server key Midtrans belum dikonfigurasi.' };
  const isSandbox = serverKey.startsWith('SB-');
  const apiUrl = isSandbox
    ? `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`
    : `https://api.midtrans.com/v2/${encodeURIComponent(orderId)}/status`;
  const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');
  try {
    const res = await fetch(apiUrl, { method: 'GET', headers: { Accept: 'application/json', Authorization: authHeader } });
    const data = await res.json().catch(() => ({}));
    const isPaid = ['settlement', 'capture'].includes(data.transaction_status);
    return { checked: true, isPaid, status: data.transaction_status };
  } catch (e) {
    return { checked: false, isPaid: false, error: String(e?.message || e) };
  }
}

async function urlIsLive(target) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(target, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'LocaGoCreative-submit-check/1.0' } });
    clearTimeout(t);
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch {
    return false;
  }
}

async function isDuplicate(hostname) {
  try {
    const q = encodeURIComponent(`affiliateUrl.ilike.*${hostname}*,url.ilike.*${hostname}*`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?select=id&or=(${q})&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    const data = await res.json().catch(() => []);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const b = req.body || {};
    const toolName = String(b.toolName || '').trim();
    const websiteUrl = String(b.websiteUrl || '').trim();
    const category = String(b.category || 'AI Coding').trim();
    const pricingType = String(b.pricingType || 'Freemium').trim();
    const description = String(b.description || '').trim();
    const contactWa = String(b.contactWa || '').trim();
    const contactEmail = String(b.contactEmail || '').trim();
    const orderId = String(b.orderId || '').trim();
    const donationAmount = Math.max(0, parseInt(b.donationAmount || 0, 10));
    const mediaFee = parseInt(b.mediaFee || 0, 10) > 0;
    const mediaUrls = Array.isArray(b.mediaUrls) ? b.mediaUrls.filter((u) => typeof u === 'string').slice(0, 4) : [];

    if (!toolName || !websiteUrl || description.length < 20 || !orderId) {
      return res.status(400).json({ error: 'Data submission tidak lengkap (nama, URL, deskripsi min 20 karakter, orderId wajib).' });
    }
    if (!contactWa && !contactEmail) {
      return res.status(400).json({ error: 'Isi minimal satu kontak (WA atau email).' });
    }
    if (donationAmount < 10000) {
      return res.status(400).json({ error: 'Donasi submit minimal Rp10.000.' });
    }
    let parsed;
    try {
      parsed = new URL(websiteUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('bad protocol');
    } catch {
      return res.status(400).json({ error: 'URL website resmi tidak valid.' });
    }

    // 1) Verifikasi pembayaran (kebenaran = Midtrans, bukan klaim client).
    const pay = await verifyMidtransPaid(orderId);
    if (!pay.checked) return res.status(500).json({ error: 'Tidak bisa memverifikasi pembayaran: ' + (pay.error || '') });
    if (!pay.isPaid) {
      return res.status(402).json({ error: 'Pembayaran belum terverifikasi lunas di Midtrans (status: ' + (pay.status || 'pending') + '). Selesaikan pembayaran dulu, lalu submit ulang — tidak perlu bayar lagi bila transaksi yang sama sudah lunas.' });
    }

    // 2) Cek keamanan otomatis.
    let safetyNotes = null;
    let rejected = false;
    if (isBlockedHost(parsed.hostname)) {
      rejected = true;
      safetyNotes = 'Domain diblokir otomatis (kategori terlarang / IP mentah).';
    } else if (await isDuplicate(parsed.hostname)) {
      rejected = true;
      safetyNotes = 'Tool dengan domain ini sudah ada di katalog LocaGo.';
    } else if (!(await urlIsLive(websiteUrl))) {
      rejected = true;
      safetyNotes = 'Website resmi tidak bisa dibuka (cek keamanan otomatis gagal).';
    }

    const portalToken = crypto.randomUUID();
    const now = new Date();
    const boostUntil = new Date(now.getTime() + 30 * 86400000).toISOString();
    const submitStatus = rejected ? 'rejected' : (donationAmount >= 50000 ? 'auto_approved' : 'pending');

    // 3) Simpan submission (anon INSERT, return=minimal — tanpa read-back RLS).
    const row = {
      portal_token: portalToken,
      tool_name: toolName.slice(0, 120),
      website_url: websiteUrl.slice(0, 500),
      category: category.slice(0, 60),
      pricing_type: pricingType.slice(0, 30),
      description: description.slice(0, 2000),
      contact_wa: contactWa.slice(0, 30) || null,
      contact_email: contactEmail.slice(0, 120) || null,
      donation_amount: donationAmount,
      media_fee: mediaFee,
      media_urls: mediaUrls,
      order_id: orderId,
      payment_status: 'settlement',
      submit_status: submitStatus,
      safety_notes: safetyNotes,
      boost_start: submitStatus === 'auto_approved' ? now.toISOString() : null,
      boost_until: submitStatus === 'auto_approved' ? boostUntil : null,
      reviewed_at: submitStatus === 'auto_approved' ? now.toISOString() : null,
    };
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/tool_submissions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!ins.ok) {
      const errText = await ins.text().catch(() => '');
      return res.status(500).json({ error: 'Gagal menyimpan submission. Order ID ' + orderId + ' tercatat lunas — hubungi WA LocaGo dengan order ID ini. (' + (errText || ins.status) + ')' });
    }

    return res.status(200).json({
      portal_token: portalToken,
      submit_status: submitStatus,
      boost_until: submitStatus === 'auto_approved' ? boostUntil : null,
      order_id: orderId,
      rejected_reason: safetyNotes,
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
