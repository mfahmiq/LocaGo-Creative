// lib/data.ts — hanya konstanta konfigurasi.
//
// Data katalog (AI tools, source code, GitHub trending) TIDAK lagi hardcode
// di file ini: semuanya dibaca dari Supabase via lib/catalogData.ts, supaya
// konten baru langsung live tanpa redeploy. Jangan tambahkan lagi array
// data katalog ke file ini.

export const SAFELINK_BASE_URL = 'https://www.dwollopus.eu.org/2023/05/10-must-have-ai-tools-for-boosting-your.html';
export const DONATION_URL_DEFAULT = 'https://lynk.id/dwollopus'; // Lynk.id donasi min 2rb
export const WA_CONSULT_URL = 'https://wa.me/6285189393354?text=Halo%20LocaGo%20Creative,%20saya%20tertarik%20dengan%20kustomisasi%20source%20code%20atau%20jasa%20website';
