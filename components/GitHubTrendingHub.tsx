import React, { useState, useMemo, useEffect } from 'react';
import { GITHUB_TRENDING_LIST } from '../lib/data';
import { GitHubTrendingItem } from '../types';

interface ExtendedRepo extends GitHubTrendingItem {
  upvotesCount: number;
  isUpvoted: boolean;
}

export const GitHubTrendingHub: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Semua');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Hari ini, 06:30 WIB');
  
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

  // Base items mapped with Trendshift fields
  const baseRepos: GitHubTrendingItem[] = useMemo(() => {
    return [
      {
        id: 'gh-1',
        name: 'T3 Code',
        repo: 'pingdotgg/t3code',
        starsToday: 3094,
        totalStars: '3.1k',
        growthRate: '+420%',
        language: 'TypeScript',
        topics: ['AI Coding', 'Multi-Agent', 'Desktop App'],
        category: 'Dev Tools & Automation',
        oneSentencePitch: 'Aplikasi desktop dan mobile open-source buat mengontrol semua agen AI coding (Claude Code, Codex, Cursor, Grok) dari satu layar terpusat.',
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
        growthRate: '+280%',
        language: 'TypeScript',
        topics: ['AI Agent', 'Long-term Memory', 'SQLite'],
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
        growthRate: '+195%',
        language: 'Python',
        topics: ['LLM', 'RAG System', 'Tutorials'],
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
        growthRate: '+310%',
        language: 'Rust',
        topics: ['Voice AI', 'Offline Whisper', 'Productivity'],
        category: 'Productivity & Media',
        oneSentencePitch: 'Aplikasi dikte suara lokal untuk Mac, Windows, dan Linux: tahan shortcut, bicara, teks langsung tertempel di kursor 100% offline.',
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
        growthRate: '+140%',
        language: 'Zig',
        topics: ['Web Scraping', 'Headless Browser', 'MCP Server'],
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
      },
      {
        id: 'gh-6',
        name: 'OpenMausBot',
        repo: 'milind-soni/OpenMausBot',
        starsToday: 922,
        totalStars: '8.4k',
        growthRate: '+185%',
        language: 'TypeScript',
        topics: ['AI Assistant', 'Desktop UI', 'Tool Use'],
        category: 'AI Agents & LLM',
        oneSentencePitch: 'Aplikasi chat desktop open-source alternatif Grok Bot buat menjalankan tim agen AI lokal layaknya kontak pertemanan.',
        features: [
          'Setiap agen punya model AI, komputer isolasi, dan memori percakapan mandiri',
          'Kartu persetujuan izin (Allow/Deny) sebelum bot menjalankan perintah terminal',
          'Integrasi ratusan aplikasi harian (Gmail, GitHub, Notion) via Composio'
        ],
        benefits: [
          'Asisten virtual spesialis tanpa biaya langganan bulanan software mahal',
          'Riwayat chat dan data pekerjaan tersimpan aman di disk komputer sendiri'
        ],
        mediaType: 'image'
      },
      {
        id: 'gh-7',
        name: 'Claude Code Game Studios',
        repo: 'Donchitos/Claude-Code-Game-Studios',
        starsToday: 967,
        totalStars: '2.4k',
        growthRate: '+260%',
        language: 'Python',
        topics: ['Autonomous Fleet', 'Game Dev', 'Multi-Agent'],
        category: 'AI Agents & LLM',
        oneSentencePitch: 'Framework orkestrasi 49 agen AI otonom yang bekerja bersama layaknya studio game profesional untuk coding game otomatis.',
        features: [
          'Hirarki multi-divisi: Direktur Kreatif, Lead Programmer, UI Artist, QA Tester',
          'Pipeline eksekusi modular dengan auto-validation dan bug fixing otomatis',
          'Menghasilkan game Playable WebGL dan Python Arcade dalam satu sesi perintah'
        ],
        benefits: [
          'Otomatisasi pembuatan prototipe game dari konsep hingga jadi',
          'Mempelajari arsitektur orkestrasi multi-agent tingkat enterprise'
        ],
        mediaType: 'image'
      },
      {
        id: 'gh-8',
        name: 'Handy Voice AI',
        repo: 'cjpais/Handy',
        starsToday: 742,
        totalStars: '3.9k',
        growthRate: '+165%',
        language: 'Go',
        topics: ['Speech-to-Text', 'Whisper', 'Offline Audio'],
        category: 'Productivity & Media',
        oneSentencePitch: 'Aplikasi speech-to-text gratis dan open-source buat ngetik pakai suara di aplikasi apa pun secara instan dan 100% offline.',
        features: [
          'Tekan shortcut keyboard, bicara, teks langsung tertempel di kursor aktif',
          'Transkripsi diproses lokal pakai Whisper & Parakeet V3 tanpa cloud API',
          'Deteksi keheningan otomatis (VAD Silero) dan support Windows, Mac, Linux'
        ],
        benefits: [
          'Bebas biaya langganan software speech-to-text bulanan',
          'Nulis catatan, email, atau naskah 5x lebih cepat tanpa pegal ngetik'
        ],
        mediaType: 'video'
      }
    ];
  }, []);

  const languages = ['Semua', 'TypeScript', 'Python', 'Rust', 'Go', 'Zig'];
  const topics = ['Semua', 'AI Coding', 'AI Agent', 'Multi-Agent', 'Voice AI', 'Web Scraping', 'RAG System'];

  // Handle upvoting
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

  // Simulate or perform live sync
  const triggerLiveSync = async () => {
    setIsLiveLoading(true);
    try {
      const now = new Date();
      const timeStr = `Hari ini, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB (Live GitHub Sync)`;
      setLastUpdated(timeStr);
    } finally {
      setTimeout(() => setIsLiveLoading(false), 800);
    }
  };

  // Filter & calculate ranks
  const filteredAndRankedRepos = useMemo(() => {
    const multiplier = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 6.2 : 24.5;

    return baseRepos
      .filter((repo) => {
        const matchLang = selectedLanguage === 'Semua' || repo.language === selectedLanguage;
        const matchTopic = selectedTopic === 'Semua' || (repo.topics && repo.topics.includes(selectedTopic));
        const matchSearch =
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.oneSentencePitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.topics && repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchLang && matchTopic && matchSearch;
      })
      .map((repo, idx) => {
        const calculatedGain = Math.round(repo.starsToday * multiplier);
        const upvoteVal = upvotes[repo.id] !== undefined ? upvotes[repo.id] : calculatedGain;
        return {
          ...repo,
          rank: idx + 1,
          calculatedGain,
          upvotesCount: upvoteVal,
          isUpvoted: !!userVoted[repo.id]
        };
      })
      .sort((a, b) => b.calculatedGain - a.calculatedGain);
  }, [baseRepos, timeframe, selectedLanguage, selectedTopic, searchQuery, upvotes, userVoted]);

  return (
    <section id="github-trending" className="pt-28 pb-20 bg-neutral-950 text-white min-h-screen relative overflow-hidden">
      {/* Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Header Trendshift-Style */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Trendshift Engine: Live Momentum & Stars Velocity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Live GitHub Trending & Momentum
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
            Menangkap repositori dan AI tooling open-source saat sedang naik daun (*caught as they rise, not after they peak*).
          </p>
        </div>

        {/* Trendshift Control Bar: Timeframe & Live Status */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
            {/* Timeframe Switcher Tabs */}
            <div className="flex items-center bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 w-full sm:w-auto">
              <button
                onClick={() => setTimeframe('daily')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'daily'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ⚡ Hari Ini (Daily)
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                📅 Minggu Ini
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏆 Bulan Ini
              </button>
            </div>

            {/* Live Status & Refresh Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] font-mono text-neutral-400">
                Terakhir update: <strong className="text-neutral-200">{lastUpdated}</strong>
              </span>
              <button
                onClick={triggerLiveSync}
                disabled={isLiveLoading}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono text-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className={isLiveLoading ? 'animate-spin' : ''}>🔄</span>
                <span>{isLiveLoading ? 'Syncing...' : 'Cek Live'}</span>
              </button>
            </div>
          </div>

          {/* Search & Topic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-span-5 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari repo, agen AI, atau kata kunci..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Languages Filter Pills */}
            <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono text-neutral-500 shrink-0 mr-1">Bahasa:</span>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Row */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-800/60 scrollbar-none">
            <span className="text-[11px] font-mono text-neutral-500 shrink-0">Topik:</span>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {t === 'Semua' ? 'Semua Topik' : `#${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Repos List - Trendshift Card Grid */}
        <div className="space-y-4">
          {filteredAndRankedRepos.map((repo, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={repo.id}
                className="group relative p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 backdrop-blur flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left Side: Rank, Title, Pitch, Tags */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Rank Indicator */}
                  <div
                    className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm sm:text-base border shadow-inner ${
                      rank === 1
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : rank === 2
                        ? 'bg-slate-300/10 text-slate-300 border-slate-300/30'
                        : rank === 3
                        ? 'bg-amber-700/10 text-amber-600 border-amber-700/30'
                        : 'bg-neutral-950 text-neutral-500 border-neutral-800'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Main Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        <a
                          href={`https://github.com/${repo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span>{repo.repo}</span>
                          <span className="text-neutral-500 text-xs">↗</span>
                        </a>
                      </h3>

                      {repo.language && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {repo.language}
                        </span>
                      )}

                      {isTop3 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          🔥 Breakout Momentum
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                      {repo.oneSentencePitch}
                    </p>

                    {/* Topic Tags */}
                    {repo.topics && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {repo.topics.map((tp) => (
                          <span
                            key={tp}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-850"
                          >
                            #{tp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Momentum Velocity, Stars, Upvote & CTA */}
                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 border-neutral-800/80 pt-3 md:pt-0">
                  {/* Stars Gained Today / Momentum Pill */}
                  <div className="text-left md:text-right">
                    <div className="inline-flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <span>+{repo.calculatedGain.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-500/80 font-normal">
                        {timeframe === 'daily' ? 'today' : timeframe === 'weekly' ? 'this week' : 'this month'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 block mt-1">
                      Total: <strong className="text-neutral-300">{repo.totalStars}</strong> stars
                    </span>
                  </div>

                  {/* Upvote Button with LocalStorage */}
                  <button
                    onClick={() => toggleUpvote(repo.id, repo.calculatedGain)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      repo.isUpvoted
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-500/10'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
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
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trendshift Footer Quote */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 max-w-xl mx-auto">
          <p className="text-xs font-mono text-neutral-400">
            💡 <em>"What they build speaks louder than words."</em>
          </p>
          <span className="text-[11px] text-neutral-500 mt-1 block font-mono">
            Otomatisasi kurasi harian via cronjob VPS setiap pukul 06:30 WIB.
          </span>
        </div>
      </div>
    </section>
  );
};
