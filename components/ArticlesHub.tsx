import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES_LIST, ArticleItem } from '../lib/articlesData';

export const ArticlesHub: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>(ARTICLES_LIST);
  const [selectedLang, setSelectedLang] = useState<'all' | 'id' | 'en'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    fetch('/articles_live.json')
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data.items) setArticles(data.items);
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category));
    return ['Semua', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchLang = selectedLang === 'all' || a.language === selectedLang;
      const matchCat = selectedCategory === 'Semua' || a.category === selectedCategory;
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLang && matchCat && matchSearch;
    });
  }, [articles, selectedLang, selectedCategory, searchQuery]);

  return (
    <section id="articles" className="pt-28 pb-24 bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Wawasan AI, Tutorial & Review Software Terkini</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            Artikel & Panduan AI Terlengkap
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Kumpulan artikel edukasi mendalam, komparasi software kecerdasan buatan, dan strategi monetisasi digital dalam Bahasa Indonesia dan English.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm dark:shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
            {/* Language Switcher Tabs */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto">
              <button
                onClick={() => setSelectedLang('all')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                🌐 Semua Bahasa
              </button>
              <button
                onClick={() => setSelectedLang('id')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === 'id'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                onClick={() => setSelectedLang('en')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            <span className="text-[11px] font-mono text-neutral-500">
              Total: <strong className="text-emerald-600 dark:text-emerald-400">{filteredArticles.length}</strong> artikel terindeks
            </span>
          </div>

          {/* Search Bar & Category Pills */}
          <div className="space-y-3">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul artikel, topik, atau kata kunci..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono text-neutral-400 shrink-0 mr-1">Topik:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid or Elegant Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 px-6 max-w-lg mx-auto bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl mx-auto mb-4 border border-emerald-500/20">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Artikel Mendalam Sedang Disusun
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Tim editorial LocaGo Creative sedang meriset dan menyusun panduan lengkap AI Tools 2026 dengan standar komparasi mendalam, screenshot UI asli, dan tutorial video resmi.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-mono text-[11px] font-bold">
              🚀 Segera Rilis Batch Perdana
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-900">
                    <img
                      src={art.cover}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/banners/articles/article_ai_coding_tools.webp';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900/80 backdrop-blur-sm text-white">
                        {art.language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-600 text-white shadow-sm">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                    <span>📅 {art.date}</span>
                    <span>•</span>
                    <span>⏱️ {art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                    {art.excerpt}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => setReadingArticle(art)}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Baca Artikel Lengkap</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Article Reader Modal */}
        {readingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-neutral-900 dark:text-white">
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {readingArticle.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {readingArticle.date} • {readingArticle.readTime}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {readingArticle.title}
                </h2>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-neutral-900">
                <img
                  src={readingArticle.cover}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* YouTube Video Embed */}
              {readingArticle.youtubeId && (
                <div className="mb-6">
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                    📺 Video Pembahasan & Demo:
                  </span>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${readingArticle.youtubeId}?autoplay=0&rel=0`}
                      title={readingArticle.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none text-sm text-neutral-700 dark:text-neutral-300 space-y-4 whitespace-pre-line leading-relaxed">
                {readingArticle.content}
              </div>

              {readingArticle.affiliateTools && readingArticle.affiliateTools.length > 0 && (
                <div className="mt-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <h4 className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 mb-3 uppercase tracking-wider">
                    🛠️ Coba Langsung Tool AI yang Diulas (Tautan Resmi):
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {readingArticle.affiliateTools.map((tool) => (
                      <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>Kunjungi {tool.name}</span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
