
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-900 pb-20 lg:pb-0 transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-20 user-select-none pointer-events-none"></div>

      {/* Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animate-delay-200"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animate-delay-500"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-sm font-medium text-purple-600 dark:text-purple-300 shadow-sm">
              {t.hero.badge}
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900 dark:text-white tracking-tight transition-colors">
              {t.hero.titleStart} <br />
              <span className="text-gradient">{t.hero.titleGradient}</span> <br />
              {t.hero.titleEnd}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 text-center group"
              >
                {t.hero.ctaStart}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 glass text-slate-700 dark:text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 text-center border border-slate-200 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40"
              >
                {t.hero.ctaPortfolio}
              </a>
            </div>


          </div>

          {/* Visual/Image */}
          <div className="flex-1 relative animate-fade-in-up animate-delay-200 w-full max-w-lg lg:max-w-xl">
            <div className="relative z-10 animate-float">
              <div className="glass-card rounded-2xl p-6 border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                {/* Abstract UI representation */}
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700/50 h-6 rounded-md mx-4"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-32 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 animate-pulse"></div>
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

                {/* Floating Elements on top of card */}
                <div className="absolute -right-8 -top-8 p-4 glass bg-white/60 dark:bg-slate-800/60 rounded-xl animate-float animate-delay-500 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.hero.cardPerf}</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">100%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-10 p-4 glass bg-white/60 dark:bg-slate-800/60 rounded-xl animate-float animate-delay-300 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg">
                      🎨
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.hero.cardDesign}</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{t.hero.cardDesignValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-30 -z-10"></div>
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
