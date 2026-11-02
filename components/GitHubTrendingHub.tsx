import React, { useState, useMemo } from 'react';
import { GITHUB_TRENDING_LIST } from '../lib/data';

export const GitHubTrendingHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'AI Agents & LLM', 'Dev Tools & Automation', 'Web & Scrapers', 'Productivity & Media'];

  const filteredRepos = useMemo(() => {
    return GITHUB_TRENDING_LIST.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oneSentencePitch.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="github-trending" className="pt-28 pb-20 bg-neutral-50/60 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 text-xs font-mono font-medium mb-4 border border-blue-200 dark:border-blue-800">
            <span>🔥 Live Daily Curator & Stars Spike</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Direktori GitHub Trending Harian
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Kurasi harian alat-alat open-source, AI agent, dan software developer terbaik yang mengalami lonjakan bintang terbanyak hari ini di GitHub.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari repositori, topik AI, atau tools..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Repo */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {repo.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        ⭐ +{repo.starsToday.toLocaleString()} today
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>{repo.name}</span>
                    </h3>
                    <a
                      href={`https://github.com/${repo.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 mt-0.5 inline-block"
                    >
                      github.com/{repo.repo} ↗
                    </a>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-neutral-500 block">Total Stars</span>
                    <span className="font-mono font-bold text-base text-neutral-800 dark:text-neutral-200">
                      {repo.totalStars}
                    </span>
                  </div>
                </div>

                {/* Pitch */}
                <p className="mt-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                  {repo.oneSentencePitch}
                </p>

                {/* Features List */}
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                    Fitur Kunci:
                  </span>
                  <ul className="space-y-1.5">
                    {repo.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                {repo.officialSite ? (
                  <a
                    href={repo.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 underline"
                  >
                    Kunjungi Website Resmi ↗
                  </a>
                ) : (
                  <span className="text-xs font-mono text-neutral-400">Open-Source Repo</span>
                )}

                <a
                  href={`https://github.com/${repo.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span>Buka di GitHub</span>
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
