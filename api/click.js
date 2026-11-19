// Vercel Serverless Function: pencatat klik "Kunjungi Tool" + redirect.
// GET /api/click?tool=<ai_tools id | paid-<uuid>> [&slug=<slug>]
// Alur: cari URL tujuan dari database (BUKAN dari parameter — mencegah open
// redirect/phishing), catat klik ke tool_clicks (timestamp per klik untuk
// agregasi harian), lalu 302 ke URL tujuan + UTM LocaGo.
// UTM: utm_source=locagocreative&utm_medium=website&utm_campaign=ai-tools
//      &utm_content=<slug>; parameter afiliasi yang ada dipertahankan.
const SUPABASE_URL = 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';

function slugify(name) {
  return (name || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'tool';
}

function appendUtm(rawUrl, slug) {
  try {
    const u = new URL(rawUrl);
    u.searchParams.set('utm_source', 'locagocreative');
    u.searchParams.set('utm_medium', 'website');
    u.searchParams.set('utm_campaign', 'ai-tools');
    u.searchParams.set('utm_content', slug);
    return u.toString();
  } catch {
    const sep = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${sep}utm_source=locagocreative&utm_medium=website&utm_campaign=ai-tools&utm_content=${encodeURIComponent(slug)}`;
  }
}

async function supaGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

async function recordClick(toolSlug, toolId, portalToken, referrer) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    await fetch(`${SUPABASE_URL}/rest/v1/tool_clicks`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ tool_slug: toolSlug, tool_id: toolId || null, portal_token: portalToken || null, referrer: (referrer || '').slice(0, 500) || null }),
    }).catch(() => {});
    clearTimeout(t);
  } catch {}
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  const toolParam = String(req.query?.tool || '').trim();
  const slugParam = String(req.query?.slug || '').trim();
  if (!toolParam && !slugParam) return res.status(400).json({ error: 'Parameter tool wajib diisi.' });

  let target = null;
  let slug = slugParam || '';
  let toolId = null;
  let portalToken = null;

  try {
    if (toolParam.startsWith('paid-')) {
      // Tool berbayar auto-ACC (belum tentu di ai_tools): cari di RPC live.
      const paid = await supaGet('rpc/list_live_paid_tools');
      const row = Array.isArray(paid) ? paid.find((r) => `paid-${r.id}` === toolParam || slugify(r.tool_name) === slugParam) : null;
      if (row) {
        target = row.website_url;
        slug = slugify(row.tool_name);
        toolId = toolParam;
        portalToken = row.portal_token || null;
      }
    } else {
      const rows = await supaGet(`ai_tools?select=id,affiliateUrl,url,name&or=(id.eq.${encodeURIComponent(toolParam)})&limit=1`);
      const row = Array.isArray(rows) && rows[0];
      if (row) {
        target = row.affiliateUrl || row.url;
        slug = slugParam || slugify(row.name);
        toolId = row.id;
      }
    }
  } catch {}

  if (!target || !String(target).startsWith('http')) {
    return res.status(404).json({ error: 'Tool tidak ditemukan.' });
  }

  await recordClick(slug, toolId, portalToken, req.headers.referer || '');
  res.writeHead(302, { Location: appendUtm(target, slug) });
  res.end();
}
