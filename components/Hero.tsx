
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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-0 transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-20 user-select-none pointer-events-none"></div>

      {/* Animated Blobs - Clean Corporate Blue & Cyan */}
      <div className="hidden md:block absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="hidden md:block absolute top-0 -right-4 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animate-delay-200"></div>
      <div className="hidden md:block absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animate-delay-500"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 backdrop-blur-sm text-sm font-medium text-blue-700 dark:text-blue-300 shadow-sm">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{t.hero.badge.replace(/^🚀\s*/, '')}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900 dark:text-white tracking-tight transition-colors">
              {t.hero.titleStart} <br />
              <span className="text-gradient">{t.hero.titleGradient}</span> <br />
              <span className="text-slate-900 dark:text-white inline-block">
                {language === 'en' ? 'for ' : 'untuk '}
                <span className="text-blue-600 dark:text-blue-400 font-extrabold underline decoration-blue-500/40 decoration-wavy decoration-2">
                  {currentText}
                </span>
                <span
                  className={`inline-block w-[3px] sm:w-[4px] h-[0.85em] ml-1.5 align-middle bg-blue-600 dark:bg-blue-400 transition-opacity duration-100 ${
                    cursorVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors">
              {t.hero.description}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              {badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 text-center group flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                {t.hero.ctaStart}
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('ai-consultation')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 glass text-slate-700 dark:text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 text-center border border-slate-200 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-400 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {t.hero.ctaPortfolio}
              </button>
            </div>
          </div>

          {/* Visual/Image Container with safe top margin to prevent overlapping */}
          <div className="flex-1 relative animate-fade-in-up animate-delay-200 w-full max-w-lg lg:max-w-xl mt-14 lg:mt-0 pt-4 lg:pt-0">
            <div className="relative z-10 animate-float">
              <div className="glass-card rounded-2xl p-6 border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl relative">
                {/* Abstract UI representation */}
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg mx-auto">
                    <img src="/logo.png" alt="LocaGo" className="w-4 h-4 object-contain rounded" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">locagocreative.my.id</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/5 animate-pulse"></div>
                    <div className="w-2/3 space-y-3">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600/50 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-300 dark:bg-slate-600/50 rounded w-1/2"></div>
                      <div className="h-24 bg-slate-200 dark:bg-slate-700/30 rounded w-full mt-2"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="h-20 rounded-lg bg-slate-200 dark:bg-slate-700/30 border border-white/5"></div>
                    <div className="h-20 rounded-lg bg-slate-200 dark:bg-slate-700/30 border border-white/5"></div>
                    <div className="h-20 rounded-lg bg-slate-200 dark:bg-slate-700/30 border border-white/5"></div>
                  </div>
                </div>

                {/* Floating Badge 1 - Top Right (Handcrafted Code) - Shifted right to clear address bar */}
                <div className="absolute -top-6 sm:-top-7 -right-3 sm:-right-8 lg:-right-10 p-3 sm:p-4 glass bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-2xl animate-float animate-delay-500 shadow-xl border border-white/40 dark:border-slate-700/60 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Zero Template' : 'Arsitektur Kustom'}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">100% Handcrafted Code</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Left (WhatsApp AI) - Shifted higher and more left to clear bottom blocks */}
                <div className="absolute bottom-8 sm:bottom-12 -left-3 sm:-left-8 lg:-left-10 p-3 sm:p-4 glass bg-white/85 dark:bg-slate-800/85 backdrop-blur-md rounded-2xl animate-float animate-delay-300 shadow-xl border border-white/40 dark:border-slate-700/60 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Smart Automation' : 'Automasi Cerdas'}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">WhatsApp AI 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-2xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;
