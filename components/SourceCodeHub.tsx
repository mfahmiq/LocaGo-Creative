import React, { useState, useMemo } from 'react';
import { SOURCE_CODE_LIST } from '../lib/data';
import { SourceCodeItem } from '../types';
import { DualDownloadModal } from './DualDownloadModal';

export const SourceCodeHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<SourceCodeItem | null>(null);

  const categories = ['Semua', 'PHP & Laravel', 'Google Apps Script', 'Next.js & React', 'Python & AI', 'Mobile & Desktop'];

  const filteredItems = useMemo(() => {
    return SOURCE_CODE_LIST.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="source-code" className="pt-28 pb-20 bg-neutral-50/60 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Hero ala Papicode */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-medium mb-4 border border-emerald-200 dark:border-emerald-800">
            <span>✨ Source Code Siap Pakai & Database Lengkap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Source code siap pakai untuk tugas, skripsi, dan usahamu.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Aplikasi lengkap dengan database SQL, data contoh, dan tutorial langkah demi langkah. Download, jalankan, lalu kembangkan sesuai kebutuhan bisnismu.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">62+</span>
              <span className="text-[11px] font-mono text-neutral-500">Source code</span>
            </div>
            <div className="text-center border-x border-neutral-100 dark:border-neutral-800">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">58</span>
              <span className="text-[11px] font-mono text-neutral-500">Gratis</span>
            </div>
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">18 rb+</span>
              <span className="text-[11px] font-mono text-neutral-500">Total download</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari source code, teknologi (Laravel, Python, GAS, POS)..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-mono"
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
                className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-neutral-900/80 backdrop-blur-sm text-white">
                      {item.category}
                    </span>
                    {item.isPopular && (
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-white uppercase tracking-wider">
                        Populer 🔥
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-600 text-white shadow-sm">
                      GRATIS
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

                  {/* Card Meta & Download CTA */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                      <span>⬇️ {item.downloadsCount}x</span>
                      <span>⭐ {item.rating}</span>
                      <span>📦 {item.fileSize}</span>
                    </div>
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>Download</span>
                      <span>→</span>
                    </button>
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
              className="mt-3 text-xs font-mono text-emerald-600 hover:underline"
            >
              Reset filter pencarian
            </button>
          </div>
        )}

        {/* Feature Value Banner */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Siap Dijalankan</h4>
              <p className="text-xs text-neutral-500 mt-1">Lengkap dengan database SQL dan data contoh. Cukup XAMPP atau Laragon.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Ada Tutorialnya</h4>
              <p className="text-xs text-neutral-500 mt-1">Disertai artikel panduan langkah demi langkah memahami logika kodenya.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Kode yang Aman</h4>
              <p className="text-xs text-neutral-500 mt-1">Memakai prepared statement, password hash, dan proteksi CSRF.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Donasi Sukarela</h4>
              <p className="text-xs text-neutral-500 mt-1">Dukung kopi developer Rp 2.000 untuk download cepat instan tanpa iklan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal Integration */}
      <DualDownloadModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
    </section>
  );
};
