import { supabase } from './supabase';

/**
 * Catalog data source: Supabase ONLY — by design, no bundled JSON fallback.
 *
 * Sejak migrasi 2026-11-18, data katalog (AI tools, source code, linklist,
 * artikel, GitHub trending) tinggal di tabel Supabase — publish baru langsung
 * live tanpa deploy ulang. File JSON lama di public/ sudah dihapus dan TIDAK
 * ada fallback ke data statis: bila Supabase gagal atau tabel kosong, fungsi
 * di bawah mengembalikan null dan komponen menampilkan status loading /
 * pesan error, bukan data basi atau hardcode.
 *
 * Urutan tampil dijaga oleh kolom sort_order di tiap tabel (= urutan array
 * di file JSON lama); query selalu ORDER BY sort_order.
 */

/** Ambil seluruh isi satu tabel katalog, atau null bila Supabase gagal/kosong. */
export async function fetchCatalog<T>(table: string): Promise<T[] | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data as T[];
  } catch {
    return null;
  }
}

/** Hitung jumlah baris satu tabel katalog (untuk badge di Navbar). */
export async function fetchCatalogCount(table: string): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error || typeof count !== 'number') return null;
    return count;
  } catch {
    return null;
  }
}

/**
 * Jumlah AI Tools yang BENAR-BENAR ditampilkan di hub — yaitu yang lolos
 * gatekeeper AIToolsHub (punya logoUrl + affiliateUrl bukan ProductHunt,
 * dan tidak sedang needsReview). Bukan total mentah tabel (604) — itulah
 * sumber ketidaksesuaian badge nav "603+" vs "528 alat" di hub.
 */
export async function fetchToolsDisplayCount(): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .not('logoUrl', 'is', null)
      .neq('logoUrl', '')
      .not('affiliateUrl', 'is', null)
      .not('affiliateUrl', 'ilike', '%producthunt.com%')
      .or('needsReview.is.null,needsReview.is.false');
    if (error || typeof count !== 'number') return null;
    return count;
  } catch {
    return null;
  }
}
