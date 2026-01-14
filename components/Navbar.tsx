
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.portfolio, href: '#portfolio' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.pricing, href: '#pricing' },
    { name: t.nav.process, href: '#process' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          LocaGo <span className="text-slate-900 dark:text-white">Creative.</span>
        </a>

        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-8"
            >
              {language === 'en' ? 'ID' : 'EN'}
            </button>
          </div>

          <a
            href="#contact"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all active:scale-95"
          >
            {t.hero.ctaStart}
          </a>
        </div>

        {/* Mobile Toggle & Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 z-50 relative"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 transition-all duration-300 animate-fade-in-up">
            <div className="flex flex-col space-y-6 text-center w-full max-w-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-4"></div>

              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'id' : 'en');
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600"
              >
                {language === 'en' ? 'Switch to Indonesia' : 'Ganti ke English'}
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-xl shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 transition-transform"
              >
                {t.hero.ctaStart}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
