import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  Database, 
  Maximize2, 
  Check, 
  Sparkles, 
  Code2, 
  Package, 
  Tag, 
  MessageSquare, 
  Link as LinkIcon, 
  Zap, 
  X, 
  Flame, 
  Star, 
  BookOpen, 
  ShieldCheck, 
  Coffee 
} from 'lucide-react';
import { SOURCE_CODE_LIST, WA_CONSULT_URL } from '../lib/data';
import { SourceCodeItem } from '../types';
import { DualDownloadModal } from './DualDownloadModal';

export const SourceCodeHub: React.FC = () => {
  const [items, setItems] = useState<SourceCodeItem[]>(SOURCE_CODE_LIST);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<SourceCodeItem | null>(null);
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeModalItem, setActiveModalItem] = useState<SourceCodeItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    fetch('/source_codes_live.json?t=' + Date.now())
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
          // Sync URL query if item slug present
          const hash = window.location.hash;
          if (hash.includes('item=')) {
            const slugParam = decodeURIComponent(hash.split('item=')[1]?.split('&')[0] || '');
            const found = data.items.find((it: SourceCodeItem) => it.slug === slugParam);
            if (found) {
              setSelectedItem(found);
              setActiveScreenshotIdx(0);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const base = ['Semua', 'PHP & Laravel', 'Python & AI', 'Next.js & React', 'Google Apps Script', 'Mobile & Desktop'];
    const dynamic = Array.from(new Set(items.map((i) => i.category)));
    dynamic.forEach((c) => {
      if (!base.includes(c)) base.push(c);
    });
    return base;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.techStack || []).some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const openDetail = (item: SourceCodeItem) => {
    setSelectedItem(item);
    setActiveScreenshotIdx(0);
    window.history.replaceState(null, '', `#source-code?item=${encodeURIComponent(item.slug)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeDetail = () => {
    setSelectedItem(null);
    window.history.replaceState(null, '', '#source-code');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFreeSafelinkDownload = (item: SourceCodeItem) => {
    const safelinkUrl = `https://www.dwollopus.eu.org/2023/05/10-must-have-ai-tools-for-boosting-your.html?safelink=1&item=${encodeURIComponent(
      item.slug
    )}&step=1&max=8&hash=${Math.random().toString(36).substring(7)}`;
    window.open(safelinkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyShareLink = (item: SourceCodeItem) => {
    const url = `${window.location.origin}/#source-code?item=${encodeURIComponent(item.slug)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // ============================================================================
  // DETAIL PAGE VIEW (ALA PAPICODE FULL DETAIL PAGE)
  // ============================================================================
  if (selectedItem) {
    const screenshots =
      selectedItem.screenshots && selectedItem.screenshots.length > 0
        ? selectedItem.screenshots
        : [
            selectedItem.thumbnail,
            '/banners/gemini/banner_pos_ritel.webp',
            '/banners/gemini/banner_katalog_umkm.webp',
            '/banners/gemini/art_cuan_digital_source_code.webp',
          ];

    const currentScreenshot = screenshots[activeScreenshotIdx] || selectedItem.thumbnail;

    const featuresList =
      selectedItem.keyFeatures && selectedItem.keyFeatures.length > 0
        ? selectedItem.keyFeatures
        : [
            'Dashboard utama lengkap dengan ringkasan metrik harian dan grafik tren',
            'Manajemen data master dengan pencarian instan dan filter multi-kriteria',
            'Hak akses multi-peran (Admin, Operator, Gudang/Kasir) terpisah aman',
            'Transaksi database aman menggunakan prepared statement & atomic lock',
            'Ekspor laporan ke CSV & cetak dokumen PDF siap print',
            'Data contoh siap pakai untuk demo tanpa input dari nol',
          ];

    const tutorialList =
      selectedItem.tutorialSteps && selectedItem.tutorialSteps.length > 0
        ? selectedItem.tutorialSteps
        : [
            `Ekstrak ZIP ke C:\\xampp\\htdocs\\${selectedItem.slug} atau folder web server Anda.`,
            'Nyalakan Apache dan MySQL di XAMPP / Laragon Control Panel.',
            'Import file database.sql yang sudah disertakan lengkap dengan data contoh.',
            'Sesuaikan koneksi database pada file .env atau config.php.',
            `Buka http://localhost/${selectedItem.slug} di browser dan login menggunakan akun default.`,
          ];

    const credentials =
      selectedItem.defaultCredentials && selectedItem.defaultCredentials.length > 0
        ? selectedItem.defaultCredentials
        : [
            { role: 'Admin / Pemilik', username: 'admin@aplikasi.test', password: 'password123' },
            { role: 'Operator / Staf', username: 'operator@aplikasi.test', password: 'password123' },
          ];

    const similarItems = items
      .filter((it) => it.id !== selectedItem.id)
      .sort((a, b) => (a.category === selectedItem.category ? -1 : 1))
      .slice(0, 4);

    const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(
      `${selectedItem.title} - Gratis di LocaGo Creative: ${window.location.origin}/#source-code?item=${selectedItem.slug}`
    )}`;

    return (
      <section className="pt-24 pb-20 bg-neutral-50/70 dark:bg-neutral-950 min-h-screen">
        {/* Header Breadcrumb & Title Section */}
        <div className="border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={closeDetail}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Source Code
              </button>
              <span>›</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(selectedItem.category);
                  closeDetail();
                }}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {selectedItem.category}
              </button>
            </nav>

            {/* Category & Free Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Gratis
              </span>
              {selectedItem.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* H1 Title */}
            <h1 className="mt-3 max-w-4xl text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-white">
              {selectedItem.title}
            </h1>

            {/* Meta Download Count & Updated Date */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Download className="w-3.5 h-3.5" />
                <span>{selectedItem.downloadsCount.toLocaleString('id-ID')} download</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Diperbarui {selectedItem.updatedAt || '10 November 2026'}</span>
              </span>
              {selectedItem.hasDatabase && (
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Database className="w-3.5 h-3.5" />
                  <span>Database: {selectedItem.databaseType || 'MySQL (.sql)'}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout ala Papicode: Left Content + Right Sticky Download Aside */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left Column: Screenshot Gallery + Sticky Sub-Nav + 4 Sections */}
          <div className="lg:col-start-1 lg:row-start-1 space-y-8">
            {/* Screenshot Carousel & Thumbnails */}
            <div>
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="block aspect-video w-full cursor-zoom-in"
                  aria-label="Perbesar screenshot"
                >
                  <img
                    src={currentScreenshot}
                    alt={`${selectedItem.title} - screenshot ${activeScreenshotIdx + 1}`}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/banners/gemini/banner_pos_toko.webp';
                    }}
                  />
                </button>
                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-neutral-900/80 px-2.5 py-1.5 text-xs font-semibold text-white opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Perbesar</span>
                </span>

                {/* Prev / Next Arrows */}
                {screenshots.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveScreenshotIdx((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
                      }
                      aria-label="Screenshot sebelumnya"
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white shadow-md hover:bg-white cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveScreenshotIdx((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
                      }
                      aria-label="Screenshot berikutnya"
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white shadow-md hover:bg-white cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip (4 columns) */}
              <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                {screenshots.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveScreenshotIdx(idx)}
                    className={`aspect-video overflow-hidden rounded-xl border-2 bg-neutral-100 dark:bg-neutral-800 transition-all cursor-pointer ${
                      activeScreenshotIdx === idx
                        ? 'border-emerald-600 opacity-100 shadow-sm'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="h-full w-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/banners/gemini/banner_pos_toko.webp';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Anchor Sub-Navigation Bar (Deskripsi | Cara kerja | Fitur | Instalasi) */}
            <nav className="sticky top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
              <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <li>
                  <a
                    href="#deskripsi"
                    className="block whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                  >
                    Deskripsi
                  </a>
                </li>
                <li>
                  <a
                    href="#cara-kerja"
                    className="block whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                  >
                    Cara kerja
                  </a>
                </li>
                <li>
                  <a
                    href="#fitur"
                    className="block whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                  >
                    Fitur ({featuresList.length})
                  </a>
                </li>
                <li>
                  <a
                    href="#instalasi"
                    className="block whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                  >
                    Instalasi
                  </a>
                </li>
              </ul>
            </nav>

            {/* Content Sections */}
            <div className="space-y-10">
              {/* 1. Deskripsi */}
              <section id="deskripsi" className="scroll-mt-32">
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Deskripsi
                </h2>
                <div className="mt-4 whitespace-pre-line text-[15px] leading-[1.8] text-neutral-700 dark:text-neutral-300">
                  {selectedItem.description}
                </div>
              </section>

              {/* 2. Cara Kerja */}
              <section id="cara-kerja" className="scroll-mt-32">
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Cara kerja
                </h2>
                <div className="mt-4 whitespace-pre-line rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 text-[15px] leading-[1.8] text-neutral-700 dark:text-neutral-300 shadow-sm">
                  {selectedItem.howItWorks ||
                    `Data tersimpan secara terstruktur di ${
                      selectedItem.databaseType || 'MySQL'
                    }. Setiap transaksi dan perubahan status melewati validasi berlapis di sisi server, mencegah data ganda, serta otomatis memperbarui laporan rekapitulasi secara real-time.\n\nTerdapat pembagian hak akses sesuai peran pengguna (Admin/Owner dan Operator) sehingga setiap staf hanya bisa mengakses menu yang menjadi tanggung jawabnya.`}
                </div>
              </section>

              {/* 3. Fitur (2-Column Checklist Grid ala Papicode) */}
              <section id="fitur" className="scroll-mt-32">
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Fitur ({featuresList.length})
                </h2>
                <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-sm">
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-3.5 md:grid-cols-2">
                    {featuresList.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-[14px] sm:text-[15px] leading-snug text-neutral-800 dark:text-neutral-200"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 4. Panduan Instalasi & Akun Login Default */}
              <section id="instalasi" className="scroll-mt-32">
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Panduan instalasi
                </h2>
                <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 space-y-5 shadow-sm">
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700 text-sm text-neutral-800 dark:text-neutral-200">
                    <strong>Kebutuhan Sistem:</strong>{' '}
                    {selectedItem.requirements ||
                      'PHP 8.2+ (XAMPP / Laragon), MySQL / MariaDB, Browser Modern.'}
                  </div>

                  <ol className="space-y-3">
                    {tutorialList.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm sm:text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Default Credentials Box */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-3">
                      Akun Login Contoh (Default Credentials)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {credentials.map((cred, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 text-xs font-mono space-y-1"
                        >
                          <span className="block font-bold text-emerald-700 dark:text-emerald-400">
                            {cred.role}
                          </span>
                          <div className="text-neutral-700 dark:text-neutral-300">
                            User: <code className="font-bold">{cred.username}</code>
                          </div>
                          <div className="text-neutral-700 dark:text-neutral-300">
                            Pass: <code className="font-bold">{cred.password}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: Sticky Download Aside Box + Tech Specs + Share */}
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1" aria-label="Download">
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Primary Download Card ala Papicode */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">Gratis</p>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Tanpa login
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Termasuk database, data contoh, dan panduan instalasi.
                </p>

                {/* Primary Button: Download Tanpa Iklan (QRIS Donasi Dinamis) */}
                <button
                  type="button"
                  onClick={() => setActiveModalItem(selectedItem)}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 text-[15px] font-semibold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Download Tanpa Iklan · Donasi QRIS</span>
                </button>

                <p className="mt-2 text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Bayar QRIS (e-wallet / m-banking) · mulai Rp 3.000
                  <br />
                  Langsung unduh file ZIP tanpa iklan & tanpa hitung mundur.
                </p>

                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {selectedItem.recentFastDownloads || 34} orang memilih tanpa iklan dalam 7 hari terakhir
                  </span>
                </p>

                {/* Secondary Button: Download Gratis (Lewat Iklan Safelink) */}
                <button
                  type="button"
                  onClick={() => handleFreeSafelinkDownload(selectedItem)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 h-11 px-5 text-sm mt-3 w-full cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Gratis (lewat iklan)</span>
                </button>

                <p className="mt-2.5 text-center text-[11px] text-neutral-500">
                  Jalur gratis melewati halaman sponsor dan hitung mundur sebelum link unduhan muncul.
                </p>
              </div>

              {/* Metadata Specification Table (<dl>) */}
              <dl className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 text-sm shadow-sm">
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Code2 className="w-4 h-4" />
                    <span>Teknologi</span>
                  </dt>
                  <dd className="font-semibold text-neutral-900 dark:text-white text-right">
                    {selectedItem.techStack.slice(0, 2).join(', ')}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Database className="w-4 h-4" />
                    <span>Database</span>
                  </dt>
                  <dd className="font-semibold text-neutral-900 dark:text-white">
                    {selectedItem.databaseType || 'MySQL (.sql)'}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Package className="w-4 h-4" />
                    <span>Ukuran File</span>
                  </dt>
                  <dd className="font-semibold font-mono text-neutral-900 dark:text-white">
                    {selectedItem.fileSize}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Tag className="w-4 h-4" />
                    <span>Lisensi</span>
                  </dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Gratis & Open Modify
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </dt>
                  <dd className="font-semibold font-mono text-neutral-900 dark:text-white">
                    {selectedItem.downloadsCount.toLocaleString('id-ID')}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <dt className="flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    <span>Rilis</span>
                  </dt>
                  <dd className="font-semibold text-neutral-900 dark:text-white">
                    {selectedItem.releaseDate || '5 November 2026'}
                  </dd>
                </div>
              </dl>

              {/* Share & Copy Link Buttons */}
              <div className="flex gap-2">
                <a
                  href={shareWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Bagikan WA</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(selectedItem)}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors hover:border-emerald-600 hover:text-emerald-600 cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{copiedLink ? 'Tersalin!' : 'Salin link'}</span>
                </button>
              </div>

              {/* Jasa Kustomisasi / Bantuan Instalasi Card */}
              <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Butuh modifikasi fitur, integrasi WhatsApp, atau deploy ke server produksi?
                </p>
                <a
                  href={WA_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Konsultasi Tim Engineer LocaGo Creative</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Source Codes Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Source code serupa
            </h2>
            <button
              type="button"
              onClick={closeDetail}
              className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Lihat semua ({items.length}) →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarItems.map((sim) => (
              <div
                key={sim.id}
                onClick={() => openDetail(sim)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-neutral-100 dark:border-neutral-800 bg-neutral-900">
                  <img
                    src={sim.thumbnail}
                    alt={sim.title}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/banners/gemini/banner_pos_toko.webp';
                    }}
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 dark:bg-neutral-900/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 shadow-sm">
                    Gratis
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {sim.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-3 text-xs text-neutral-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>{sim.downloadsCount}x</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Detail →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fullscreen Screenshot Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-10 right-0 text-white text-sm font-mono bg-neutral-800 px-3 py-1 rounded-lg hover:bg-neutral-700 cursor-pointer inline-flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Tutup Preview</span>
              </button>
              <img
                src={currentScreenshot}
                alt={selectedItem.title}
                className="w-full max-h-[82vh] object-contain rounded-xl border border-neutral-700"
              />
            </div>
          </div>
        )}

        {/* Dynamic QRIS Payment Modal */}
        <DualDownloadModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
      </section>
    );
  }

  // ============================================================================
  // CATALOG GRID VIEW (MAIN SOURCE CODE HUB)
  // ============================================================================
  const superVaultItem = items.find((it) => it.id === 'sc-00') || items[0];

  return (
    <section id="source-code" className="pt-28 pb-20 bg-neutral-50/60 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Hero ala Papicode */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-medium mb-4 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Source Code Siap Pakai & Database Lengkap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Source code siap pakai untuk tugas, skripsi, dan usahamu.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Aplikasi lengkap dengan database SQL, data contoh, penjelasan cara kerja, dan panduan instalasi langkah demi langkah. Klik kartu untuk melihat rincian fitur & demo.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                {items.length}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Source code</span>
            </div>
            <div className="text-center border-x border-neutral-100 dark:border-neutral-800">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                100%
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Full Database</span>
            </div>
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                21 rb+
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Total download</span>
            </div>
          </div>
        </div>

        {/* Featured Super-Vault Banner (100+ Open Source Tools & Claude Prompts Bundle) */}
        {superVaultItem && (
          <div className="mb-10 rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 dark:from-emerald-950/30 dark:via-neutral-900 dark:to-neutral-900 p-6 shadow-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>Bundle Spesial Developer</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{superVaultItem.downloadsCount.toLocaleString('id-ID')}x diunduh</span>
                  </span>
                </div>
                <h2
                  onClick={() => openDetail(superVaultItem)}
                  className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {superVaultItem.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {superVaultItem.shortDesc} Dilengkapi starter script Python penarik database UMKM lokal dan panduan setup VPS Rp 50rb/bulan.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => openDetail(superVaultItem)}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-xs font-bold hover:border-emerald-600 transition-all cursor-pointer"
                >
                  Lihat Detail Isi Bundle
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(superVaultItem)}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Download via QRIS Donasi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari source code, teknologi (Laravel, Python, GAS, POS, SIAKAD)..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Source Code Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openDetail(item)}
                className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/banners/gemini/banner_pos_toko.webp';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-neutral-900/80 backdrop-blur-sm text-white">
                      {item.category}
                    </span>
                    {item.isPopular && (
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-white uppercase tracking-wider inline-flex items-center gap-1">
                        <span>Populer</span>
                        <Flame className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-600 text-white shadow-sm">
                      Gratis
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.shortDesc}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Meta & Action CTA */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{item.downloadsCount}x</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{item.fileSize}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalItem(item);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer inline-flex items-center gap-1"
                        title="Download Tanpa Iklan via QRIS"
                      >
                        <Zap className="w-3 h-3" />
                        <span>QRIS</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                      >
                        <span>Detail</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 text-sm">Tidak ada source code yang cocok dengan pencarian Anda.</p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-mono text-emerald-600 hover:underline cursor-pointer"
            >
              Reset filter pencarian
            </button>
          </div>
        )}

        {/* Feature Value Banner */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Siap Dijalankan</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Lengkap dengan database SQL dan data contoh. Cukup XAMPP atau Laragon.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Cara Kerja & Instalasi</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Setiap aplikasi dilengkapi penjelasan alur sistem, daftar fitur, dan akun login contoh.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Kode yang Aman</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Memakai prepared statement, password bcrypt, dan proteksi CSRF.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Donasi QRIS Otomatis</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Scan QRIS donasi sukarela mulai Rp 3.000 untuk download langsung tanpa iklan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal Integration */}
      <DualDownloadModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
    </section>
  );
};
