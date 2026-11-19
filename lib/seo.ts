// lib/seo.ts — meta dinamis per rute (SEO rute nyata, bukan hash).
//
// SPA ini dulunya hanya punya SATU set meta di index.html dan semua konten
// di balik hash (#ai-tools, #artikel, ...). Google mengabaikan fragment,
// jadi bagi crawler situs ini praktis satu halaman. Sejak rute nyata
// (/ai-tools, /tools/<slug>, /artikel/<slug>, /source-code/<slug>),
// setiap rute mengatur sendiri title + description + canonical + OG +
// JSON-LD lewat setPageMeta() di bawah.
//
// Catatan: meta ini hanya terlihat crawler yang mengeksekusi JS (Google
// merender JS). Sitemap + canonical tetap menjadi sinyal utama indexing.

export const SITE_URL = 'https://www.locagocreative.my.id';

export const DEFAULT_META = {
  title: 'LocaGo Creative — AI Tools Library, Download Source Code Gratis & Web Agency',
  description:
    'Pusat direktori AI Tools terkurasi, download source code aplikasi gratis (POS Kasir, Absensi QR, Katalog UMKM, SIAKAD), pelacak live GitHub Trending, dan jasa pembuatan website profesional.',
} as const;

export interface PageMeta {
  title: string;
  description: string;
  /** Path kanonis, mis. '/tools/cursor' atau '/ai-tools'. */
  canonicalPath: string;
  /** 'website' untuk hub, 'article' untuk detail artikel/tool/source-code. */
  ogType?: string;
  ogImage?: string;
  /** JSON-LD opsional (objek) untuk halaman detail. */
  jsonLd?: Record<string, unknown>;
}

function upsertMetaByName(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Judul/deskripsi/kanonis/OG/JSON-LD halaman saat ini — dipanggil tiap ganti rute. */
export function setPageMeta(meta: PageMeta): void {
  if (typeof document === 'undefined') return;
  const canonical = `${SITE_URL}${meta.canonicalPath}`;
  const ogType = meta.ogType || 'website';
  const ogImage = meta.ogImage || `${SITE_URL}/logo.png`;

  document.title = meta.title;
  upsertMetaByName('description', meta.description);
  upsertCanonical(canonical);
  upsertMetaByProperty('og:type', ogType);
  upsertMetaByProperty('og:url', canonical);
  upsertMetaByProperty('og:title', meta.title);
  upsertMetaByProperty('og:description', meta.description);
  upsertMetaByProperty('og:image', ogImage);
  upsertMetaByName('twitter:card', 'summary_large_image');
  upsertMetaByName('twitter:title', meta.title);
  upsertMetaByName('twitter:description', meta.description);
  upsertMetaByName('twitter:image', ogImage);

  // JSON-LD halaman: ganti isi script yang sama (id tetap) supaya tidak
  // menumpuk tiap navigasi; hapus bila halaman ini tidak punya JSON-LD.
  const existing = document.getElementById('locago-jsonld');
  if (meta.jsonLd) {
    const script = existing || document.createElement('script');
    script.id = 'locago-jsonld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(meta.jsonLd);
    if (!existing) document.head.appendChild(script);
  } else if (existing) {
    existing.remove();
  }
}

/** 'nama-tool-ai' -> 'Nama Tool Ai' (judul sementara sebelum data item dimuat). */
export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
