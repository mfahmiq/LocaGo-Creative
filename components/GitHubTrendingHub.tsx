import React, { useState, useMemo, useEffect } from 'react';
import { GITHUB_TRENDING_LIST } from '../lib/data';
import { GitHubTrendingItem } from '../types';

interface TrendingLivePayload {
  updatedAt?: string;
  timeframe?: 'daily' | 'weekly' | 'monthly';
  total?: number;
  items?: GitHubTrendingItem[];
  daily?: GitHubTrendingItem[];
  weekly?: GitHubTrendingItem[];
  monthly?: GitHubTrendingItem[];
}

export const GitHubTrendingHub: React.FC = () => {
  const [repos, setRepos] = useState<GitHubTrendingItem[]>(GITHUB_TRENDING_LIST);
  const [trendingPayload, setTrendingPayload] = useState<TrendingLivePayload | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Semua');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Hari ini, Real-Time');

  const applyTrendingPayload = (data: TrendingLivePayload, tf: 'daily' | 'weekly' | 'monthly') => {
    setTrendingPayload(data);
    const activeItems =
      (tf === 'weekly' && data.weekly && data.weekly.length > 0 ? data.weekly : null) ||
      (tf === 'monthly' && data.monthly && data.monthly.length > 0 ? data.monthly : null) ||
      (tf === 'daily' && data.daily && data.daily.length > 0 ? data.daily : null) ||
      (data.items && data.items.length > 0 ? data.items : null);
    if (activeItems) {
      setRepos(activeItems);
    }
    if (data.updatedAt) {
      setLastUpdated(data.updatedAt);
    }
  };

  const fetchTrendingPayload = async (tf: 'daily' | 'weekly' | 'monthly', bustCache = false): Promise<TrendingLivePayload | null> => {
    const cacheParam = bustCache ? `&t=${Date.now()}` : '';
    try {
      const apiRes = await fetch(`/api/github-trending?since=${tf}${cacheParam}`);
      if (apiRes.ok) {
        const data: TrendingLivePayload = await apiRes.json();
        if (data && ((data.items && data.items.length > 0) || (data[tf] && data[tf]!.length > 0))) {
          return data;
        }
      }
    } catch {
      // Fallback to static live shard
    }

    try {
      const fallbackRes = await fetch(`/github_trending_live.json?t=${Date.now()}`);
      if (fallbackRes.ok) {
        const data: TrendingLivePayload = await fallbackRes.json();
        if (data && ((data.items && data.items.length > 0) || (data[tf] && data[tf]!.length > 0))) {
          return data;
        }
      }
    } catch {
      // Fallback to static GITHUB_TRENDING_LIST
    }
    return null;
  };

  // Fetch live data on mount and whenever timeframe changes
  useEffect(() => {
    let cancelled = false;
    fetchTrendingPayload(timeframe).then((data) => {
      if (!cancelled && data) {
        applyTrendingPayload(data, timeframe);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  // Upvotes state stored in localStorage
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('locago_gh_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userVoted, setUserVoted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('locago_gh_uservoted');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const topics = ['Semua', 'AI Agents & LLM', 'Dev Tools & Automation', 'Web & Scrapers', 'Productivity & Media'];

  const toggleUpvote = (id: string, defaultStars: number) => {
    const isVoted = userVoted[id];
    const current = upvotes[id] !== undefined ? upvotes[id] : defaultStars;
    const nextCount = isVoted ? current - 1 : current + 1;

    const nextUpvotes = { ...upvotes, [id]: nextCount };
    const nextUserVoted = { ...userVoted, [id]: !isVoted };

    setUpvotes(nextUpvotes);
    setUserVoted(nextUserVoted);

    try {
      localStorage.setItem('locago_gh_upvotes', JSON.stringify(nextUpvotes));
      localStorage.setItem('locago_gh_uservoted', JSON.stringify(nextUserVoted));
    } catch {
      // fallback
    }
  };

  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const triggerLiveSync = async () => {
    setIsLiveLoading(true);
    try {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} WIB`;

      const data = await fetchTrendingPayload(timeframe, true);
      if (data) {
        applyTrendingPayload(data, timeframe);
        setLastUpdated(data.updatedAt || `Hari ini, ${timeStr} (Sinkron Live)`);
        setSyncNotice(`✓ Data live GitHub Trending (${timeframe}) diperbarui pada ${timeStr} — urutan #1..N tersinkron resmi!`);
        setTimeout(() => setSyncNotice(null), 3500);
      } else {
        setSyncNotice('⚠ Gagal mengambil data live terbaru. Menampilkan data tersimpan.');
        setTimeout(() => setSyncNotice(null), 3500);
      }
    } catch {
      const now = new Date();
      setLastUpdated(`Hari ini, ${now.toLocaleTimeString('id-ID')} WIB`);
    } finally {
      setIsLiveLoading(false);
    }
  };

  const currentActiveList = useMemo(() => {
    if (trendingPayload) {
      if (timeframe === 'weekly' && trendingPayload.weekly && trendingPayload.weekly.length > 0) {
        return trendingPayload.weekly;
      }
      if (timeframe === 'monthly' && trendingPayload.monthly && trendingPayload.monthly.length > 0) {
        return trendingPayload.monthly;
      }
      if (timeframe === 'daily' && trendingPayload.daily && trendingPayload.daily.length > 0) {
        return trendingPayload.daily;
      }
      if (trendingPayload.items && trendingPayload.items.length > 0) {
        return trendingPayload.items;
      }
    }
    return repos;
  }, [trendingPayload, timeframe, repos]);

  const languages = useMemo(() => {
    const uniqueLangs = Array.from(
      new Set(currentActiveList.map((r) => r.language).filter((l): l is string => Boolean(l)))
    );
    return ['Semua', ...uniqueLangs];
  }, [currentActiveList]);

  useEffect(() => {
    if (selectedLanguage !== 'Semua' && !languages.includes(selectedLanguage)) {
      setSelectedLanguage('Semua');
    }
  }, [languages, selectedLanguage]);

  const filteredAndRankedRepos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return currentActiveList
      .filter((repo) => {
        const matchLang = selectedLanguage === 'Semua' || repo.language === selectedLanguage;
        const matchTopic = selectedTopic === 'Semua' || repo.category === selectedTopic;
        const matchSearch =
          !query ||
          repo.name.toLowerCase().includes(query) ||
          repo.repo.toLowerCase().includes(query) ||
          (repo.oneSentencePitch && repo.oneSentencePitch.toLowerCase().includes(query));
        return matchLang && matchTopic && matchSearch;
      })
      .map((repo, idx) => {
        const upvoteVal = upvotes[repo.id] !== undefined ? upvotes[repo.id] : repo.starsToday;
        return {
          ...repo,
          rank: repo.rank ?? idx + 1,
          calculatedGain: repo.starsToday,
          upvotesCount: upvoteVal,
          isUpvoted: !!userVoted[repo.id]
        };
      });
  }, [currentActiveList, selectedLanguage, selectedTopic, searchQuery, upvotes, userVoted]);

  return (
    <section id="github-trending" className="pt-28 pb-20 bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Trendshift-Style */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Trendshift Engine: Live Real-Time GitHub Momentum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            Live GitHub Trending & Momentum
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Menangkap repositori open-source dan AI tooling saat sedang viral hari ini (*caught as they rise, not after they peak*).
          </p>
        </div>

        {/* Control Box */}
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm dark:shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
            {/* Timeframe Switcher Tabs */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto">
              <button
                onClick={() => setTimeframe('daily')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'daily'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                ⚡ Hari Ini (Daily)
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                📅 Minggu Ini
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                🏆 Bulan Ini
              </button>
            </div>

            {/* Live Status & Refresh Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] font-mono text-neutral-500">
                Update: <strong className="text-neutral-700 dark:text-neutral-200">{lastUpdated}</strong>
              </span>
              <button
                onClick={triggerLiveSync}
                disabled={isLiveLoading}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <span className={isLiveLoading ? 'animate-spin' : ''}>🔄</span>
                <span>{isLiveLoading ? 'Sinkronisasi...' : 'Cek Live'}</span>
              </button>
            </div>
          </div>

          {syncNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <span>⚡</span>
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Search & Language Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-span-5 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari repo, nama pemilik, atau fungsi..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Languages Filter Pills */}
            <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono text-neutral-400 shrink-0 mr-1">Bahasa:</span>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Row */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100 dark:border-neutral-800/60 scrollbar-none">
            <span className="text-[11px] font-mono text-neutral-400 shrink-0">Kategori:</span>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}

            <div className="ml-auto text-[11px] font-mono text-neutral-500 shrink-0">
              Total: <strong className="text-blue-600 dark:text-blue-400">{filteredAndRankedRepos.length}</strong> repos
            </div>
          </div>
        </div>

        {/* Repos Card Grid */}
        <div className="space-y-4">
          {filteredAndRankedRepos.map((repo, index) => {
            const rank = repo.rank || index + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={repo.id || repo.repo}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-blue-500/40 transition-all duration-200 hover:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left Side: Rank, Title, Pitch, Tags */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Rank Indicator */}
                  <div
                    className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm sm:text-base border shadow-sm ${
                      rank === 1
                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30'
                        : rank === 2
                        ? 'bg-slate-100 dark:bg-slate-300/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-300/30'
                        : rank === 3
                        ? 'bg-amber-50 dark:bg-amber-700/10 text-amber-800 dark:text-amber-600 border-amber-200 dark:border-amber-700/30'
                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-500 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Main Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <a
                          href={`https://github.com/${repo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span>{repo.repo}</span>
                          <span className="text-neutral-400 text-xs">↗</span>
                        </a>
                      </h3>

                      {repo.language && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                          {repo.language}
                        </span>
                      )}

                      {isTop3 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                          🔥 Breakout
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                      {repo.oneSentencePitch}
                    </p>

                    {/* Category & Topic Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {repo.category}
                      </span>
                      {repo.topics && repo.topics.map((tp) => (
                        <span
                          key={tp}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
                        >
                          #{tp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Momentum Velocity, Stars, Upvote & CTA */}
                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800/80 pt-3 md:pt-0">
                  {/* Stars Gained Today */}
                  <div className="text-left md:text-right">
                    <div className="inline-flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                      <span>+{repo.calculatedGain.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-500/80 font-normal">
                        {timeframe === 'daily' ? 'today' : timeframe === 'weekly' ? 'this week' : 'this month'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 block mt-1">
                      Total: <strong className="text-neutral-700 dark:text-neutral-300">{repo.totalStars}</strong> stars
                    </span>
                  </div>

                  {/* Upvote Button with LocalStorage */}
                  <button
                    onClick={() => toggleUpvote(repo.id, repo.calculatedGain)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      repo.isUpvoted
                        ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/40 shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                    title="Dukung / Upvote repo ini"
                  >
                    <span>{repo.isUpvoted ? '❤️' : '🤍'}</span>
                    <span>{repo.upvotesCount}</span>
                  </button>

                  {/* GitHub Action */}
                  <a
                    href={`https://github.com/${repo.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
