import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  const icons = [
    // Free Copywriting
    <svg key="copy" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>,
    // Guaranteed Quality
    <svg key="quality" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // All-in-One
    <svg key="allinone" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>,
    // Full Support
    <svg key="support" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>,
  ];

  return (
    <section id="why-us" className="py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
            <span>{t.whyUs.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
            {t.whyUs.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            {t.whyUs.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.whyUs.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-900 dark:text-white shadow-sm">
                    {icons[idx]}
                  </div>
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
