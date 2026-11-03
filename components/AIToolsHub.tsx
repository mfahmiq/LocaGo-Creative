import React, { useState, useMemo } from 'react';
import { AI_TOOLS_LIST } from '../lib/data';

export const AIToolsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Automation & No-Code', 'Voice & Audio AI', 'AI Writing & SEO', 'Video & Graphics', 'AI Coding'];

  const filteredTools = useMemo(() => {
    return AI_TOOLS_LIST.filter((tool) => {
      const matchCat = selectedCategory === 'Semua' || tool.category === selectedCategory;
      const matchSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="ai-tools" className="pt-28 pb-20 bg-neutral-50/60 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 text-xs font-mono font-medium mb-4 border border-purple-200 dark:border-purple-800">
            <span>🚀 Direktori Alat AI Terbaik & Rekomendasi Praktisi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Katalog AI Tools & Software Otomasi
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Daftar software kecerdasan buatan terverifikasi untuk meningkatkan produktivitas, pembuatan konten otomatis, dan scale-up bisnis Anda.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari AI tools (Voice, SEO, Funnel, Video)..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            <svg
              className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                      {tool.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-white leading-tight">
                        {tool.name}
                      </h3>
                      <span className="text-[11px] font-mono text-neutral-500">{tool.category}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {tool.pricingType}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    💰 Afiliasi: {tool.commissionRate}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug mb-2">
                  {tool.tagline}
                </h4>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5">
                  {tool.features.map((feat, idx) => (
                    <div key={idx} className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                      <span className="text-purple-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Coba {tool.name} Sekarang</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
