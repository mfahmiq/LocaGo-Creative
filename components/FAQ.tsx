import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-24 bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-200 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
            <span>{t.faq.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
            {t.faq.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            {t.faq.description}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {t.faq.items.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-md border border-neutral-200 dark:border-neutral-800 flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-400">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-neutral-900 dark:text-white' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
