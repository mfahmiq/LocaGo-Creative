# WORKFLOW STANDARDS — LOCAGO CREATIVE ECOSYSTEM
---

## STANDAR MUTU PRODUKSI & WORKFLOW EKOSISTEM LOCAGO CREATIVE (MUTLAK)
Setiap agen (Hermes, Arka, spesialis frontend, backend, content creator, dan daemon otomatisasi) WAJIB mematuhi 5 pilar workflow ekosistem LocaGo Creative berikut tanpa terkecuali:

1. **AI Tools Ingestion (Anti-Broken Logo):**
   - Setiap tool AI baru yang ditambahkan ke database/katalog WAJIB memiliki file logo resmi di `/public/logos/{slug}.png` (resolusi minimal 128px).
   - DILARANG membiarkan field `logoUrl` bernilai `null` yang menyebabkan kartu menampilkan kotak inisial huruf generik.
   - Script kurator wajib mengunduh favicon/logo resmi dari domain tool secara otomatis saat proses kurasi.

2. **Real-time GitHub Trending Integrity:**
   - Data trending repository GitHub WAJIB diambil secara live dan murni dari `https://github.com/trending` (harian, mingguan, bulanan).
   - DILARANG menggunakan mock data, dummy repo, atau query search acak. Repo yang tampil harus 100% otentik sesuai halaman trending resmi GitHub hari ini.

3. **Interaktivitas Pustaka LinkList / Playlist:**
   - Seluruh LinkList dan Playlist publik WAJIB interaktif dan dapat dibuka.
   - Tombol "Buka" wajib menampilkan Detail Playlist Modal yang memuat catatan kurator, video referensi, dan seluruh daftar tool beserta link langsungnya.
   - Routing tab dan URL hash (`#linklists`, `#ai-tools?linklist=...`) tidak boleh bentrok atau rusak.

4. **Standar Thumbnail & Cover Banner (Anti-Duplicate & WebP Only):**
   - Setiap Artikel dan setiap Source Code WAJIB memiliki banner/thumbnail visual unik yang merefleksikan spesifik topik dan tech stack-nya.
   - DILARANG KERAS menduplikasi atau menggunakan 1 gambar default untuk banyak source code (seperti kasus mesin kasir POS untuk semua source code).
   - Seluruh banner/thumbnail WAJIB dikonversi ke format **WebP** berkualitas tinggi namun ultra-ringan (< 30 KB) untuk performa loading maksimal.
   - Komponen frontend WAJIB memiliki fallback `onError` pencegah broken image (kotak hitam).

5. **Safelink & Monetisasi Terpadu (Adsterra & Monetag):**
   - Jaga higienitas pemisahan domain (khususnya `dwollopus.eu.org`).
   - Gunakan format iklan aktif yang disetujui (Popunder, SocialBar, Banner 300x250, Banner 728x90, Native Banner).
   - Maksimalkan jeda 15 detik safelink dengan kartu sponsor interaktif berkonversi tinggi dan script sebelum `</body>`.
