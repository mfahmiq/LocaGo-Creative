
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

const WA_NUMBER = '62895336377648';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo LocaGo Creative! Saya ingin konsultasi dan cek penawaran untuk proyek digital saya. 🚀')}`;

  const badges = language === 'en'
    ? ['99+ Projects', 'WhatsApp AI', 'Premium Website', 'School Systems']
    : ['99+ Proyek', 'WhatsApp AI', 'Website Premium', 'Sistem Sekolah'];

  // Typewriter effect words
  const words = useMemo(() => {
    return language === 'en'
      ? ['Your Business.', 'Your School.', 'Your Projects.', 'Your Workflow.']
      : ['Bisnis Anda.', 'Sekolah Anda.', 'Tugas Anda.', 'UMKM Anda.'];
  }, [language]);

  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor "bip-bip"
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Reset when language changes
  useEffect(() => {
    setCurrentText('');
    setIsDeleting(false);
    setWordIndex(0);
  }, [language]);

  // Typewriter logic: type, hold, backspace, next word
  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && currentText === currentWord) {
      // Completed typing full word: wait 2.2 seconds before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && currentText === '') {
      // Completed deleting: switch to next word and pause briefly
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 350);
    } else {
      // Typing or deleting characters
      const speed = isDeleting ? 45 : 95;
      timeout = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? currentWord.substring(0, currentText.length - 1)
            : currentWord.substring(0, currentText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, wordIndex, words]);

  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Monospace Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="tracking-wide">{t.hero.badge.replace(/^🚀\s*/, '')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15] mb-6">
              {t.hero.titleStart} <br />
              <span className="text-neutral-900 dark:text-white">
                {t.hero.titleGradient}
              </span> <br />
              <span className="text-neutral-500 dark:text-neutral-400 text-3xl sm:text-4xl lg:text-5xl font-medium">
                {language === 'en' ? 'for ' : 'untuk '}
                <span className="text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-neutral-300 dark:decoration-neutral-700">
                  {currentText}
                </span>
                <span
                  className={`inline-block w-1.5 h-7 sm:h-9 ml-1.5 bg-neutral-900 dark:bg-white align-middle transition-opacity duration-100 ${
                    cursorVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* Lead Description */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.description}
            </p>

            {/* Trust Pill Tags */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-300 shadow-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                  {badge}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-sm transition-all duration-150 active:scale-[0.98] shadow-sm"
              >
                <span>{t.hero.ctaStart}</span>
                <span>→</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('ai-consultation')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 font-medium text-sm transition-all duration-150 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>{t.hero.ctaPortfolio}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Bento Studio Preview */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  locago.architecture.ts
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Ready
                </div>
              </div>

              {/* Bento Card Content */}
              <div className="p-5 space-y-4">
                {/* Code Spec Block */}
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200/70 dark:border-neutral-800/80 font-mono text-xs space-y-1.5">
                  <div className="text-neutral-400 dark:text-neutral-500">// Handcrafted Core Config</div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">stack:</span>
                    <span className="text-neutral-900 dark:text-neutral-200 font-semibold">React 19 + Vite + GAS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">server_cost:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Rp 0 / bln (GAS Sheets)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">template_lock:</span>
                    <span className="text-neutral-900 dark:text-neutral-200">Zero (100% Handcrafted)</span>
                  </div>
                </div>

                {/* Simulated Live Consultation Flow */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1">
                    Live Workflow Stream
                  </div>

                  {/* Client message */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-mono text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                      U
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 text-xs text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-800">
                      {language === 'en'
                        ? 'Hi LocaGo! Need an online store + WhatsApp order system with a 300k budget, possible?'
                        : 'Halo LocaGo! Mau bikin katalog UMKM + order WA budget 300rb bisa?'}
                    </div>
                  </div>

                  {/* Agent Response */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">
                      LC
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-neutral-800 dark:text-neutral-200 border border-emerald-200/50 dark:border-emerald-900/40">
                      {language === 'en'
                        ? '100% possible! We build with Google Apps Script + Sheets. Zero recurring server fees forever.'
                        : 'Tentu bisa! Solusi Google Apps Script + Sheets: 100% bebas biaya server selamanya.'}
                    </div>
                  </div>
                </div>

                {/* Bottom Minimalist Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                  <div className="p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">&lt; 1.2s</div>
                    <div className="text-[10px] text-neutral-500">Load Time</div>
                  </div>
                  <div className="p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">100%</div>
                    <div className="text-[10px] text-neutral-500">Source Code</div>
                  </div>
                  <div className="p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Rp 0</div>
                    <div className="text-[10px] text-neutral-500">Server Fee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
