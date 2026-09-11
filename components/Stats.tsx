import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const useCounter = (end: number, duration: number = 1400) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const update = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(update);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, elementRef };
};

const Stats: React.FC = () => {
  const { t, language } = useLanguage();

  const { count: countProjects, elementRef: refProjects } = useCounter(99);
  const { count: countClients, elementRef: refClients } = useCounter(99);
  const { count: countTimely, elementRef: refTimely } = useCounter(98);

  const statsData = [
    {
      ref: refProjects,
      value: `${countProjects}+`,
      label: t.stats.projects,
      caption: language === 'en' ? 'UMKM, Schools & Systems' : 'UMKM, Sekolah & Institusi',
    },
    {
      ref: refClients,
      value: `${countClients}%`,
      label: t.stats.clients,
      caption: language === 'en' ? 'Satisfaction Rating' : 'Tingkat Kepuasan Solusi',
    },
    {
      ref: refTimely,
      value: `${countTimely}%`,
      label: t.stats.timely,
      caption: language === 'en' ? 'On-Schedule Delivery SLA' : 'SLA Pengiriman Tepat Waktu',
    },
  ];

  return (
    <section className="relative border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-12 transition-colors duration-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
          {statsData.map((stat, i) => (
            <div
              key={i}
              ref={stat.ref}
              className={`flex flex-col items-center text-center ${
                i === 0 ? 'pb-6 md:pb-0 md:pr-8' : i === 2 ? 'pt-6 md:pt-0 md:pl-8' : 'py-6 md:py-0 md:px-8'
              }`}
            >
              <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-2">
                {stat.label}
              </div>
              <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                {stat.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
