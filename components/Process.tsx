import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Process: React.FC = () => {
  const { t } = useLanguage();

  const icons = [
    // 01 Consultation & Brief
    <svg key="consult" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>,
    // 02 Agreement & Architecture
    <svg key="agree" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
    // 03 Handcrafted Development
    <svg key="code" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>,
    // 04 Live Review & Refinement
    <svg key="review" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>,
    // 05 Launch & Handover
    <svg key="launch" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
    </svg>,
  ];

  return (
    <section id="process" className="py-24 bg-white dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
            <span>{t.process.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
            {t.process.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            {t.process.description}
          </p>
        </div>

        {/* 5-Step Bento Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {t.process.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-900 dark:text-white shadow-sm">
                    {icons[idx]}
                  </div>
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600 font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                <span>Phase 0{idx + 1}</span>
                <span>{idx === t.process.steps.length - 1 ? 'Production' : '→ Next'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
