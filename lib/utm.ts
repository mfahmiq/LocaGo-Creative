// lib/utm.ts — UTM standar LocaGo untuk semua link keluar ke tool.
// Aturan (Fahmi 2026-11-19): utm_source=locagocreative, utm_medium=website,
// utm_campaign=ai-tools, utm_content=<slug>. Parameter afiliasi yang sudah
// ada (mis. ?via=locagocreative) TIDAK PERNAH ditimpa — UTM ditempel di
// belakang dengan & (URLSearchParams.set hanya menimpa key UTM itu sendiri).
export const UTM_PARAMS = {
  utm_source: 'locagocreative',
  utm_medium: 'website',
  utm_campaign: 'ai-tools',
} as const;

export function slugifyName(name: string): string {
  return (name || 'tool')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'tool';
}

export function appendUtm(rawUrl?: string, toolName?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.startsWith('http')) return '#';
  const slug = slugifyName(toolName || 'tool');
  try {
    const u = new URL(rawUrl);
    u.searchParams.set('utm_source', UTM_PARAMS.utm_source);
    u.searchParams.set('utm_medium', UTM_PARAMS.utm_medium);
    u.searchParams.set('utm_campaign', UTM_PARAMS.utm_campaign);
    u.searchParams.set('utm_content', slug);
    return u.toString();
  } catch {
    const sep = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${sep}utm_source=locagocreative&utm_medium=website&utm_campaign=ai-tools&utm_content=${encodeURIComponent(slug)}`;
  }
}

export function formatRupiah(n: number): string {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}
