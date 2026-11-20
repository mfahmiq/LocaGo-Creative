// components/GratisPage.tsx — halaman /gratis: semua yang gratis di LocaGo.
// Landing "hadiah" untuk CTA Threads universal (Fahmi 2026-11-20):
//   "👉 locagocreative.my.id/gratis — 600+ AI tools gratis, source code
//   website premium, trending GitHub harian"
// Semua angka di halaman ini dihitung LANGSUNG dari Supabase saat halaman
// dimuat (bukan hardcode): jumlah tools mentah + jumlah yang tampil di hub,
// jumlah source code, repo trending harian + tanggal pembaruan terakhir.
// Bila Supabase gagal, angka tampil "…" — tidak pernah angka karangan.
import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Download, Flame, ArrowUpRight, CheckCircle2, ListVideo, Newspaper } from 'lucide-react';
import { fetchCatalog, fetchCatalogCount, fetchToolsDisplayCount } from '../lib/catalogData';

type TrendingRow = {
  timeframe?: 'daily' | 'weekly' | 'monthly';
  updatedAt?: string;
};

function formatUpdatedAt(rows: TrendingRow[]): string {
  const stamps = rows
    .map((r) => r.updatedAt)
    .filter((s): s is string => Boolean(s))
    .map((s) => new Date(s).getTime())
    .filter((t) => !Number.isNaN(t));
  if (stamps.length === 0) return '';
  return new Date(Math.max(...stamps)).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const GratisPage: React.FC = () => {
  const [toolsRaw, setToolsRaw] = useState<number | null>(null);
  const [toolsDisplay, setToolsDisplay] = useState<number | null>(null);
  const [sourceCount, setSourceCount] = useState<number | null>(null);
  const [linklistCount, setLinklistCount] = useState<number | null>(null);
  const [articleCount, setArticleCount] = useState<number | null>(null);
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    fetchCatalogCount('ai_tools').then((n) => { if (!cancelled && n !== null) setToolsRaw(n); });
    fetchToolsDisplayCount().then((n) => { if (!cancelled && n !== null) setToolsDisplay(n); });
    fetchCatalogCount('source_codes').then((n) => { if (!cancelled && n !== null) setSourceCount(n); });
    fetchCatalogCount('linklists').then((n) => { if (!cancelled && n !== null) setLinklistCount(n); });
    fetchCatalogCount('articles').then((n) => { if (!cancelled && n !== null) setArticleCount(n); });
    fetchCatalog<TrendingRow>('github_trending').then((rows) => {
      if (cancelled || !rows) return;
      setDailyCount(rows.filter((r) => r.timeframe === 'daily').length);
      setLastUpdated(formatUpdatedAt(rows));
    });
    return () => { cancelled = true; };
  }, []);

  const num = (n: number | null) => (n === null ? '…' : n.toLocaleString('id-ID'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Gift className="w-3.5 h-3.5" />
          100% Gratis · Tanpa Login
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          Semua yang Gratis di LocaGo Creative
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          AI tools, source code website premium, dan radar GitHub Trending — gratis,
          tanpa login, tanpa kartu kredit. Ini halaman hadiahnya: semua yang kami
          janjikan di Threads ada di sini.
        </p>
      </div>

      {/* Tiga kartu utama */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Tools */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all duration-200 hover:shadow-xl flex flex-col">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
            AI Tools Gratis
          </h2>
          <p className="mt-2 text-3xl font-mono font-extrabold text-neutral-900 dark:text-white">
            {num(toolsRaw)}
            <span className="ml-2 text-sm font-mono font-bold text-neutral-500">AI tools di katalog</span>
          </p>
          <p className="mt-1 text-xs font-mono text-neutral-500">
            {toolsDisplay === null ? '…' : `${toolsDisplay.toLocaleString('id-ID')} di antaranya tampil terkurasi di hub`}
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Direktori AI tools terkurasi buat coding, nulis, SEO, voice, video, dan
            otomasi bisnis. Bandingkan harga dan fiturnya sebelum dipakai — gratis.
          </p>
          <a
            href="/ai-tools"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Jelajahi AI Tools <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Source Code */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-xl flex flex-col">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Source Code Website Premium
          </h2>
          <p className="mt-2 text-3xl font-mono font-extrabold text-neutral-900 dark:text-white">
            {num(sourceCount)}
            <span className="ml-2 text-sm font-mono font-bold text-neutral-500">project siap pakai</span>
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Project website premium siap pakai — POS kasir, absensi QR, katalog UMKM,
            SIAKAD, dan lainnya, lengkap dengan database dan panduan instalasi.
          </p>
          <div className="mt-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <p className="flex gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span><strong className="text-neutral-800 dark:text-neutral-200">Download Gratis (lewat iklan):</strong> gratis — lewat halaman sponsor + hitung mundur sebelum link unduhan muncul.</span>
            </p>
            <p className="flex gap-1.5 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span><strong className="text-neutral-800 dark:text-neutral-200">Download Tanpa Iklan · Donasi QRIS:</strong> buat yang mau langsung tanpa iklan dan tanpa hitung mundur.</span>
            </p>
          </div>
          <a
            href="/source-code"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Lihat Source Code <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* GitHub Trending */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/40 transition-all duration-200 hover:shadow-xl flex flex-col">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Trending GitHub Harian
          </h2>
          <p className="mt-2 text-3xl font-mono font-extrabold text-neutral-900 dark:text-white">
            {num(dailyCount)}
            <span className="ml-2 text-sm font-mono font-bold text-neutral-500">repo trending hari ini</span>
          </p>
          <p className="mt-1 text-xs font-mono text-neutral-500">
            {lastUpdated ? `Terakhir diperbarui ${lastUpdated}` : 'Memuat tanggal pembaruan…'}
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Radar harian repositori AI &amp; open-source yang lagi naik daun di GitHub —
            lengkap dengan jumlah bintang dan kenaikan hari ini. Data diperbarui harian.
          </p>
          <a
            href="/github-trending"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Lihat Trending Hari Ini <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Juga gratis */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a
          href="/linklists"
          className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <ListVideo className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold tracking-tight text-neutral-900 dark:text-white text-sm">
              LinkList Publik {linklistCount !== null && <span className="font-mono text-purple-600 dark:text-purple-400">({linklistCount})</span>}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-0.5">
              Kumpulan AI tools pilihan komunitas berdasarkan kebutuhan — tinggal klik dan pakai.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 text-neutral-400" />
        </a>
        <a
          href="/artikel"
          className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Newspaper className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold tracking-tight text-neutral-900 dark:text-white text-sm">
              Artikel &amp; Panduan AI {articleCount !== null && <span className="font-mono text-blue-600 dark:text-blue-400">({articleCount})</span>}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-0.5">
              Tutorial, komparasi software AI, dan strategi digital — dibaca gratis.
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 text-neutral-400" />
        </a>
      </div>

      {/* LeadMasters — satu baris kecil, halaman ini tetap halaman hadiah */}
      <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-center">
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Butuh klien, bukan cuma tools?{' '}
          <a href="https://leadmasters.my.id" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-900 dark:text-white hover:underline">
            LeadMasters
          </a>{' '}
          cari prospek dari Google Maps, broadcast WA &amp; email, dan follow-up otomatis 24/7 — cuma Rp149.000 aja, sekali bayar, lifetime.
        </p>
      </div>

      <p className="mt-6 text-center text-[11px] font-mono text-neutral-400 dark:text-neutral-600">
        Angka di halaman ini dihitung langsung dari database LocaGo saat halaman dimuat.
      </p>
    </div>
  );
};
