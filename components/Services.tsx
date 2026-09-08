
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type ServiceTab = 'business' | 'school' | 'personal';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ServiceTab>('business');

  const tabs: { key: ServiceTab; label: string; color: string; gradient: string }[] = [
    { key: 'business', label: (t.services as any).tabBusiness, color: 'blue', gradient: 'from-blue-600 to-indigo-600' },
    { key: 'school',   label: (t.services as any).tabSchool,   color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
    { key: 'personal', label: (t.services as any).tabPersonal, color: 'sky', gradient: 'from-sky-600 to-blue-700' },
  ];

  const colorMap: Record<ServiceTab, { icon: string; badge: string; cardHover: string; iconBg: string }> = {
    business: {
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      cardHover: 'hover:border-blue-300 dark:hover:border-blue-500/50 group-hover:text-blue-600 dark:group-hover:text-blue-400',
      iconBg: 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40',
    },
    school: {
      icon: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      cardHover: 'hover:border-emerald-300 dark:hover:border-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      iconBg: 'from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40',
    },
    personal: {
      icon: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
      cardHover: 'hover:border-sky-300 dark:hover:border-sky-500/50 group-hover:text-sky-600 dark:group-hover:text-sky-400',
      iconBg: 'from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/40',
    },
  };

  const currentServices: Array<{ title: string; description: string; icon: string }> = (t.services as any)[activeTab] || [];
  const colors = colorMap[activeTab];
  const activeTabDef = tabs.find(t => t.key === activeTab)!;

  const segmentBadges: Record<ServiceTab, string> = {
    business: language === 'en' ? 'For UMKM & Corporate' : 'Untuk UMKM & Korporat',
    school: language === 'en' ? 'For Schools & Teachers' : 'Untuk Sekolah & Guru',
    personal: language === 'en' ? 'For Students & Solopreneurs' : 'Untuk Mahasiswa & Solopreneur',
  };

  const renderServiceSvgIcon = (title: string, tab: ServiceTab) => {
    const tLower = title.toLowerCase();
    if (tLower.includes('landing') || tLower.includes('commerce') || tLower.includes('toko')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    }
    if (tLower.includes('chatbot') || tLower.includes('bot')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    }
    if (tLower.includes('payment') || tLower.includes('pembayaran') || tLower.includes('gateway')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    }
    if (tLower.includes('presensi') || tLower.includes('qr') || tLower.includes('absensi')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      );
    }
    if (tLower.includes('tabungan') || tLower.includes('savings')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    if (tLower.includes('rps') || tLower.includes('lesson') || tLower.includes('kurikulum')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    if (tLower.includes('apps script') || tLower.includes('otomasi') || tLower.includes('automation')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    }
    if (tLower.includes('desktop') || tLower.includes('mobile')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  };

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className={`inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${activeTabDef.gradient} text-white shadow-lg transition-all duration-300`}>
            {segmentBadges[activeTab]}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {(t.services as any).sectionBadge ? (
              <>
                {language === 'en' ? 'Multi-Segment ' : 'Layanan '}
                <span className="text-gradient">{language === 'en' ? 'Services' : 'Multi-Segmen'}</span>
              </>
            ) : (
              <>
                Layanan <span className="text-gradient">Multi-Segmen</span>
              </>
            )}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {(t.services as any).sectionDescription || 'Solusi digital yang dirancang khusus sesuai kebutuhan Anda — apakah Anda pelaku bisnis, pendidik, atau pelajar.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {currentServices.map((service, idx) => (
            <div
              key={`${activeTab}-${idx}`}
              className={`group relative p-8 rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl ${colors.cardHover}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeTabDef.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activeTabDef.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl`}></div>

              <div className="relative z-10">
                {/* SVG Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.iconBg} ${colors.icon} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {renderServiceSvgIcon(service.title, activeTab)}
                </div>

                <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors ${colors.cardHover.split(' ').slice(2).join(' ')}`}>
                  {service.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('ai-consultation')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-2 text-sm font-semibold ${colors.icon} hover:gap-3 transition-all duration-200 cursor-pointer`}
                >
                  {(t.services as any).viewCalculator || (language === 'en' ? 'View Investment Calculator' : 'Lihat Kalkulator Investasi')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
            {(t.services as any).bottomHelp || (language === 'en' ? "Didn't find what you need? Tell us your specific requirements." : 'Tidak menemukan yang Anda butuhkan? Ceritakan kebutuhan spesifik Anda.')}
          </p>
          <a
            href={`https://wa.me/62895336377648?text=${encodeURIComponent(
              language === 'en'
                ? 'Hello LocaGo Creative! I would like to discuss my custom digital project requirements. 🚀'
                : 'Halo LocaGo Creative! Saya ingin diskusi tentang kebutuhan digital saya. 🚀'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            {(t.services as any).bottomCta || (language === 'en' ? 'Discuss Custom Requirements' : 'Diskusi Kebutuhan Custom')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
