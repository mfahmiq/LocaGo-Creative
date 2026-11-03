import { SourceCodeItem, GitHubTrendingItem, AIToolItem } from '../types';

export const SAFELINK_BASE_URL = 'https://www.dwollopus.eu.org/2023/05/10-must-have-ai-tools-for-boosting-your.html';
export const DONATION_URL_DEFAULT = 'https://lynk.id/dwollopus'; // Lynk.id donasi min 2rb
export const WA_CONSULT_URL = 'https://wa.me/6285189393354?text=Halo%20LocaGo%20Creative,%20saya%20tertarik%20dengan%20kustomisasi%20source%20code%20atau%20jasa%20website';

export const SOURCE_CODE_LIST: SourceCodeItem[] = [
  {
    id: 'sc-1',
    title: 'Sistem Kasir & POS Toko Kelontong UMKM + Struk WA Otomatis',
    slug: 'pos-toko-kelontong-umkm-wa',
    category: 'PHP & Laravel',
    techStack: ['PHP 8.2', 'MySQL', 'Bootstrap 5', 'WhatsApp Gateway'],
    description: 'Aplikasi kasir Point of Sale berbasis web siap pakai untuk UMKM, toko ritel, dan warung kelontong. Dilengkapi pencatatan stok real-time, laporan laba rugi bulanan, scanner barcode kamera HP, dan fitur kirim struk belanja otomatis via WhatsApp ke nomor pelanggan.',
    shortDesc: 'Aplikasi POS kasir toko lengkap dengan database SQL, scanner barcode, dan kirim struk belanja otomatis via WhatsApp.',
    thumbnail: '/banners/gemini/banner_pos_toko.jpg',
    downloadsCount: 1420,
    rating: 4.9,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    demoUrl: 'https://pos-demo.locagocreative.my.id',
    fileSize: '14.2 MB',
    tutorialSteps: [
      'Ekstrak file ZIP ke folder htdocs (XAMPP) atau www (Laragon).',
      'Buka phpMyAdmin, buat database baru bernama `db_pos_toko`.',
      'Import file `database.sql` yang sudah tersedia di dalam folder.',
      'Buka file `config/database.php` dan sesuaikan username/password database.',
      'Akses aplikasi di browser: `http://localhost/pos-toko`. Login default: admin / admin123.'
    ],
    keyFeatures: [
      'Manajemen Inventori & Stok Otomatis berkurang saat transaksi',
      'Kirim Struk Digital PDF langsung ke WhatsApp pelanggan',
      'Dukungan Printer Thermal Bluetooth 58mm & 80mm',
      'Laporan Penjualan harian, mingguan, bulanan ekspor Excel',
      'Level Hak Akses Multi-User (Kasir, Gudang, Owner)'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=pos-toko-kelontong&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-2',
    title: 'Sistem Absensi Guru & Siswa QR Code + Notifikasi WhatsApp Ortu',
    slug: 'absensi-qr-code-whatsapp-sekolah',
    category: 'Google Apps Script',
    techStack: ['Google Apps Script', 'Google Sheets', 'HTML5', 'Fonnte API'],
    description: 'Sistem absensi sekolah berbasis Google Sheets dan Google Apps Script tanpa biaya server bulanan! Siswa atau guru cukup scan kartu QR Code di depan webcam/kamera tablet, data otomatis tersimpan di Google Sheets dan sistem langsung mengirimkan notifikasi WA ke orang tua: "Anak Anda telah hadir di sekolah pukul 07.15 WIB".',
    shortDesc: 'Sistem absensi sekolah 0 biaya server pakai Google Sheets + scan QR Code + auto WhatsApp ke ortu.',
    thumbnail: '/banners/gemini/banner_absensi_gas.jpg',
    downloadsCount: 2310,
    rating: 5.0,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'Google Sheets',
    fileSize: '3.8 MB',
    tutorialSteps: [
      'Buka Google Drive Anda, buat salinan dari template spreadsheet master.',
      'Klik menu Ekstensi > Apps Script di spreadsheet tersebut.',
      'Salin kode script dari file `Code.gs` dan `index.html` yang disediakan.',
      'Masukkan Token WhatsApp Gateway Anda di bagian variabel `WA_TOKEN`.',
      'Klik Deploy > Web App > Akses Siapa Saja. Buka link web app di browser!'
    ],
    keyFeatures: [
      '100% Gratis Server Seumur Hidup memanfaatkan infrastruktur Google',
      'Scanner QR Code responsif di Android, iPad, dan laptop webcam',
      'Notifikasi WhatsApp otomatis terkirim real-time ke orang tua',
      'Rekapitulasi persentase kehadiran bulanan otomatis rumus Sheets',
      'Cetak ID Card QR Siswa massal dengan 1 klik'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=absensi-sekolah-gas&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-3',
    title: 'Landing Page Katalog Produk UMKM + Direct Checkout WhatsApp',
    slug: 'landing-page-katalog-umkm-nextjs',
    category: 'Next.js & React',
    techStack: ['Next.js 14', 'Tailwind CSS', 'TypeScript', 'Lucide Icons'],
    description: 'Template website katalog premium siap deploy ke Vercel atau Cloudflare Pages gratis. Tampilan elegan, ultra-cepat (skor Google Lighthouse 99), dilengkapi keranjang belanja multi-item yang otomatis merangkum pesanan menjadi format pesan WhatsApp rapi siap kirim.',
    shortDesc: 'Template landing page katalog modern Next.js + Tailwind. Order langsung kirim pesan rapi ke WhatsApp.',
    thumbnail: '/banners/gemini/banner_katalog_umkm.jpg',
    downloadsCount: 980,
    rating: 4.8,
    isPopular: false,
    isFree: true,
    hasDatabase: false,
    demoUrl: 'https://katalog-demo.locagocreative.my.id',
    fileSize: '5.2 MB',
    tutorialSteps: [
      'Clone atau ekstrak folder ke komputer lokal Anda.',
      'Jalankan perintah `npm install` di terminal.',
      'Ubah nomor WhatsApp admin di file `src/config/site.ts`.',
      'Tambahkan daftar produk dan foto di file `src/data/products.json`.',
      'Deploy gratis ke Vercel dengan menjalankan perintah `vercel` atau via GitHub.'
    ],
    keyFeatures: [
      'Skor SEO & Kecepatan 99+ di Google PageSpeed Insights',
      'Keranjang belanja lokal (LocalStorage) tanpa perlu login akun',
      'Generator pesan WhatsApp terstruktur (nama, alamat, rincian produk, total bayar)',
      'Dark mode dan light mode otomatis mengikuti sistem HP',
      'Mobile-first responsive design mirip aplikasi native'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=katalog-nextjs-tailwind&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-4',
    title: 'Bot WhatsApp AI Asisten CS Penjawab Otomatis Berbasis Python',
    slug: 'bot-wa-ai-customer-service-python',
    category: 'Python & AI',
    techStack: ['Python 3.11', 'FastAPI', 'Groq / OpenAI API', 'SQLite'],
    description: 'Source code bot WhatsApp pintar yang bisa dilatih menggunakan dokumen PDF bisnis Anda (RAG lokal). Bot otomatis menjawab pertanyaan pelanggan 24/7 dengan bahasa sopan dan ramah, mengecek harga produk, jam buka, hingga menyimpan kontak prospek masuk ke database SQLite.',
    shortDesc: 'Bot WhatsApp pintar CS otomatis pakai AI LLM lokal/Groq. Jawab chat pelanggan 24 jam nonstop.',
    thumbnail: '/banners/gemini/banner_bot_wa.jpg',
    downloadsCount: 1850,
    rating: 4.9,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'SQLite',
    fileSize: '8.5 MB',
    tutorialSteps: [
      'Install Python 3.10 atau 3.11 di server VPS atau laptop.',
      'Jalankan `pip install -r requirements.txt`.',
      'Buka file `.env.example`, ubah jadi `.env`, lalu masukkan API Key AI Anda.',
      'Isi pengetahuan bisnis di file `knowledge_base.txt`.',
      'Jalankan server dengan `python main.py`. Scan QR Code WhatsApp di terminal!'
    ],
    keyFeatures: [
      'Kustomisasi karakter bot (nada bicara founder/CS ramah)',
      'Basis pengetahuan dokumen kustom (bisa ubah tanpa coding ulang)',
      'Sistem anti-spam dan pembatas pesan beruntun',
      'Penyimpanan database riwayat chat otomatis ke SQLite',
      'Hemat biaya token dengan model open-weight Llama 3 via Groq'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=bot-wa-ai-cs-python&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-5',
    title: 'Aplikasi Billing Rental PS & Cafe PC Game (Desktop Python Tkinter)',
    slug: 'billing-rental-ps-cafe-game-desktop',
    category: 'Mobile & Desktop',
    techStack: ['Python', 'CustomTkinter', 'SQLite', 'ReportLab PDF'],
    description: 'Aplikasi desktop offline untuk pemilik rental PlayStation (PS3, PS4, PS5) dan Cafe Gaming. Dilengkapi timer countdown per televisi/unit, alarm suara ketika waktu sewa habis, sistem tarif fleksibel (per jam / paket malam / open play), dan rekap pendapatan harian.',
    shortDesc: 'Software kasir billing rental PS dengan timer otomatis, alarm habis waktu, dan cetak laporan.',
    thumbnail: '/banners/gemini/banner_billing_ps.jpg',
    downloadsCount: 760,
    rating: 4.7,
    isPopular: false,
    isFree: true,
    hasDatabase: true,
    databaseType: 'SQLite',
    fileSize: '18.1 MB',
    tutorialSteps: [
      'Ekstrak file source code ke komputer Windows Anda.',
      'Jalankan file executable `BillingRentalPS.exe` (atau `python app.py`).',
      'Atur tarif per jam dan jumlah unit TV di menu Pengaturan.',
      'Klik tombol "Mulai Sesi" pada nomor TV yang ingin disewa pelanggan.',
      'Aplikasi siap digunakan offline tanpa internet!'
    ],
    keyFeatures: [
      'Dukungan hingga 32 unit konsol / televisi bersamaan',
      'Alarm audio otomatis berbunyi saat waktu sewa tersisa 5 menit & selesai',
      'Pencatatan pesanan makanan & minuman (F&B) digabung ke tagihan rental',
      'Laporan omzet harian anti-manipulasi kasir dengan proteksi password owner',
      '100% Offline tanpa butuh koneksi internet'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=billing-rental-ps-desktop&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-6',
    title: 'Website Portal Donasi Transparan Online + Verifikasi Mutasi Bank',
    slug: 'portal-donasi-transparan-mutasi-bank',
    category: 'PHP & Laravel',
    techStack: ['Laravel 11', 'Tailwind CSS', 'MySQL', 'Midtrans / QRIS'],
    description: 'Platform crowdfunding dan galang dana sosial mandiri tanpa potongan komisi pihak ketiga. Dilengkapi penghitung donasi real-time progress bar, kode unik transfer otomatis, daftar doa dari para donatur, dan laporan penyaluran dana transparan.',
    shortDesc: 'Source code platform donasi online lengkap dengan progress bar target dana & verifikasi otomatis.',
    thumbnail: '/banners/gemini/banner_portal_donasi.jpg',
    downloadsCount: 1120,
    rating: 4.9,
    isPopular: false,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    fileSize: '22.4 MB',
    tutorialSteps: [
      'Clone repository dan jalankan `composer install` serta `npm install`.',
      'Salin `.env.example` ke `.env` dan atur konfigurasi database MySQL.',
      'Jalankan `php artisan migrate --seed` untuk mengimpor skema dan data awal.',
      'Jalankan `php artisan key:generate` dan `php artisan storage:link`.',
      'Jalankan `php artisan serve` untuk membuka aplikasi di `http://127.0.0.1:8000`.'
    ],
    keyFeatures: [
      'Halaman kampanye donasi interaktif dengan target nominal & batas waktu',
      'Integrasi QRIS Dinamis dan Virtual Account via Payment Gateway',
      'Papan kolom doa & ucapan dari donatur dengan sensor kata kasar',
      'Laporan transparansi penyaluran dana publik disertai bukti foto kuitansi',
      'Notifikasi WhatsApp otomatis berisi tanda terima kasih ke donatur'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=portal-donasi-laravel&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-7',
    title: 'Sistem Informasi Akademik Sekolah (SIAKAD Modern) Multi-Role',
    slug: 'siakad-sekolah-laravel-modern',
    category: 'PHP & Laravel',
    techStack: ['Laravel 11', 'Tailwind CSS', 'MySQL', 'Livewire'],
    description: 'Aplikasi SIAKAD sekolah lengkap untuk manajemen data siswa, guru, kelas, mata pelajaran, jadwal KBM, dan e-Rapot kurikulum merdeka. Tampilan modern dark-slate dengan dashboard statistik real-time.',
    shortDesc: 'Aplikasi SIAKAD sekolah lengkap e-Rapot kurikulum merdeka, jadwal KBM, dan kelola nilai siswa.',
    thumbnail: '/banners/gemini/banner_siakad.jpg',
    downloadsCount: 1680,
    rating: 4.9,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    fileSize: '28.5 MB',
    tutorialSteps: [
      'Ekstrak file source code ke folder Laragon atau XAMPP.',
      'Buat database baru di phpMyAdmin bernama `db_siakad_sekolah`.',
      'Import file `siakad_master.sql` yang sudah disertakan lengkap dengan data dummy.',
      'Konfigurasi file `.env` untuk koneksi database.',
      'Jalankan `php artisan serve` dan login dengan akun admin: `admin@sekolah.sch.id` / `admin123`.'
    ],
    keyFeatures: [
      'Multi-Role Hak Akses: Administrator, Kepala Sekolah, Guru Pengajar, Wali Kelas, Siswa',
      'Cetak Rapot Digital PDF siap tanda tangan dan stempel',
      'Manajemen Kenaikan Kelas & Mutasi Siswa otomatis',
      'Jadwal Pelajaran anti-bentrok guru dan ruangan',
      'Dashboard grafik kehadiran & rata-rata nilai siswa'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=siakad-sekolah-laravel&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-8',
    title: 'Sistem Informasi Perpustakaan Digital (SIPERPUS) + Kartu Anggota QR',
    slug: 'siperpus-digital-qr-code',
    category: 'PHP & Laravel',
    techStack: ['CodeIgniter 4', 'Bootstrap 5', 'MySQL', 'QR Code Generator'],
    description: 'Sistem informasi perpustakaan sekolah dan kampus dengan katalog buku digital, sirkulasi peminjaman/pengembalian otomatis, denda harian terhitung otomatis, dan cetak kartu anggota ber-barcode/QR Code.',
    shortDesc: 'Sistem perpustakaan digital lengkap scanner kartu QR, hitung denda otomatis, dan ekspor laporan.',
    thumbnail: '/banners/gemini/banner_siperpus.jpg',
    downloadsCount: 1940,
    rating: 5.0,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    fileSize: '16.8 MB',
    tutorialSteps: [
      'Ekstrak folder ke direktori server web lokal Anda.',
      'Buat database `db_siperpus` lalu import file `database.sql`.',
      'Buka file `app/Config/Database.php` dan sesuaikan username/password.',
      'Akses `http://localhost/siperpus` di browser.',
      'Login Admin: `admin` / `admin123`.'
    ],
    keyFeatures: [
      'Pencarian buku cepat OPAC (Online Public Access Catalog)',
      'Transaksi peminjaman & pengembalian scan QR Code dalam 3 detik',
      'Kalkulasi denda keterlambatan buku otomatis per hari',
      'Generator & cetak kartu anggota perpustakaan format PDF',
      'Laporan sirkulasi buku bulanan & buku paling favorit dipinjam'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=siperpus-digital-qr&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-9',
    title: 'Aplikasi Manajemen Surat Masuk & Disposisi Digital (AMS Instansi)',
    slug: 'manajemen-surat-disposisi-digital',
    category: 'PHP & Laravel',
    techStack: ['PHP 8.2 Native', 'Tailwind CSS', 'MySQLi', 'PDF Viewer'],
    description: 'Aplikasi pengarsipan surat masuk, surat keluar, lembar disposisi digital pimpinan, dan buku agenda surat untuk instansi pemerintah, kelurahan, sekolah, maupun kantor swasta.',
    shortDesc: 'Sistem arsip surat dinas masuk & keluar lengkap lembar disposisi pimpinan dan upload berkas PDF.',
    thumbnail: '/banners/gemini/banner_ams_surat.jpg',
    downloadsCount: 1350,
    rating: 4.8,
    isPopular: false,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    fileSize: '11.4 MB',
    tutorialSteps: [
      'Ekstrak file ZIP ke direktori htdocs / www.',
      'Import file `db_surat_instansi.sql` ke MySQL phpMyAdmin.',
      'Buka file `koneksi.php` dan pastikan konfigurasi DB sudah cocok.',
      'Akses `http://localhost/manajemen-surat` melalui browser.',
      'Login akun: `admin` / `password123`.'
    ],
    keyFeatures: [
      'Pencatatan nomor agenda surat otomatis anti-duplikasi',
      'Lembar disposisi online dari pimpinan langsung ke staf pelaksana',
      'Preview dokumen PDF surat asli langsung di browser tanpa download',
      'Klasifikasi kode surat dinas standar Permendagri',
      'Cetak buku agenda surat masuk & keluar per periode tanggal'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=manajemen-surat-disposisi&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  },
  {
    id: 'sc-10',
    title: 'Aplikasi Point of Sale (POS Kasir Ritel) + Struk Digital WhatsApp',
    slug: 'pos-kasir-ritel-modern-wa',
    category: 'PHP & Laravel',
    techStack: ['PHP 8.2', 'MySQL', 'Tailwind CSS', 'WhatsApp Gateway'],
    description: 'Sistem POS kasir ritel modern dengan antarmuka kasir layar sentuh, manajemen multi-cabang, barcode scanner, dan pengiriman invoice/struk digital langsung ke nomor WhatsApp pelanggan.',
    shortDesc: 'Software kasir ritel modern responsif barcode scanner, manajemen stok multi-cabang, dan struk WA.',
    thumbnail: '/banners/gemini/banner_pos_ritel.jpg',
    downloadsCount: 2180,
    rating: 4.9,
    isPopular: true,
    isFree: true,
    hasDatabase: true,
    databaseType: 'MySQL (.sql)',
    fileSize: '19.7 MB',
    tutorialSteps: [
      'Ekstrak file ke server lokal (XAMPP/Laragon).',
      'Import database `db_pos_ritel.sql` via phpMyAdmin.',
      'Atur kredensial koneksi di `config/database.php`.',
      'Buka aplikasi di browser dan lakukan login kasir atau admin.',
      'Hubungkan nomor WhatsApp toko di menu Integrasi Notifikasi.'
    ],
    keyFeatures: [
      'Transaksi kasir super cepat dengan shortcut keyboard & barcode scanner',
      'Kirim struk belanja resmi otomatis format PDF ke WhatsApp pembeli',
      'Peringatan otomatis saat stok produk menipis (Low Stock Alert)',
      'Dukungan printer kasir thermal USB & Bluetooth (58/80mm)',
      'Laporan omzet, margin keuntungan bersih, dan rekap kasir harian'
    ],
    downloadUrlFree: `${SAFELINK_BASE_URL}?item=pos-kasir-ritel-wa&step=1&target=drive`,
    downloadUrlFast: 'https://lynk.id/dwollopus'
  }
];

export const GITHUB_TRENDING_LIST: GitHubTrendingItem[] = [
  {
    id: 'gh-1',
    name: 'T3 Code',
    repo: 'pingdotgg/t3code',
    starsToday: 3094,
    totalStars: '3.1k',
    category: 'Dev Tools & Automation',
    oneSentencePitch: 'Aplikasi desktop dan mobile open-source buat mengontrol semua agen AI coding (Claude Code, Codex, Cursor, Grok) dari satu layar.',
    features: [
      'Multi-agent harness control: hubungkan Claude, Codex, Cursor, dan Grok',
      'Satu tombol auto-commit, push, dan buat Pull Request lengkap dengan changelog',
      'Aplikasi native di Mac, Windows, Linux serta remote mobile di iOS & Android'
    ],
    benefits: [
      'Gak perlu bolak-balik buka belasan tab terminal',
      'Orkestrasi tim agen AI jadi sangat rapi dan produktif'
    ],
    mediaType: 'image',
    mediaUrl: 'https://t3.codes/_astro/app-desktop.BHuzLVLF.webp',
    officialSite: 'https://t3.codes'
  },
  {
    id: 'gh-2',
    name: 'Claude-Mem (Grok Mem)',
    repo: 'thedotmack/claude-mem',
    starsToday: 1526,
    totalStars: '13.8k',
    category: 'AI Agents & LLM',
    oneSentencePitch: 'Sistem memori jangka panjang open-source buat AI agent coding supaya gak gampang pikun saat pindah sesi chat.',
    features: [
      'Otomatis mencatat keputusan arsitektur & bug ke SQLite lokal',
      'Injeksi progres sebelumnya ke sesi baru tanpa bikin boros token API',
      'Web viewer UI bawaan buat memantau memori yang dipelajari agen secara realtime'
    ],
    benefits: [
      'Gak perlu copy-paste penjelasan awal berulang-ulang',
      'Hemat pemakaian kuota token API sampai 40%'
    ],
    mediaType: 'gif',
    mediaUrl: 'https://raw.githubusercontent.com/thedotmack/claude-mem/main/docs/public/cm-preview.gif',
    officialSite: 'https://grok-mem.ai'
  },
  {
    id: 'gh-3',
    name: 'AI Engineering Hub',
    repo: 'patchy631/ai-engineering-hub',
    starsToday: 1191,
    totalStars: '40.3k',
    category: 'AI Agents & LLM',
    oneSentencePitch: 'Koleksi 93+ proyek AI siap pakai dari level pemula sampai mahir, lengkap dengan tutorial sistem RAG, vision, dan agen mandiri.',
    features: [
      'Kode siap jalan: OCR lokal Llama 3.2, kloning ChatGPT, hingga web crawler cerdas',
      'Panduan optimasi context engineering, RAG tingkat lanjut, dan fine-tuning',
      'Terbagi rapi dalam 3 level kesulitan lengkap dengan diagram arsitekturnya'
    ],
    benefits: [
      'Hemat ratusan jam belajar AI tanpa perlu beli kursus mahal',
      'Bisa langsung comot arsitektur kode buat dipakai di proyek komersial'
    ],
    mediaType: 'image',
    mediaUrl: 'https://raw.githubusercontent.com/patchy631/ai-engineering/main/resources/join_ddods.png'
  },
  {
    id: 'gh-4',
    name: 'Hex Voice Dictation',
    repo: 'anomalyco/hex',
    starsToday: 1179,
    totalStars: '3.2k',
    category: 'Productivity & Media',
    oneSentencePitch: 'Aplikasi dikte suara lokal untuk Mac, Windows, dan Linux: tahan shortcut, bicara, teks langsung tertempel di kursor.',
    features: [
      'Transkripsi 100% diproses di perangkat lokal tanpa kirim audio ke cloud',
      'Model AI suara diunduh otomatis sekali di awal dan jalan offline seumur hidup',
      'Integrasi CLI dan MCP buat baca riwayat transkripsi langsung dari kode'
    ],
    benefits: [
      'Ngetik naskah atau catatan panjang 3x lebih cepat tanpa pegal tangan',
      'Privasi percakapan dan data terjamin aman di komputer lokal'
    ],
    mediaType: 'image',
    mediaUrl: 'https://anoma.ly/hex/shout-idle.webp',
    officialSite: 'https://anoma.ly/hex'
  },
  {
    id: 'gh-5',
    name: 'Lightpanda Browser',
    repo: 'lightpanda-io/browser',
    starsToday: 825,
    totalStars: '40.8k',
    category: 'Web & Scrapers',
    oneSentencePitch: 'Browser headless super kencang khusus buat AI agent dan scraping web, dibangun murni pakai Zig — bukan fork dari Chromium.',
    features: [
      '16x lebih hemat konsumsi RAM dan 9x lebih cepat dibanding Chrome headless biasa',
      'Ekspor halaman web langsung jadi Markdown bersih atau file PDF',
      'Mendukung server MCP native dan kompatibel penuh dengan Puppeteer & Playwright'
    ],
    benefits: [
      'Server VPS spek murah gak gampang crash saat scraping massal',
      'Kecepatan crawling agen AI naik drastis tanpa makan resource laptop'
    ],
    mediaType: 'image',
    mediaUrl: 'https://cdn.lightpanda.io/assets/images/github/execution-time-v2.svg',
    officialSite: 'https://lightpanda.io'
  }
];

export const AI_TOOLS_LIST: AIToolItem[] = [
  {
    "id": "ai-1",
    "name": "v0 by Vercel",
    "logoUrl": "/logos/v0-by-vercel.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Komponen UI/UX React, Tailwind & Shadcn Instan dari Prompt",
    "description": "v0 by Vercel adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://v0.dev/?ref=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-2",
    "name": "Cursor AI",
    "logoUrl": "/logos/cursor-ai.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "IDE AI Coding Terpopuler yang Menggantikan VS Code Biasa",
    "description": "Cursor AI adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://cursor.com/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-3",
    "name": "Bolt.new",
    "logoUrl": "/logos/boltnew.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Bangun, Jalankan & Deploy Full-Stack Web App Langsung di Browser",
    "description": "Bolt.new adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://bolt.new/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-4",
    "name": "Replit Agent",
    "logoUrl": "/logos/replit-agent.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Agen AI yang Mengembangkan & Men-Deploy Aplikasi Web Lengkap",
    "description": "Replit Agent adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://replit.com/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-5",
    "name": "GitHub Copilot",
    "logoUrl": "/logos/github-copilot.png",
    "category": "AI Coding",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "AI Pair Programmer Standar Industri Dunia yang Terintegrasi di IDE",
    "description": "GitHub Copilot adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://github.com/features/copilot?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-6",
    "name": "Windsurf by Codeium",
    "logoUrl": "/logos/windsurf-by-codeium.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "IDE AI Agentic Pertama di Dunia dengan Fitur Flows & Cascade",
    "description": "Windsurf by Codeium adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://codeium.com/windsurf?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-7",
    "name": "Aider",
    "logoUrl": "/logos/aider.png",
    "category": "AI Coding",
    "pricingType": "Free",
    "commissionRate": "Partner Program",
    "tagline": "AI Pair Programming Langsung di Terminal Command Line Anda",
    "description": "Aider adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://aider.chat/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-8",
    "name": "Supermaven",
    "logoUrl": "/logos/supermaven.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Autocomplete Kode Tercepat di Dunia dengan 1 Juta Token Context",
    "description": "Supermaven adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://supermaven.com/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-9",
    "name": "Tabnine",
    "logoUrl": "/logos/tabnine.png",
    "category": "AI Coding",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Asisten Coding AI Privat & Aman untuk Perusahaan dan Tim Dev",
    "description": "Tabnine adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.tabnine.com/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-10",
    "name": "Continue.dev",
    "logoUrl": "/logos/continuedev.png",
    "category": "AI Coding",
    "pricingType": "Free",
    "commissionRate": "Partner Program",
    "tagline": "Ekstensi Autopilot Open-Source untuk VS Code dan JetBrains",
    "description": "Continue.dev adalah software kecerdasan buatan terdepan di bidang AI Coding yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Coding",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://continue.dev/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-11",
    "name": "ElevenLabs",
    "logoUrl": "/logos/elevenlabs.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Voice AI & Text-to-Speech Paling Realistis di Dunia",
    "description": "ElevenLabs adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://elevenlabs.io/?from=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-12",
    "name": "Suno AI",
    "logoUrl": "/logos/suno-ai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Lagu & Musik Lengkap Vokal AI Kualitas Siar Profesional",
    "description": "Suno AI adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://suno.com/?via=locagocreative",
    "isFeatured": true
  },
  {
    "id": "ai-13",
    "name": "Udio AI",
    "logoUrl": "/logos/udio-ai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Musik AI Tingkat Lanjut dengan Harmoni dan Vokal Detail",
    "description": "Udio AI adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.udio.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-14",
    "name": "Descript",
    "logoUrl": "/logos/descript.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Edit Video & Audio Podcast Semudah Mengedit Dokumen Teks",
    "description": "Descript adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.descript.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-15",
    "name": "Speechify",
    "logoUrl": "/logos/speechify.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Aplikasi Text-to-Speech #1 untuk Membaca Buku & Dokumen Cepat",
    "description": "Speechify adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://speechify.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-16",
    "name": "Lovo.ai",
    "logoUrl": "/logos/lovoai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Platform Voiceover AI dengan 500+ Suara untuk Video Marketing",
    "description": "Lovo.ai adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://lovo.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-17",
    "name": "Murf.ai",
    "logoUrl": "/logos/murfai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Studio Voice Generator AI untuk Presentasi Bisnis & Iklan",
    "description": "Murf.ai adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://murf.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-18",
    "name": "Krisp.ai",
    "logoUrl": "/logos/krispai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Penghilang Suara Bising Latar Belakang & Notulen Rapat AI",
    "description": "Krisp.ai adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://krisp.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-19",
    "name": "Otter.ai",
    "logoUrl": "/logos/otterai.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Asisten Transkripsi Rapat Zoom & Google Meet Otomatis Real-Time",
    "description": "Otter.ai adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://otter.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-20",
    "name": "Podcastle",
    "logoUrl": "/logos/podcastle.png",
    "category": "Voice & Audio AI",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Studio Perekaman dan Pengeditan Podcast AI All-in-One",
    "description": "Podcastle adalah software kecerdasan buatan terdepan di bidang Voice & Audio AI yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Voice & Audio AI",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://podcastle.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-21",
    "name": "Midjourney",
    "logoUrl": "/logos/midjourney.png",
    "category": "Video & Graphics",
    "pricingType": "Paid",
    "commissionRate": "Partner Program",
    "tagline": "Generator Gambar AI Paling Sinematik & Estetik untuk Desainer",
    "description": "Midjourney adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.midjourney.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-22",
    "name": "HeyGen",
    "logoUrl": "/logos/heygen.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Avatar AI Sinematik & Video Juru Bicara Tanpa Perlu Masuk Kamera",
    "description": "HeyGen adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.heygen.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-23",
    "name": "Runway Gen-3",
    "logoUrl": "/logos/runway-gen-3.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Video Sinematik Teks-ke-Video Tingkat Studio Hollywood",
    "description": "Runway Gen-3 adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://runwayml.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-24",
    "name": "Kling AI",
    "logoUrl": "/logos/kling-ai.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Video AI Fotorealistik 1080p dengan Fisika Nyata",
    "description": "Kling AI adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://klingai.com/affiliate",
    "isFeatured": false
  },
  {
    "id": "ai-25",
    "name": "Luma Dream Machine",
    "logoUrl": "/logos/luma-dream-machine.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Video AI Sinematik 5 Detik Berkecepatan Tinggi",
    "description": "Luma Dream Machine adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://lumalabs.ai/dream-machine?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-26",
    "name": "Opus Clip",
    "logoUrl": "/logos/opus-clip.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "#1 AI Video Repurposing: Ubah Video Panjang Jadi 10 Klip Viral",
    "description": "Opus Clip adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.opus.pro/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-27",
    "name": "Pictory AI",
    "logoUrl": "/logos/pictory-ai.png",
    "category": "Video & Graphics",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Ubah Naskah Teks Jadi Video Sinematik Siap Upload dalam 3 Menit",
    "description": "Pictory AI adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://pictory.ai/?ref=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-28",
    "name": "Viggle AI",
    "logoUrl": "/logos/viggle-ai.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Gerakkan Foto Karakter Apapun Menjadi Video Gerak Sesuai Referensi",
    "description": "Viggle AI adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://viggle.ai/affiliate",
    "isFeatured": false
  },
  {
    "id": "ai-29",
    "name": "Pika Labs",
    "logoUrl": "/logos/pika-labs.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Platform Pembuatan Video AI dengan Efek Pikaffects Spesial",
    "description": "Pika Labs adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://pika.art/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-30",
    "name": "Magnific AI",
    "logoUrl": "/logos/magnific-ai.png",
    "category": "Video & Graphics",
    "pricingType": "Paid",
    "commissionRate": "Partner Program",
    "tagline": "Upscaler & Enhancer Gambar AI Tertinggi dengan Halusinasi Detail",
    "description": "Magnific AI adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://magnific.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-31",
    "name": "CapCut Commerce",
    "logoUrl": "/logos/capcut-commerce.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Editor Video TikTok & Reels Populer dengan Generator Model AI",
    "description": "CapCut Commerce adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.capcut.com/affiliate",
    "isFeatured": false
  },
  {
    "id": "ai-32",
    "name": "Clipdrop by Jasper",
    "logoUrl": "/logos/clipdrop-by-jasper.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Suite Alat Manipulasi Foto AI: Hapus Objek, Background & Relight",
    "description": "Clipdrop by Jasper adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://clipdrop.co/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-33",
    "name": "Leonardo.Ai",
    "logoUrl": "/logos/leonardoai.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Seni AI Canggih untuk Game Asset, Ilustrasi & Model",
    "description": "Leonardo.Ai adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://leonardo.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-34",
    "name": "Recraft.ai",
    "logoUrl": "/logos/recraftai.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Generator Grafis Vektor SVG dan Ikon 3D Profesional untuk UI/UX",
    "description": "Recraft.ai adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.recraft.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-35",
    "name": "Krea.ai",
    "logoUrl": "/logos/kreaai.png",
    "category": "Video & Graphics",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Kanvas Generasi Gambar & Video AI Real-Time dengan Latensi Instan",
    "description": "Krea.ai adalah software kecerdasan buatan terdepan di bidang Video & Graphics yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Video & Graphics",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.krea.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-36",
    "name": "Systeme.io",
    "logoUrl": "/logos/systemeio.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Platform Funnel, Email Marketing & Kursus All-in-One Gratis",
    "description": "Systeme.io adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://systeme.io/id?sa=sa0285473359ae5985c82865330cf1a062d892e972",
    "isFeatured": false
  },
  {
    "id": "ai-37",
    "name": "Make.com",
    "logoUrl": "/logos/makecom.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Otomatisasi Alur Kerja Visual Tanpa Batas (Alternatif Zapier)",
    "description": "Make.com adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.make.com/en/register?pc=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-38",
    "name": "Chatbase",
    "logoUrl": "/logos/chatbase.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Bikin Chatbot AI Custom dari File PDF & Website Bisnis Sendiri",
    "description": "Chatbase adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.chatbase.co/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-39",
    "name": "Browse AI",
    "logoUrl": "/logos/browse-ai.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Scraper & Monitor Data Website Tanpa Koding (No-Code)",
    "description": "Browse AI adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.browse.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-40",
    "name": "Voiceflow",
    "logoUrl": "/logos/voiceflow.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Platform Perancangan & Deployment Agen Chatbot AI Enterprise",
    "description": "Voiceflow adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.voiceflow.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-41",
    "name": "Zapier Central",
    "logoUrl": "/logos/zapier-central.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Asisten AI yang Menghubungkan Ribuan Aplikasi Bisnis Tanpa API",
    "description": "Zapier Central adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://zapier.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-42",
    "name": "Notion AI",
    "logoUrl": "/logos/notion-ai.png",
    "category": "Automation & No-Code",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Asisten Produktivitas Dokumen, Wiki Tim & Manajemen Tugas Otomatis",
    "description": "Notion AI adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.notion.so/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-43",
    "name": "Bardeen.ai",
    "logoUrl": "/logos/bardeenai.png",
    "category": "Automation & No-Code",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Ekstensi Browser Otomasi Sekali Klik untuk Riset & Data Scraping",
    "description": "Bardeen.ai adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.bardeen.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-44",
    "name": "GoAPI",
    "logoUrl": "/logos/goapi.png",
    "category": "Automation & No-Code",
    "pricingType": "Paid",
    "commissionRate": "Partner Program",
    "tagline": "API Midjourney, Kling & Video Generation untuk Developer",
    "description": "GoAPI adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://goapi.ai/affiliate",
    "isFeatured": false
  },
  {
    "id": "ai-45",
    "name": "ActiveCampaign AI",
    "logoUrl": "/logos/activecampaign-ai.png",
    "category": "Automation & No-Code",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Otomasi Email Marketing & CRM Cerdas untuk Bisnis Berbasis Data",
    "description": "ActiveCampaign AI adalah software kecerdasan buatan terdepan di bidang Automation & No-Code yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan Automation & No-Code",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.activecampaign.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-46",
    "name": "Perplexity AI",
    "logoUrl": "/logos/perplexity-ai.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Mesin Pencari Berbasis AI dengan Kutipan Sumber Faktual Real-Time",
    "description": "Perplexity AI adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://perplexity.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-47",
    "name": "Koala AI",
    "logoUrl": "/logos/koala-ai.png",
    "category": "AI Writing & SEO",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "AI Penulis Artikel SEO Lengkap dengan Data Realtime Google",
    "description": "Koala AI adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://koala.sh/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-48",
    "name": "Writesonic",
    "logoUrl": "/logos/writesonic.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Platform Copywriting & Riset Konten SEO Bertenaga AI Generatif",
    "description": "Writesonic adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://writesonic.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-49",
    "name": "Surfer SEO",
    "logoUrl": "/logos/surfer-seo.png",
    "category": "AI Writing & SEO",
    "pricingType": "Paid",
    "commissionRate": "Partner Program",
    "tagline": "Tool Riset & Optimasi On-Page SEO #1 untuk Masuk Halaman 1 Google",
    "description": "Surfer SEO adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://surferseo.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-50",
    "name": "Copy.ai",
    "logoUrl": "/logos/copyai.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Otomasi Alur Kerja GTM (Go-to-Market) & Copywriting Tim Penjualan",
    "description": "Copy.ai adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.copy.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-51",
    "name": "Jasper AI",
    "logoUrl": "/logos/jasper-ai.png",
    "category": "AI Writing & SEO",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Platform Penulisan Konten Marketing & Suara Brand untuk Perusahaan",
    "description": "Jasper AI adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://www.jasper.ai/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-52",
    "name": "Monica AI",
    "logoUrl": "/logos/monica-ai.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Asisten AI All-in-One di Browser Sidebar (ChatGPT, Claude, Gemini)",
    "description": "Monica AI adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://monica.im/affiliate",
    "isFeatured": false
  },
  {
    "id": "ai-53",
    "name": "Rytr.me",
    "logoUrl": "/logos/rytrme.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Asisten Penulis Copywriting Ringan, Cepat & Terjangkau untuk Pemula",
    "description": "Rytr.me adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://rytr.me/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-54",
    "name": "QuillBot",
    "logoUrl": "/logos/quillbot.png",
    "category": "AI Writing & SEO",
    "pricingType": "Freemium",
    "commissionRate": "Partner Program",
    "tagline": "Tool Parafrase, Grammar Checker & Peringkas Kalimat Terbaik",
    "description": "QuillBot adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://quillbot.com/?via=locagocreative",
    "isFeatured": false
  },
  {
    "id": "ai-55",
    "name": "Frase.io",
    "logoUrl": "/logos/fraseio.png",
    "category": "AI Writing & SEO",
    "pricingType": "Free Trial",
    "commissionRate": "Partner Program",
    "tagline": "Riset Konten SEO & Pembuat Brief Artikel Berdasarkan SERP Google",
    "description": "Frase.io adalah software kecerdasan buatan terdepan di bidang AI Writing & SEO yang dirancang untuk mempercepat produktivitas kerja profesional dan mengotomasi alur kerja harian.",
    "features": [
      "Fungsionalitas mutakhir berbasis teknologi kecerdasan buatan AI Writing & SEO",
      "Antarmuka pengguna responsif dan intuitif siap pakai",
      "Mendukung integrasi alur kerja modern dan ekspor data instan",
      "Pilihan paket fleksibel untuk solo kreator maupun tim bisnis"
    ],
    "affiliateUrl": "https://frase.io/?via=locagocreative",
    "isFeatured": false
  }
];
