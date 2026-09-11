import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type ServiceTab = 'business' | 'school' | 'personal';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<ServiceTab>('business');

  const tabs: { key: ServiceTab; label: string }[] = [
    { key: 'business', label: (t.services as any).tabBusiness },
    { key: 'school',   label: (t.services as any).tabSchool },
    { key: 'personal', label: (t.services as any).tabPersonal },
  ];

  const currentServices: Array<{ title: string; description: string; icon: string }> =
    (t.services as any)[activeTab] || [];

  const segmentBadges: Record<ServiceTab, string> = {
    business: language === 'en' ? 'UMKM & Corporate Architecture' : 'Solusi UMKM & Korporat',
    school: language === 'en' ? 'School & Academic Automation' : 'Sistem Sekolah & Akademik',
    personal: language === 'en' ? 'Personal & Student Prototypes' : 'Tugas Koding & Mahasiswa',
  };

  const getServiceIcon = (idx: number, tab: ServiceTab) => {
    if (tab === 'business') {
      if (idx === 0) {
        // Landing / E-Commerce
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      }
      if (idx === 1) {
        // WhatsApp Chatbot
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      }
      // Payment Gateway
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    }

    if (tab === 'school') {
      if (idx === 0) {
        // QR Attendance
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        );
      }
      if (idx === 1) {
        // Savings App
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      }
      // AI Lesson Plan
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }

    // personal
    if (idx === 0) {
      // GAS Automation
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    }
    if (idx === 1) {
      // Desktop / Mobile App
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    // Coding Task
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  };

  return (
    <section id="services" className="py-24 bg-neutral-50/50 dark:bg-neutral-950 transition-colors duration-200 relative border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-4 shadow-sm">
            <span>{segmentBadges[activeTab]}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 leading-[1.18]">
            {language === 'en' ? 'Multi-Segment Solutions' : 'Layanan Multi-Segmen'}
          </h2>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            {(t.services as any).sectionDescription ||
              'Solusi koding dari nol yang dirancang khusus sesuai kebutuhan Anda — apakah Anda pelaku bisnis, pendidik, atau pelajar.'}
          </p>
        </div>

        {/* Minimalist Segmented Control Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Service Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {currentServices.map((service, idx) => (
            <div
              key={`${activeTab}-${idx}`}
              className="p-7 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-900 dark:text-white shadow-sm">
                    {getServiceIcon(idx, activeTab)}
                  </div>
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                  {service.title}
                </h3>

                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('ai-consultation')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-900 dark:text-white hover:underline cursor-pointer"
                >
                  <span>{(t.services as any).viewCalculator || (language === 'en' ? 'View Investment Calculator' : 'Lihat Kalkulator Investasi')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="text-center mt-14 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 max-w-xl mx-auto">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4 text-xs sm:text-sm font-mono">
            {(t.services as any).bottomHelp ||
              (language === 'en'
                ? "Didn't find what you need? Tell us your specific requirements."
                : 'Tidak menemukan yang Anda butuhkan? Ceritakan kebutuhan spesifik Anda.')}
          </p>
          <a
            href={`https://wa.me/62895336377648?text=${encodeURIComponent(
              language === 'en'
                ? 'Hello LocaGo Creative! I would like to discuss my custom digital project requirements. 🚀'
                : 'Halo LocaGo Creative! Saya ingin diskusi tentang kebutuhan digital saya. 🚀'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-lg font-medium text-sm transition-all active:scale-[0.98] shadow-sm"
          >
            <span>{(t.services as any).bottomCta || (language === 'en' ? 'Discuss Custom Requirements' : 'Diskusi Kebutuhan Custom')}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
