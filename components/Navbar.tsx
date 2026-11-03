import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { NavigationTab } from '../types';
import { SOURCE_CODE_LIST, AI_TOOLS_LIST } from '../lib/data';
import { ARTICLES_LIST } from '../lib/articlesData';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [scCount, setScCount] = useState<number>(SOURCE_CODE_LIST.length);
  const [toolsCount, setToolsCount] = useState<number>(AI_TOOLS_LIST.length);
  const [articlesCount, setArticlesCount] = useState<number>(ARTICLES_LIST.length);

  useEffect(() => {
    fetch('/source_codes_live.json')
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.items.length > 0) setScCount(d.items.length);
      })
      .catch(() => {});

    fetch('/ai_tools_live.json')
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.items.length > 0) setToolsCount(d.items.length);
      })
      .catch(() => {});

    fetch('/articles_live.json')
      .then((r) => r.json())
      .then((d) => {
        if (d.items && d.items.length > 0) setArticlesCount(d.items.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.location.hash = tab === 'agency' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Brand Logo & Name */}
          <div
            onClick={() => handleTabClick('agency')}
            className="flex items-center gap-2.5 text-neutral-900 dark:text-white tracking-tight group cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="LocaGo Creative"
              className="w-8 h-8 object-contain rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white leading-tight">
                LocaGo Creative
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                Web & AI Ecosystem
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1 p-1 bg-neutral-100/80 dark:bg-neutral-900/80 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
            {/* Tab 1: Agency */}
            <button
              onClick={() => handleTabClick('agency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'agency'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Layanan Website
            </button>

            {/* Tab 2: Source Code Gratis */}
            <button
              onClick={() => handleTabClick('source-code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'source-code'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <span>Source Code Gratis</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTab === 'source-code'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {scCount} SC
              </span>
            </button>

            {/* Tab 3: GitHub Trending */}
            <button
              onClick={() => handleTabClick('github-trending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'github-trending'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <span>GitHub Trending</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeTab === 'github-trending' ? 'bg-white' : 'bg-blue-500 animate-pulse'
                }`}
              />
            </button>

            {/* Tab 4: AI Tools Directory */}
            <button
              onClick={() => handleTabClick('ai-tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai-tools'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <span>AI Tools</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTab === 'ai-tools'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                }`}
              >
                {toolsCount}+
              </span>
            </button>

            {/* Tab 5: Artikel AI */}
            <button
              onClick={() => handleTabClick('articles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              <span>Artikel AI</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTab === 'articles'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {articlesCount} Baru
              </span>
            </button>
          </div>

          {/* Desktop Controls (Theme, Language, Fast Donate CTA) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="h-8 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer shadow-sm"
              aria-label="Toggle Language"
            >
              {language === 'en' ? 'ID' : 'EN'}
            </button>

            {/* Donasi Lynk.id 2rb Quick Button */}
            <a
              href="https://lynk.id/dwollopus"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>☕ Donasi 2rb</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-sm transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 pt-20 pb-6 px-6 transition-transform duration-200 ease-out shadow-xl ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-2.5">
            <button
              onClick={() => handleTabClick('agency')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                activeTab === 'agency'
                  ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 font-bold'
                  : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40'
              }`}
            >
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                🏢 Layanan Pembuatan Website
              </span>
              <span className="font-mono text-xs text-neutral-400">01 →</span>
            </button>

            <button
              onClick={() => handleTabClick('source-code')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                activeTab === 'source-code'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                  : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  📦 Source Code Gratis
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-mono">
                  {scCount} SC
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">02 →</span>
            </button>

            <button
              onClick={() => handleTabClick('github-trending')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                activeTab === 'github-trending'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-bold'
                  : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  🔥 GitHub Trending Harian
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white font-mono">
                  Live
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">03 →</span>
            </button>

            <button
              onClick={() => handleTabClick('ai-tools')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                activeTab === 'ai-tools'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 font-bold'
                  : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  🤖 Katalog AI Tools & Otomasi
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white font-mono">
                  {toolsCount}+
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">04 →</span>
            </button>

            <button
              onClick={() => handleTabClick('articles')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer ${
                activeTab === 'articles'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                  : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  📰 Artikel & Panduan AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-mono">
                  {articlesCount} Baru
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">05 →</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
            <a
              href="https://lynk.id/dwollopus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-mono font-bold text-center"
            >
              ☕ Donasi 2rb & Download Cepat (Lynk.id)
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
