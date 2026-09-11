import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t, language } = useLanguage();

  const corePrinciples = language === 'en'
    ? [
        {
          title: 'Zero-Template Craft',
          desc: '100% handcrafted custom code. No bloated WordPress themes or slow generic builders.',
        },
        {
          title: 'Zero-Rejection Mission',
          desc: 'Smart Google Apps Script automations starting from Rp 300k. High impact for any budget.',
        },
        {
          title: 'Direct Founder SLA',
          desc: 'Direct consultation and accountability with Mas Fahmi (Lead Developer & Founder).',
        },
      ]
    : [
        {
          title: 'Arsitektur Kustom 100%',
          desc: 'Murni koding dari nol. Tanpa plugin WordPress berat atau template instan pasaran.',
        },
        {
          title: 'Prinsip Solusi untuk Semua',
          desc: 'Otomasi Google Apps Script mulai Rp 300rb agar UMKM & individu bisa langsung go digital.',
        },
        {
          title: 'Pendampingan Founder Langsung',
          desc: 'Konsultasi teknis dan pengerjaan dikawal langsung oleh Founder & Lead Developer.',
        },
      ];

  return (
    <section id="about" className="py-24 bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Studio Dossier Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
              {/* Card Chrome Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80">
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  locagocreative.my.id/manifesto
                </div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Verified
                </div>
              </div>

              {/* Dossier Body */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <img
                    src="/logo.png"
                    alt="LocaGo Creative"
                    className="w-14 h-14 object-contain rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white p-2 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">LocaGo Creative</h3>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {language === 'en' ? 'Digital Solutions Studio' : 'Studio Solusi Digital & Otomasi'}
                    </p>
                  </div>
                </div>

                {/* Core Principles List */}
                <div className="space-y-4">
                  {corePrinciples.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 flex items-center justify-center text-[10px] font-mono text-neutral-600 dark:text-neutral-400 flex-shrink-0 mt-0.5">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integrated Verified Stats */}
                <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-center">
                    <div className="font-mono text-2xl font-bold text-neutral-900 dark:text-white">5+</div>
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-0.5">
                      {t.about.stats.exp}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 text-center">
                    <div className="font-mono text-2xl font-bold text-neutral-900 dark:text-white">99+</div>
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-0.5">
                      {t.about.stats.projects}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
              <span>{t.about.subtitle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.18] mb-6">
              {t.about.title}
            </h2>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              {t.about.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{language === 'en' ? 'Direct Founder Communication' : 'Komunikasi Langsung dengan Founder'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{language === 'en' ? 'No Hidden Vendor Lock-in' : 'Bebas Ketergantungan Vendor'}</span>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-sm transition-all duration-150 active:scale-[0.98] shadow-sm"
            >
              <span>{t.about.cta}</span>
              <span>→</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
