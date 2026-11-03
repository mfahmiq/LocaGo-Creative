import React, { useState, useMemo, useEffect } from 'react';
import { AI_TOOLS_LIST } from '../lib/data';
import { AIToolItem } from '../types';

export const AIToolsHub: React.FC = () => {
  const [tools, setTools] = useState<AIToolItem[]>(AI_TOOLS_LIST);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPricing, setSelectedPricing] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/ai_tools_live.json?t=' + Date.now())
      .then((res) => {
        if (!res.ok) throw new Error('Live JSON not found');
        return res.json();
      })
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setTools(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Form submission state
  const [submitForm, setSubmitForm] = useState({
    toolName: '',
    websiteUrl: '',
    category: 'AI Coding',
    pricing: 'Freemium',
    description: '',
    contactWa: '',
    isFeaturedRequest: false
  });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Upvotes state stored in localStorage
  const [upvotes, setUpvotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userVoted, setUserVoted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_uservoted');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [views, setViews] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('locago_ai_views');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const appendUtm = (rawUrl?: string, toolName?: string) => {
    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.startsWith('http')) return '#';
    const slug = (toolName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const u = new URL(rawUrl);
      u.searchParams.set('utm_source', 'locagocreative');
      u.searchParams.set('utm_medium', 'directory');
      u.searchParams.set('utm_campaign', 'ai_tools_hub');
      u.searchParams.set('utm_content', slug);
      return u.toString();
    } catch {
      const sep = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${sep}utm_source=locagocreative&utm_medium=directory&utm_campaign=ai_tools_hub&utm_content=${slug}`;
    }
  };

  const trackClick = (toolId?: string) => {
    if (!toolId) return;
    const current = views[toolId] || 0;
    const nextViews = { ...views, [toolId]: current + 1 };
    setViews(nextViews);
    try {
      localStorage.setItem('locago_ai_views', JSON.stringify(nextViews));
    } catch {}
  };

  const categories = [
    'Semua',
    'Automation & No-Code',
    'Voice & Audio AI',
    'AI Writing & SEO',
    'Video & Graphics',
    'AI Coding'
  ];

  const pricingModels = ['Semua', 'Freemium', 'Free Trial', 'Paid'];

  const toggleUpvote = (id?: string) => {
    if (!id) return;
    const isVoted = userVoted[id];
    const safeStr = String(id);
    const defaultVal = 12 + (safeStr.charCodeAt(safeStr.length - 1) % 40);
    const current = upvotes[id] !== undefined ? upvotes[id] : defaultVal;
    const nextCount = isVoted ? current - 1 : current + 1;

    const nextUpvotes = { ...upvotes, [id]: nextCount };
    const nextUserVoted = { ...userVoted, [id]: !isVoted };

    setUpvotes(nextUpvotes);
    setUserVoted(nextUserVoted);

    try {
      localStorage.setItem('locago_ai_upvotes', JSON.stringify(nextUpvotes));
      localStorage.setItem('locago_ai_uservoted', JSON.stringify(nextUserVoted));
    } catch {
      // fallback
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      const msg = encodeURIComponent(
        `Halo LocaGo Creative! Saya ingin submit tool AI baru ke AI Tool Library:\n\n• Nama Tool: ${submitForm.toolName}\n• Website: ${submitForm.websiteUrl}\n• Kategori: ${submitForm.category}\n• Model Harga: ${submitForm.pricing}\n• Paket: ${submitForm.isFeaturedRequest ? 'VIP Featured Listing' : 'Standard Free Review'}`
      );
      window.open(`https://wa.me/6285189393354?text=${msg}`, '_blank');
    }, 1200);
  };

  const filteredAndSortedTools = useMemo(() => {
    return (tools || []).filter((tool) => {
      if (!tool) return false;
      const matchCat = selectedCategory === 'Semua' || tool.category === selectedCategory;
      const matchPricing = selectedPricing === 'Semua' || tool.pricingType === selectedPricing;
      const searchLower = (searchQuery || '').toLowerCase();
      const matchSearch =
        (tool.name || '').toLowerCase().includes(searchLower) ||
        (tool.tagline || '').toLowerCase().includes(searchLower) ||
        (tool.description || '').toLowerCase().includes(searchLower) ||
        (tool.category || '').toLowerCase().includes(searchLower);
      return matchCat && matchPricing && matchSearch;
    }).sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'popular') {
        const votesA = (a.id && upvotes[a.id] !== undefined) ? upvotes[a.id] : 20;
        const votesB = (b.id && upvotes[b.id] !== undefined) ? upvotes[b.id] : 20;
        return votesB - votesA;
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [tools, selectedCategory, selectedPricing, searchQuery, sortBy, upvotes]);

  return (
    <section id="ai-tools" className="pt-28 pb-24 bg-neutral-50/60 dark:bg-neutral-950 text-neutral-900 dark:text-white min-h-screen relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Library ala Futurepedia */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-400 text-xs font-mono font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>AI Tool Directory & Software Intelligence Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
            AI Tool Library & Direktori Software
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Perpustakaan kurasi kecerdasan buatan, engine otomatisasi no-code, dan model AI paling produktif untuk mempercepat pertumbuhan bisnis dan proyek Anda.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 shadow-sm">
              ⚡ <strong>{tools.length}+</strong> Alat AI Terverifikasi
            </span>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>+ Submit Your AI Tool</span>
            </button>
          </div>
        </div>

        {/* Directory Controls Box */}
        <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm dark:shadow-2xl space-y-4">
          {/* Row 1: Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari AI tools berdasarkan nama, fungsi, atau fitur (cth: Cursor, Voice, RAG, Funnel)..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <span className="text-xs font-mono text-neutral-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                <option value="popular">🔥 Paling Populer</option>
                <option value="name">🔤 Nama (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
            <span className="text-xs font-mono text-neutral-400 shrink-0 mr-1">Kategori:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 3: Pricing Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            <span className="text-xs font-mono text-neutral-400 shrink-0 mr-1">Model Harga:</span>
            {pricingModels.map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPricing(price)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedPricing === price
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                {price === 'Semua' ? 'Semua Harga' : price}
              </button>
            ))}

            <div className="ml-auto text-[11px] font-mono text-neutral-500 shrink-0">
              Menampilkan <strong className="text-purple-600 dark:text-purple-400">{filteredAndSortedTools.length}</strong> alat
            </div>
          </div>
        </div>

        {/* AI Tools Grid ala Futurepedia */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map((tool) => {
            const voteVal = upvotes[tool.id] !== undefined ? upvotes[tool.id] : 18;
            const hasVoted = !!userVoted[tool.id];

            return (
              <div
                key={tool.id}
                className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-purple-500/40 transition-all duration-200 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Real Logo */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {tool.logoUrl ? (
                        <img
                          src={tool.logoUrl}
                          alt={tool.name}
                          className="w-10 h-10 rounded-xl object-contain p-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm shrink-0"
                          onError={(e) => {
                            // Fallback to avatar if logo fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-base font-mono shrink-0">
                          {(tool.name || 'AI').charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <span>{tool.name || 'AI Tool'}</span>
                          {tool.isFeatured && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                              PRO
                            </span>
                          )}
                        </h3>
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">{tool.category || 'Tools'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Pricing Tag */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {tool.pricingType}
                      </span>
                      {/* Upvote Button */}
                      <button
                        onClick={() => toggleUpvote(tool.id)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                          hasVoted
                            ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/40'
                            : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title="Upvote tool ini"
                      >
                        <span>{hasVoted ? '❤️' : '🤍'}</span>
                        <span>{voteVal}</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug mb-2 line-clamp-1">
                    {tool.tagline}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                    {tool.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-1.5 border-t border-neutral-100 dark:border-neutral-800/80 pt-3">
                    {(tool.features || []).map((feat, idx) => (
                      <div key={idx} className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold shrink-0">✓</span>
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 shrink-0">
                    <span>👁️</span>
                    <span>{(((tool.id || 'ai').charCodeAt((tool.id || 'ai').length - 1) * 43) % 950 + 140 + (views[tool.id] || 0)).toLocaleString()} views</span>
                  </div>

                  <a
                    href={appendUtm(tool.affiliateUrl, tool.name)}
                    onClick={() => trackClick(tool.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Kunjungi {tool.name}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Tool Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-neutral-900 dark:text-white">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-lg cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block mb-1">
                  Direktori Kemitraan
                </span>
                <h3 className="text-2xl font-bold">Submit AI Tool Anda</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Daftarkan aplikasi atau produk AI Anda ke direktori LocaGo Creative untuk mendapatkan trafik dan pengguna baru.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold">Pengajuan Diterima!</h4>
                  <p className="text-xs text-neutral-500 mt-1">Membuka WhatsApp kurator untuk verifikasi data...</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block mb-1">Nama Software / Tool AI:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: MySuperAI"
                      value={submitForm.toolName}
                      onChange={(e) => setSubmitForm({ ...submitForm, toolName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block mb-1">Website URL:</label>
                    <input
                      type="url"
                      required
                      placeholder="https://mysuperai.com"
                      value={submitForm.websiteUrl}
                      onChange={(e) => setSubmitForm({ ...submitForm, websiteUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block mb-1">Kategori:</label>
                      <select
                        value={submitForm.category}
                        onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
                      >
                        {categories.filter((c) => c !== 'Semua').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block mb-1">Model Harga:</label>
                      <select
                        value={submitForm.pricing}
                        onChange={(e) => setSubmitForm({ ...submitForm, pricing: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
                      >
                        <option value="Freemium">Freemium</option>
                        <option value="Free Trial">Free Trial</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-700 dark:text-neutral-300 block mb-1">Deskripsi Singkat Fitur:</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Jelaskan dalam 1-2 kalimat fungsi utama tool AI Anda..."
                      value={submitForm.description}
                      onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featCheck"
                      checked={submitForm.isFeaturedRequest}
                      onChange={(e) => setSubmitForm({ ...submitForm, isFeaturedRequest: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="featCheck" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                      <strong>Featured Listing (VIP Placement)</strong> — Tampil di baris teratas dengan lencana PRO & promosi di thread media sosial.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      Kirim Pendaftaran Tool Sekarang →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
