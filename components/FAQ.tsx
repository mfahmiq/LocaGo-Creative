
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">{t.faq.subtitle}</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t.faq.title}</h3>
          <p className="text-slate-500 dark:text-slate-400">{t.faq.description}</p>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 ${openIdx === idx ? 'bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50' : 'bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700'}`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`text-lg font-bold ${openIdx === idx ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180 text-blue-500' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIdx === idx && (
                <div className="px-8 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
