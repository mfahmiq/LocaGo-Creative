import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.process, href: '#process' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-neutral-900 dark:text-white tracking-tight group"
          >
            <img
              src="/logo.png"
              alt="LocaGo Creative"
              className="w-8 h-8 object-contain rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">LocaGo Creative</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 pl-6 border-l border-neutral-200 dark:border-neutral-800">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors duration-150 cursor-pointer shadow-sm"
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
                className="h-8 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors duration-150 cursor-pointer shadow-sm"
                aria-label="Toggle Language"
              >
                {language === 'en' ? 'ID' : 'EN'}
              </button>

              {/* Consultation Quick CTA */}
              <a
                href="#ai-consultation"
                className="ml-2 px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-mono font-medium transition-all active:scale-[0.98] shadow-sm"
              >
                {language === 'en' ? 'Estimate →' : 'Kalkulator →'}
              </a>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-sm"
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

            {/* Language Toggle Mobile */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="h-8 px-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              {language === 'en' ? 'ID' : 'EN'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-sm transition-colors"
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

      {/* Mobile Drawer Navigation (Editorial Bento Style) */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 pt-24 pb-8 px-6 transition-transform duration-200 ease-out shadow-lg ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Info inside mobile drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800/80 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">locagocreative.my.id/nav</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">2026</span>
          </div>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <span className="text-base font-semibold text-neutral-900 dark:text-white">
                  {link.name}
                </span>
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  0{idx + 1} →
                </span>
              </a>
            ))}
          </div>

          {/* Quick CTA inside Mobile Drawer */}
          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <a
              href="#ai-consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-mono font-medium shadow-sm transition-all"
            >
              <span>{language === 'en' ? 'Launch AI Estimator' : 'Buka Kalkulator AI'}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
