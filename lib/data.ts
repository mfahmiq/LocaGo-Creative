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
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&auto=format&fit=crop&q=80',
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
    downloadUrlFast: 'https://saweria.co/dwollopus'
  },
  {
    id: 'sc-2',
    title: 'Sistem Absensi Guru & Siswa QR Code + Notifikasi WhatsApp Ortu',
    slug: 'absensi-qr-code-whatsapp-sekolah',
    category: 'Google Apps Script',
    techStack: ['Google Apps Script', 'Google Sheets', 'HTML5', 'Fonnte API'],
    description: 'Sistem absensi sekolah berbasis Google Sheets dan Google Apps Script tanpa biaya server bulanan! Siswa atau guru cukup scan kartu QR Code di depan webcam/kamera tablet, data otomatis tersimpan di Google Sheets dan sistem langsung mengirimkan notifikasi WA ke orang tua: "Anak Anda telah hadir di sekolah pukul 07.15 WIB".',
    shortDesc: 'Sistem absensi sekolah 0 biaya server pakai Google Sheets + scan QR Code + auto WhatsApp ke ortu.',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
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
    downloadUrlFast: 'https://saweria.co/dwollopus'
  },
  {
    id: 'sc-3',
    title: 'Landing Page Katalog Produk UMKM + Direct Checkout WhatsApp',
    slug: 'landing-page-katalog-umkm-nextjs',
    category: 'Next.js & React',
    techStack: ['Next.js 14', 'Tailwind CSS', 'TypeScript', 'Lucide Icons'],
    description: 'Template website katalog premium siap deploy ke Vercel atau Cloudflare Pages gratis. Tampilan elegan, ultra-cepat (skor Google Lighthouse 99), dilengkapi keranjang belanja multi-item yang otomatis merangkum pesanan menjadi format pesan WhatsApp rapi siap kirim.',
    shortDesc: 'Template landing page katalog modern Next.js + Tailwind. Order langsung kirim pesan rapi ke WhatsApp.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
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
    downloadUrlFast: 'https://saweria.co/dwollopus'
  },
  {
    id: 'sc-4',
    title: 'Bot WhatsApp AI Asisten CS Penjawab Otomatis Berbasis Python',
    slug: 'bot-wa-ai-customer-service-python',
    category: 'Python & AI',
    techStack: ['Python 3.11', 'FastAPI', 'Groq / OpenAI API', 'SQLite'],
    description: 'Source code bot WhatsApp pintar yang bisa dilatih menggunakan dokumen PDF bisnis Anda (RAG lokal). Bot otomatis menjawab pertanyaan pelanggan 24/7 dengan bahasa sopan dan ramah, mengecek harga produk, jam buka, hingga menyimpan kontak prospek masuk ke database SQLite.',
    shortDesc: 'Bot WhatsApp pintar CS otomatis pakai AI LLM lokal/Groq. Jawab chat pelanggan 24 jam nonstop.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
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
    downloadUrlFast: 'https://saweria.co/dwollopus'
  },
  {
    id: 'sc-5',
    title: 'Aplikasi Billing Rental PS & Cafe PC Game (Desktop Python Tkinter)',
    slug: 'billing-rental-ps-cafe-game-desktop',
    category: 'Mobile & Desktop',
    techStack: ['Python', 'CustomTkinter', 'SQLite', 'ReportLab PDF'],
    description: 'Aplikasi desktop offline untuk pemilik rental PlayStation (PS3, PS4, PS5) dan Cafe Gaming. Dilengkapi timer countdown per televisi/unit, alarm suara ketika waktu sewa habis, sistem tarif fleksibel (per jam / paket malam / open play), dan rekap pendapatan harian.',
    shortDesc: 'Software kasir billing rental PS dengan timer otomatis, alarm habis waktu, dan cetak laporan.',
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80',
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
    downloadUrlFast: 'https://saweria.co/dwollopus'
  },
  {
    id: 'sc-6',
    title: 'Website Portal Donasi Transparan Online + Verifikasi Mutasi Bank',
    slug: 'portal-donasi-transparan-mutasi-bank',
    category: 'PHP & Laravel',
    techStack: ['Laravel 11', 'Tailwind CSS', 'MySQL', 'Midtrans / QRIS'],
    description: 'Platform crowdfunding dan galang dana sosial mandiri tanpa potongan komisi pihak ketiga. Dilengkapi penghitung donasi real-time progress bar, kode unik transfer otomatis, daftar doa dari para donatur, dan laporan penyaluran dana transparan.',
    shortDesc: 'Source code platform donasi online lengkap dengan progress bar target dana & verifikasi otomatis.',
    thumbnail: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=800&auto=format&fit=crop&q=80',
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
    thumbnail: '/screenshots/siakad_dashboard.png',
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
    thumbnail: '/screenshots/siperpus_dashboard.png',
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
    thumbnail: '/screenshots/ams_surat_dashboard.png',
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
    thumbnail: '/screenshots/pos_modern_dashboard.png',
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
    affiliateUrl: 'https://systeme.io/?sa=locagocreative',
    isFeatured: true
  },
  {
    id: 'ai-2',
    name: 'ElevenLabs',
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
  }
];
