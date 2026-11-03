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
    id: 'ai-1',
    name: 'Systeme.io',
    logoUrl: '/logos/systeme.png',
    category: 'Automation & No-Code',
    pricingType: 'Freemium',
    commissionRate: '60% Lifetime Recurring',
    tagline: 'Platform Funnel, Email Marketing & Kursus All-in-One Gratis',
    description: 'Platform bisnis online terlengkap yang menggantikan ClickFunnels, Mailchimp, dan Teachable dalam satu tempat. Sangat populer bagi pemula karena paket gratisnya bisa menampung 2.000 kontak dan unlimited email tanpa kartu kredit.',
    features: [
      'Pembuat Sales Funnel & Landing Page Drag-and-Drop',
      'Otomasi Email Marketing & Newsletter Terjadwal',
      'Platform Kursus & Keanggotaan Digital (Membership)',
      'Program Afiliasi Bawaan untuk Menjual Produk Sendiri'
    ],
    affiliateUrl: 'https://systeme.io/id?sa=sa0285473359ae5985c82865330cf1a062d892e972',
    isFeatured: true
  },
  {
    id: 'ai-2',
    name: 'ElevenLabs',
    logoUrl: '/logos/elevenlabs.png',
    category: 'Voice & Audio AI',
    pricingType: 'Freemium',
    commissionRate: '22% Recurring (12 Bulan)',
    tagline: 'Voice AI & Text-to-Speech Paling Realistis di Dunia',
    description: 'Engine pengubah teks ke suara (TTS) dengan intonasi manusia asli, emosi dinamis, dan kemampuan kloning suara tingkat studio. Mendukung lebih dari 29 bahasa termasuk Bahasa Indonesia yang sangat natural.',
    features: [
      'Voice Generator kualitas ultra-realistis bebas suara robot',
      'Voice Cloning instan hanya dari sampel rekaman 1 menit',
      'Dubbing Video otomatis menerjemahkan bibir & suara ke bahasa lain',
      'Sound Effects AI generator untuk kebutuhan video editing'
    ],
    affiliateUrl: 'https://elevenlabs.io/?from=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-3',
    name: 'Make.com',
    logoUrl: '/logos/make.png',
    category: 'Automation & No-Code',
    pricingType: 'Freemium',
    commissionRate: '20% Recurring',
    tagline: 'Otomatisasi Alur Kerja Visual Tanpa Batas (Alternatif Zapier)',
    description: 'Platform integrasi no-code visual yang menghubungkan ratusan aplikasi seperti Google Sheets, WhatsApp, Notion, Telegram, dan AI secara otomatis. Jauh lebih hemat biaya dibanding Zapier untuk volume data besar.',
    features: [
      'Visual Canvas editor untuk merancang alur kerja rumit dengan mudah',
      'Integrasi ribuan API aplikasi populer dalam beberapa klik',
      'Dukungan Webhook real-time dan parsing data JSON otomatis',
      'Error handling canggih dengan sistem retry otomatis'
    ],
    affiliateUrl: 'https://www.make.com/en/register?pc=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-4',
    name: 'Koala AI (KoalaWriter)',
    logoUrl: '/logos/koala.png',
    category: 'AI Writing & SEO',
    pricingType: 'Free Trial',
    commissionRate: '30% Lifetime Recurring',
    tagline: 'AI Penulis Artikel SEO Lengkap dengan Data Realtime Google',
    description: 'Tool AI penulisan artikel blog dan ulasan produk Amazon yang terhubung langsung ke hasil pencarian Google secara live. Menghasilkan artikel 2.000+ kata terstruktur rapi, lolos deteksi AI, dan siap masuk peringkat halaman satu Google.',
    features: [
      'Penulisan artikel SEO dengan analisis kata kunci kompetitor live',
      'Koneksi internet langsung untuk data fakta dan berita terkini',
      'Format otomatis tabel perbandingan, pro & cons, dan FAQ schema',
      'Satu klik publikasi langsung ke WordPress / Shopify'
    ],
    affiliateUrl: 'https://koala.sh/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-5',
    name: 'Pictory AI',
    logoUrl: '/logos/pictory.png',
    category: 'Video & Graphics',
    pricingType: 'Free Trial',
    commissionRate: '20% - 50% Tiered Recurring',
    tagline: 'Ubah Naskah Teks Jadi Video Sinematik Siap Upload dalam 3 Menit',
    description: 'Aplikasi video AI yang otomatis mencocokkan naskah teks Anda dengan jutaan stok footage video B-roll berkualitas tinggi, lengkap dengan caption otomatis, voiceover, dan musik latar bebas royalti.',
    features: [
      'Script-to-Video otomatis memilih cuplikan footage yang relevan',
      'Auto-captions teks subtitle dinamis mirip video viral TikTok/Reels',
      'Pangkas video panjang (webinar / podcast) jadi klip pendek otomatis',
      'Akses perpustakaan jutaan video dan audio lisensi komersial'
    ],
    affiliateUrl: 'https://pictory.ai/?ref=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-6',
    name: 'Cursor AI',
    logoUrl: '/logos/cursor.png',
    category: 'AI Coding',
    pricingType: 'Freemium',
    commissionRate: '20% Recurring',
    tagline: 'IDE AI Coding Terpopuler yang Menggantikan VS Code Biasa',
    description: 'Code editor berbasis VS Code dengan integrasi model frontier (Claude 3.7 Sonnet, GPT-4o) untuk autocomplete multi-file cerdas, terminal auto-debug, dan pembuatan fitur dalam hitungan detik.',
    features: [
      'Composer multi-file editing untuk refactor seluruh codebase sekaligus',
      'Prediksi tab baris berikutnya (next-action autocomplete) ultra-cepat',
      'Chat konteks penuh dengan referensi codebase (@codebase, @docs)',
      '100% kompatibel dengan semua ekstensi, keybinding, dan tema VS Code'
    ],
    affiliateUrl: 'https://cursor.com/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-7',
    name: 'HeyGen',
    logoUrl: '/logos/heygen.png',
    category: 'Video & Graphics',
    pricingType: 'Freemium',
    commissionRate: '20% - 30% Lifetime Recurring',
    tagline: 'Avatar AI Sinematik & Video Juru Bicara Tanpa Perlu Masuk Kamera',
    description: 'Platform pembuatan video dengan presenter AI fotorealistik dan kloning suara studio. Cukup ketik naskah, pilih avatar profesional, dan video edukasi atau promosi produk siap tayang dalam hitungan menit.',
    features: [
      '100+ pilihan avatar AI fotorealistik berbagai etnis dan busana kerja',
      'Fitur Instant Avatar untuk membuat kembaran digital dari rekaman HP 2 menit',
      'Voice lip-syncing sempurna dalam 40+ bahasa asing secara instan',
      'Integrasi template video vertikal untuk TikTok, Reels, dan YouTube Shorts'
    ],
    affiliateUrl: 'https://www.heygen.com/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-8',
    name: 'Opus Clip',
    logoUrl: '/logos/opus.png',
    category: 'Video & Graphics',
    pricingType: 'Freemium',
    commissionRate: '25% Recurring',
    tagline: '#1 AI Video Repurposing: Ubah Video Panjang Jadi 10 Klip Viral',
    description: 'Tool kurasi video otomatis bertenaga AI yang membedah rekaman podcast, webinar, atau YouTube panjang menjadi puluhan video pendek berhook tajam dengan auto-captions dinamis dan skor viralitas.',
    features: [
      'AI Curation otomatis mendeteksi momen klimaks dan punchline terkuat',
      'Viral Score kalkulator untuk memprediksi potensi jangkauan algoritma',
      'Dynamic Animated Captions dengan auto-emoji dan highlight kata kunci',
      'Auto-Reframing cerdas menjaga wajah pembicara selalu di tengah frame 9:16'
    ],
    affiliateUrl: 'https://www.opus.pro/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-9',
    name: 'Chatbase',
    logoUrl: '/logos/chatbase.png',
    category: 'Automation & No-Code',
    pricingType: 'Freemium',
    commissionRate: '20% Lifetime Recurring',
    tagline: 'Bikin Chatbot AI Custom dari File PDF & Website Bisnis Sendiri',
    description: 'Bangun agen chatbot GPT kustom yang terlatih khusus berdasarkan data produk, SOP perusahaan, atau tautan website Anda. Bisa disematkan langsung (widget embed) ke website klien hanya dengan satu baris script.',
    features: [
      'Latih bot dengan upload PDF, DOCX, CSV, atau masukkan sitemap URL web',
      'Widget embed responsif yang bisa dikustomisasi warna brand dan avatar',
      'Terhubung dengan WhatsApp, Slack, Zapier, dan Make via Webhook API',
      'Analisis log percakapan pelanggan untuk mendeteksi leads yang belum closing'
    ],
    affiliateUrl: 'https://www.chatbase.co/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-10',
    name: 'Writesonic',
    logoUrl: '/logos/writesonic.png',
    category: 'AI Writing & SEO',
    pricingType: 'Freemium',
    commissionRate: '30% Lifetime Recurring',
    tagline: 'Platform Copywriting & Riset Konten SEO Bertenaga AI Generatif',
    description: 'Suite penulisan konten all-in-one yang dilengkapi Chatsonic (alternatif ChatGPT dengan data Google live), SEO checker, dan generator copywriting iklan media sosial dengan conversion rate tinggi.',
    features: [
      'Article Writer 5.0 yang menghasilkan artikel panjang berbasis data faktual',
      'Generator copywriting iklan Facebook, Google Ads, dan LinkedIn dengan tone persuasif',
      'Brand Voice builder agar gaya bahasa tulisan selalu konsisten dengan identitas brand',
      'Parafrase dan humanizer teks bawaan agar tulisan mengalir natural'
    ],
    affiliateUrl: 'https://writesonic.com/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-11',
    name: 'Descript',
    logoUrl: '/logos/descript.png',
    category: 'Voice & Audio AI',
    pricingType: 'Freemium',
    commissionRate: '15% Recurring',
    tagline: 'Edit Video & Audio Podcast Semudah Mengedit Dokumen Teks',
    description: 'Aplikasi editing audio dan video revolusioner berbasis transkrip teks. Hapus jeda hening atau kata gumam (umm, err) cukup dengan menghapus katanya dari naskah, dan audio video akan otomatis terpotong mulus.',
    features: [
      'Text-based Video Editing: potong transkrip, klip video ikut terpotong otomatis',
      'Studio Sound AI untuk membersihkan suara bising background jadi jernih ala studio',
      'Filler Word Removal satu klik untuk singkirkan kata jeda yang tidak perlu',
      'Overdub AI voice clone untuk menambal kata yang salah ucap tanpa rekam ulang'
    ],
    affiliateUrl: 'https://www.descript.com/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-12',
    name: 'v0 by Vercel',
    logoUrl: '/logos/v0.png',
    category: 'AI Coding',
    pricingType: 'Freemium',
    commissionRate: 'Partner Tiered',
    tagline: 'Generator Komponen UI/UX React, Tailwind & Shadcn Instan dari Prompt',
    description: 'Mesin AI generatif buatan Vercel yang merancang antarmuka aplikasi web modern hanya dari deskripsi teks atau screenshot. Kode JSX dan styling Tailwind yang dihasilkan sangat bersih dan siap salin ke project.',
    features: [
      'Prompt-to-UI instan dengan library standar industri (Tailwind CSS + Shadcn UI)',
      'Preview langsung di browser dengan live interactive preview mode',
      'Satu klik ekspor kode ke Next.js via npx shadcn@latest add command',
      'Kemampuan kloning tata letak antarmuka hanya dari unggahan gambar screenshot'
    ],
    affiliateUrl: 'https://v0.dev/?ref=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-13',
    name: 'Surfer SEO',
    logoUrl: '/logos/surfer.png',
    category: 'AI Writing & SEO',
    pricingType: 'Paid',
    commissionRate: '25% Recurring',
    tagline: 'Tool Riset & Optimasi On-Page SEO #1 untuk Masuk Halaman 1 Google',
    description: 'Software analisis SEO berbasis audit algoritma mesin pencari. Memberikan panduan pasti jumlah kata, struktur heading, dan entitas NLP kata kunci yang wajib dimasukkan agar artikel menang bersaing di Google.',
    features: [
      'Content Editor real-time dengan Content Score indikator interaktif',
      'Analisis audit 500+ faktor ranking dari kompetitor top 10 Google',
      'Integrasi langsung dengan Google Docs, WordPress, Jasper, dan Contentful',
      'Keyword Research tool untuk pemetaan topik (topic clusters) otoritas tinggi'
    ],
    affiliateUrl: 'https://surferseo.com/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-14',
    name: 'Suno AI',
    logoUrl: '/logos/suno.png',
    category: 'Voice & Audio AI',
    pricingType: 'Freemium',
    commissionRate: 'Partner Program',
    tagline: 'Generator Lagu & Musik Lengkap Vokal AI Kualitas Siar Profesional',
    description: 'Platform AI pembuat musik lengkap dengan vokal emosional, instrumen band/orkestra, dan aransemen lirik dalam genre apa pun (Pop, Rock, Jazz, Dangdut, Lo-Fi) hanya dalam 15 detik.',
    features: [
      'Hasilkan lagu lengkap berdurasi hingga 4 menit berkualitas master audio',
      'Mendukung penulisan lirik custom atau auto-generated lyric dari prompt',
      'Pilihan genre tak terbatas: Akustik, Synthwave, Hip Hop, Cinematic, EDM',
      'Hak lisensi komersial untuk kebutuhan background music video YouTube & Ads'
    ],
    affiliateUrl: 'https://suno.com/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-15',
    name: 'Browse AI',
    logoUrl: '/logos/browse.png',
    category: 'Automation & No-Code',
    pricingType: 'Freemium',
    commissionRate: '20% Lifetime Recurring',
    tagline: 'Scraper & Monitor Data Website Tanpa Koding (No-Code Data Extraction)',
    description: 'Ekstrak data tabel produk toko online, lowongan kerja, atau harga kompetitor dari website mana pun hanya dengan mengklik elemen di layar. Dilengkapi fitur monitoring berkala yang memberi alert jika data berubah.',
    features: [
      'Latih robot web scraper hanya dalam 2 menit tanpa perlu baris kode apapun',
      'Kemampuan bypass pagination, scroll tak terbatas, dan login wall',
      'Sinkronisasi otomatis hasil scrape ke Google Sheets, Airtable, atau Webhook',
      'Penjadwalan monitoring berkala (per jam, harian, atau mingguan)'
    ],
    affiliateUrl: 'https://www.browse.ai/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-16',
    name: 'Perplexity AI',
    logoUrl: '/logos/perplexity.png',
    category: 'AI Writing & SEO',
    pricingType: 'Freemium',
    commissionRate: 'Pro Referral Tier',
    tagline: 'Mesin Pencari Berbasis AI dengan Kutipan Sumber Faktual Real-Time',
    description: 'Alternatif Google pencarian masa depan yang memberikan jawaban langsung terangkum rapi lengkap dengan kutipan sitasi ilmiah dan berita terverifikasi.',
    features: [
      'Pencarian real-time dengan rujukan sumber link terpercaya',
      'Mode Pro Search untuk riset akademik dan coding multi-step',
      'Upload dokumen PDF/Word untuk dianalisis dan dirangkum instan',
      'Mendukung pilihan model GPT-4o, Claude 3.5 Sonnet, dan Sonar'
    ],
    affiliateUrl: 'https://perplexity.ai/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-17',
    name: 'Midjourney',
    logoUrl: '/logos/midjourney.png',
    category: 'Video & Graphics',
    pricingType: 'Paid',
    commissionRate: 'Partner Program',
    tagline: 'Generator Gambar AI Paling Sinematik & Estetik untuk Desainer',
    description: 'Mesin pembuat ilustrasi, fotografi studio, konsep produk 3D, dan seni digital berkualitas fotorealistik tertinggi di dunia langsung dari prompt teks.',
    features: [
      'Kualitas pencahayaan dan tekstur studio hiper-realistis',
      'Fitur Inpainting dan Outpainting untuk edit bagian gambar spesifik',
      'Gaya konsistensi karakter untuk komik dan aset branding',
      'Dukungan web UI editor baru tanpa perlu Discord'
    ],
    affiliateUrl: 'https://www.midjourney.com/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-18',
    name: 'Notion AI',
    logoUrl: '/logos/notion.png',
    category: 'Automation & No-Code',
    pricingType: 'Free Trial',
    commissionRate: '20% Recurring Partner',
    tagline: 'Asisten Produktivitas Dokumen, Wiki Tim & Manajemen Tugas Otomatis',
    description: 'Kecerdasan buatan terintegrasi di ruang kerja Notion untuk menulis naskah, merangkum notulen rapat, menerjemahkan dokumen, dan mengotomasi database.',
    features: [
      'Q&A cerdas yang bisa menjawab pertanyaan dari seluruh isi workspace',
      'Penulisan draf artikel, email bisnis, dan PRD produk instan',
      'Autofill properti database Notion secara cerdas',
      'Rangkuman notulen meeting dan rencana aksi (action items) otomatis'
    ],
    affiliateUrl: 'https://www.notion.so/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-19',
    name: 'Runway Gen-3 Alpha',
    logoUrl: '/logos/runway.png',
    category: 'Video & Graphics',
    pricingType: 'Freemium',
    commissionRate: 'Partner Tiered',
    tagline: 'Generator Video Sinematik Teks-ke-Video Tingkat Studio Hollywood',
    description: 'Model video AI generasi baru yang menghasilkan video fotorealistik dengan kontrol pergerakan kamera sinematik, efek fisika akurat, dan transisi mulus.',
    features: [
      'Text-to-Video dan Image-to-Video dengan resolusi tinggi 4K',
      'Camera Motion Control: Pan, Zoom, Orbit, dan FPV Drone',
      'Motion Brush untuk menggerakkan objek spesifik dalam gambar diam',
      'Generasi ekspresi wajah dan lip-sync manusia yang meyakinkan'
    ],
    affiliateUrl: 'https://runwayml.com/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-20',
    name: 'Bolt.new by StackBlitz',
    logoUrl: '/logos/bolt.png',
    category: 'AI Coding',
    pricingType: 'Freemium',
    commissionRate: 'Partner Program',
    tagline: 'Bangun, Jalankan & Deploy Full-Stack Web App Langsung di Browser',
    description: 'Lingkungan pengembangan bertenaga AI di browser yang bisa menginstal paket npm, menjalankan Node.js runtime lokal, dan men-deploy aplikasi secara instan.',
    features: [
      'Full-stack in-browser runtime tanpa perlu install Node/Git di laptop',
      'Perbaiki error coding terminal secara otomatis via agen AI',
      'Satu klik deploy langsung ke Netlify atau Cloudflare Pages',
      'Mendukung Next.js, Vite, React, Vue, Supabase, dan Tailwind'
    ],
    affiliateUrl: 'https://bolt.new/?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-21',
    name: 'Voiceflow',
    logoUrl: '/logos/voiceflow.png',
    category: 'Automation & No-Code',
    pricingType: 'Freemium',
    commissionRate: '20% Recurring',
    tagline: 'Platform Perancangan & Deployment Agen Chatbot AI Enterprise',
    description: 'Visual builder untuk merancang, menguji, dan meluncurkan agen AI percakapan berbasis LLM untuk customer support di web, WhatsApp, dan aplikasi seluler.',
    features: [
      'Visual flow canvas drag-and-drop untuk logika percakapan kompleks',
      'Integrasi knowledge base dokumen perusahaan dengan RAG bawaan',
      'API & Webhook action step untuk eksekusi transaksi database',
      'Analisis intent pengguna dan deteksi kebocoran konteks bot'
    ],
    affiliateUrl: 'https://www.voiceflow.com/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-22',
    name: 'Luma Dream Machine',
    logoUrl: '/logos/luma.png',
    category: 'Video & Graphics',
    pricingType: 'Freemium',
    commissionRate: 'Partner Tiered',
    tagline: 'Generator Video AI Sinematik 5 Detik Berkecepatan Tinggi',
    description: 'Mesin kreasi video AI yang mampu menghasilkan klip 5 detik dengan konsistensi objek tinggi, gerakan dinamis realistis, dan pencahayaan alami.',
    features: [
      'Rendering video ultra-cepat hanya dalam hitungan detik',
      'Simulasi fisika cairan, asap, dan pergerakan kain yang nyata',
      'Fitur keyframe looping dan penyambungan adegan (extend video)',
      'Akses gratis beberapa generasi video setiap hari'
    ],
    affiliateUrl: 'https://lumalabs.ai/dream-machine?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-23',
    name: 'Copy.ai',
    logoUrl: '/logos/copyai.png',
    category: 'AI Writing & SEO',
    pricingType: 'Freemium',
    commissionRate: '45% First Year Recurring',
    tagline: 'Otomasi Alur Kerja GTM (Go-to-Market) & Copywriting Tim Penjualan',
    description: 'Platform AI operasional untuk tim marketing dan sales B2B. Mengotomasi penulisan email cold outreach, ringkasan prospek LinkedIn, dan naskah iklan.',
    features: [
      'Workflows automation untuk riset prospek dan auto-draft email B2B',
      'Brand Voice kustom dan template copywriting formula AIDA/PAS',
      'Integrasi CRM HubSpot, Salesforce, dan Google Sheets',
      'Paket gratis selamanya untuk pengguna solo'
    ],
    affiliateUrl: 'https://www.copy.ai/?via=locagocreative',
    isFeatured: false
  },
  {
    id: 'ai-24',
    name: 'GitHub Copilot',
    logoUrl: '/logos/copilot.png',
    category: 'AI Coding',
    pricingType: 'Free Trial',
    commissionRate: 'Microsoft Partner',
    tagline: 'AI Pair Programmer Standar Industri Dunia yang Terintegrasi di IDE',
    description: 'Asisten AI coding paling matang di dunia buatan GitHub dan OpenAI. Mengubah komentar teks menjadi fungsi kode siap pakai di puluhan bahasa pemrograman.',
    features: [
      'Autocomplete kode baris demi baris dan fungsi penuh secara real-time',
      'Copilot Chat di editor untuk refactor, unit test, dan fix bug',
      'Kompatibel dengan VS Code, Visual Studio, JetBrains, dan Neovim',
      'Dukungan model OpenAI o1, GPT-4o, dan Claude 3.5 Sonnet'
    ],
    affiliateUrl: 'https://github.com/features/copilot?via=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-25',
    name: 'Replit Agent',
    logoUrl: '/logos/replit.png',
    category: 'AI Coding',
    pricingType: 'Freemium',
    commissionRate: '20% Recurring',
    tagline: 'Agen AI yang Mengembangkan & Men-Deploy Aplikasi Web Lengkap',
    description: 'Agen coding otonom yang bisa merancang arsitektur database, menulis frontend dan backend, menginstal library, lalu mempublikasikannya langsung ke internet.',
    features: [
      'Autonomous software development dari instruksi bahasa manusia biasa',
      'Otomatis setup database PostgreSQL, API backend, dan UI frontend',
      'Hosting cloud bawaan dengan domain kustom dan sertifikat SSL gratis',
      'Dapat diakses dari browser laptop, tablet, maupun smartphone'
    ],
    affiliateUrl: 'https://replit.com/?via=locagocreative',
    isFeatured: true
  }
];
