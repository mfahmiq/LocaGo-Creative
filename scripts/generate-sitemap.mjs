// scripts/generate-sitemap.mjs — sitemap build-time untuk rute nyata.
// Dijalankan sebelum vite build (lihat "build" di package.json) dan juga
// di Vercel. Mengambil daftar item dari Supabase (anon key publik, sama
// seperti lib/supabase.ts) lalu menulis public/sitemap.xml.
//
// Aturan visibilitas disamakan dengan yang tampil di situs:
// - Tools: hanya yang LOLOS gatekeeper AIToolsHub (punya logoUrl +
//   affiliateUrl bukan producthunt) ATAU tool berbayar live dari RPC
//   list_live_paid_tools. Tool "futuretools" (needsReview) tidak punya
//   logo/affiliate sehingga otomatis tidak masuk.
// - Artikel & source code: semua baris tabel.
// - lastmod per item = updated_at; hub & home = hari ini.
//
// Fallback: bila Supabase tidak bisa dihubungi saat build (atau kosong),
// pakai scripts/sitemap-fallback.json yang ter-commit. Script TIDAK PERNAH
// menggagalkan build: paling buruk sitemap hanya berisi home + hub.

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'sitemap.xml');
const FALLBACK = join(__dirname, 'sitemap-fallback.json');

const SITE = 'https://www.locagocreative.my.id';
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://mnxbnddjmkruzabhlrtq.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_H-meffsrYDjKI6UuwybniA_EsyPmg46';

const today = new Date().toISOString().slice(0, 10);

function slugifyName(name) {
  return (name || 'tool')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'tool';
}

function dateOf(ts) {
  if (!ts) return today;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function rest(table, select, order = 'sort_order') {
  const url =
    `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}` +
    `&order=${order}&limit=1000`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
  return res.json();
}

async function rpc(fn) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${fn}: HTTP ${res.status}`);
  return res.json();
}

function loadFallback() {
  try {
    if (!existsSync(FALLBACK)) return null;
    const data = JSON.parse(readFileSync(FALLBACK, 'utf8'));
    if (!Array.isArray(data.tools) || !Array.isArray(data.articles) || !Array.isArray(data.sourceCodes)) return null;
    return data;
  } catch {
    return null;
  }
}

async function loadData() {
  try {
    const [toolsRaw, articles, sourceCodes] = await Promise.all([
      rest('ai_tools', 'name,logoUrl,affiliateUrl,needsReview,updated_at'),
      rest('articles', 'slug,updated_at'),
      rest('source_codes', 'slug,updated_at'),
    ]);
    let paid = [];
    try {
      paid = await rpc('list_live_paid_tools');
    } catch {
      paid = [];
    }
    if (!Array.isArray(toolsRaw) || toolsRaw.length === 0) throw new Error('ai_tools kosong');
    const seen = new Set();
    const tools = [];
    for (const t of toolsRaw) {
      // Gatekeeper sama seperti AIToolsHub + needsReview (moderasi): tool
      // yang ditandai tidak tayang tidak masuk sitemap.
      const visible =
        t.needsReview !== true &&
        (t.logoUrl && String(t.logoUrl).trim() &&
          t.affiliateUrl && !String(t.affiliateUrl).toLowerCase().includes('producthunt.com'));
      if (!visible) continue;
      const slug = slugifyName(t.name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      tools.push({ slug, lastmod: dateOf(t.updated_at) });
    }
    // Tool berbayar live (dari RPC) tampil di katalog walau tanpa logo.
    for (const p of Array.isArray(paid) ? paid : []) {
      const slug = slugifyName(p.tool_name || p.name || '');
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      tools.push({ slug, lastmod: dateOf(p.updated_at || p.created_at) });
    }
    return {
      tools,
      articles: (Array.isArray(articles) ? articles : [])
        .filter((a) => a.slug)
        .map((a) => ({ slug: a.slug, lastmod: dateOf(a.updated_at) })),
      sourceCodes: (Array.isArray(sourceCodes) ? sourceCodes : [])
        .filter((s) => s.slug)
        .map((s) => ({ slug: s.slug, lastmod: dateOf(s.updated_at) })),
    };
  } catch (err) {
    console.warn(`[sitemap] Supabase gagal (${err.message}) — pakai fallback.`);
    return loadFallback();
  }
}

function buildXml(data) {
  const urls = [];
  const add = (loc, lastmod, changefreq, priority) =>
    urls.push({ loc, lastmod, changefreq, priority });

  add(`${SITE}/`, today, 'daily', '1.0');
  add(`${SITE}/ai-tools`, today, 'daily', '0.9');
  add(`${SITE}/artikel`, today, 'daily', '0.9');
  add(`${SITE}/source-code`, today, 'daily', '0.9');
  add(`${SITE}/github-trending`, today, 'daily', '0.9');
  add(`${SITE}/linklists`, today, 'weekly', '0.8');
  add(`${SITE}/gratis`, today, 'daily', '0.9');
  for (const t of data.tools || []) add(`${SITE}/tools/${t.slug}`, t.lastmod, 'weekly', '0.8');
  for (const a of data.articles || []) add(`${SITE}/artikel/${a.slug}`, a.lastmod, 'monthly', '0.7');
  for (const s of data.sourceCodes || []) add(`${SITE}/source-code/${s.slug}`, s.lastmod, 'monthly', '0.7');

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const data = (await loadData()) || { tools: [], articles: [], sourceCodes: [] };
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, buildXml(data), 'utf8');
console.log(
  `[sitemap] ${OUT}: ${(data.tools || []).length} tools, ${(data.articles || []).length} artikel, ${(data.sourceCodes || []).length} source-code (+ 6 halaman hub/home).`,
);
