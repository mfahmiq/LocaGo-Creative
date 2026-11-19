// Vercel Serverless Function: Portal Pelanggan (read-only, token UUID).
// GET /api/portal?token=<uuid> -> { submission, stats }.
// Pembacaan lewat RPC SECURITY DEFINER get_tool_portal / get_portal_stats:
// hanya baris yang cocok dengan token yang dikembalikan — tidak ada daftar
// submission orang lain. Token yang salah -> 404.
const SUPABASE_URL = 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';

async function callRpc(fn, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = String(req.query?.token || '').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return res.status(400).json({ error: 'Token portal tidak valid.' });
  }
  try {
    const submission = await callRpc('get_tool_portal', { p_token: token });
    if (!submission) return res.status(404).json({ error: 'Portal tidak ditemukan.' });
    const stats = await callRpc('get_portal_stats', { p_token: token });
    return res.status(200).json({ submission, stats });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
