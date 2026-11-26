// Vercel Serverless Function: proxy chat AI konsultasi (/consult) via 9Router.
// Key TIDAK PERNAH ke browser — hanya dibaca dari env server Vercel
// (NINE_ROUTER_API_KEY, type sensitive). Model via NINE_ROUTER_MODEL.
// Menggantikan panggilan Groq langsung dari browser (components/Pricing.tsx
// dan components/Demo.tsx) — key Groq lama terekspos di bundle publik dan
// mati (401/kuota habis), sehingga chat menampilkan fallback 503.
// Pola sama dengan api/midtrans-token.js (server env + CORS + POST only).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.NINE_ROUTER_API_KEY;
  if (!apiKey) {
    console.error('Missing NINE_ROUTER_API_KEY in environment variables');
    return res.status(500).json({ error: 'AI belum dikonfigurasi di server.' });
  }
  const model = process.env.NINE_ROUTER_MODEL || 'gemini/gemini-3-flash-preview';
  const baseUrl = (process.env.NINE_ROUTER_BASE_URL || 'http://43.173.20.80:20128/v1').replace(/\/$/, '');

  try {
    const { messages, temperature, max_tokens } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return res.status(400).json({ error: 'messages harus array 1-12 item.' });
    }
    const clean = [];
    let totalChars = 0;
    for (const m of messages) {
      if (
        !m ||
        (m.role !== 'system' && m.role !== 'user' && m.role !== 'assistant') ||
        typeof m.content !== 'string' ||
        !m.content.trim() ||
        m.content.length > 4000
      ) {
        return res.status(400).json({ error: 'Format messages tidak valid.' });
      }
      totalChars += m.content.length;
      clean.push({ role: m.role, content: m.content });
    }
    if (totalChars > 16000) {
      return res.status(400).json({ error: 'Pesan terlalu panjang.' });
    }
    const temp = Math.min(1, Math.max(0, Number(temperature) || 0.6));
    const maxTokens = Math.min(800, Math.max(50, parseInt(max_tokens, 10) || 400));

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    let up;
    try {
      up = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages: clean, temperature: temp, max_tokens: maxTokens }),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!up.ok) {
      const errText = await up.text().catch(() => '');
      console.error('9Router upstream error:', up.status, errText.slice(0, 300));
      return res.status(502).json({ error: 'Layanan AI sedang sibuk, coba lagi sebentar.', upstream: up.status });
    }
    let data;
    try {
      data = await up.json();
    } catch (e) {
      console.error('9Router returned non-JSON 200:', e);
      return res.status(502).json({ error: 'AI mengembalikan jawaban yang tidak bisa dibaca.', upstream: up.status });
    }
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!reply) {
      return res.status(502).json({ error: 'AI tidak mengembalikan jawaban.' });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error ai-chat proxy:', err);
    return res.status(500).json({ error: 'Terjadi kendala di server AI.', detail: String((err && err.message) || err).slice(0, 200) });
  }
}
