
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PricingTier {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

const PricingCard: React.FC<PricingTier & { popularLabel: string; categoryName: string }> = ({ title, price, description, features, isPopular, ctaText, popularLabel, categoryName }) => (
  <div className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${isPopular ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-xl scale-105 z-10' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 shadow-lg'}`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
        {popularLabel}
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
    </div>

    <div className="mb-8">
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{price}</div>
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
          <svg className="w-5 h-5 mr-3 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>

    <a
      href={`https://wa.me/6289663012893?text=Halo LocaGo Creative, saya tertarik dengan paket *${title}* untuk layanan *${categoryName}*. Bisa diskusi lebih lanjut?`}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full py-4 rounded-2xl text-center font-bold transition-all active:scale-95 ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-blue-900/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
    >
      {ctaText}
    </a>
  </div>
);

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'landing' | 'company' | 'store' | 'travel' | 'seo'>('landing');

  const tabKeys: Array<'landing' | 'company' | 'store' | 'travel' | 'seo'> = ['landing', 'company', 'store', 'travel', 'seo'];

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">{t.pricing.subtitle}</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t.pricing.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8">
            {t.pricing.description}
          </p>

          {/* Tab Switcher - Scrollable on mobile */}
          <div className="flex justify-center w-full px-0 md:px-0">
            <div className="flex w-full md:w-auto overflow-x-auto pb-4 md:pb-0 gap-2 md:gap-0 bg-transparent md:bg-white md:dark:bg-slate-800 p-0 md:p-1.5 rounded-none md:rounded-2xl shadow-none md:shadow-sm md:border border-slate-200 dark:border-slate-700 no-scrollbar snap-x snap-mandatory md:snap-none">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-shrink-0 snap-center px-5 py-2.5 md:py-3 md:px-6 text-sm font-bold rounded-full md:rounded-xl transition-all whitespace-nowrap border md:border-none ${activeTab === key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30 border-blue-600'
                    : 'bg-white dark:bg-slate-800 md:bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {t.pricing.tabs[key]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 px-4 md:px-0">
          {t.pricing.categories[activeTab].map((tier, idx) => (
            <PricingCard
              key={idx}
              {...tier}
              popularLabel={t.pricing.popular}
              categoryName={t.pricing.tabs[activeTab]}
            />
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm mt-8 max-w-2xl mx-auto">
          {t.pricing.note}
        </p>
      </div>
    </section>
  );
};

export default Pricing;
