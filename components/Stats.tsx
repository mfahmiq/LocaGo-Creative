
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.ceil(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return { count, elementRef };
};

const Stats: React.FC = () => {
    const { t } = useLanguage();

    // Custom hook usage for each stat
    const { count: countProjects, elementRef: refProjects } = useCounter(49);
    const { count: countClients, elementRef: refClients } = useCounter(99);
    const { count: countTimely, elementRef: refTimely } = useCounter(98);

    return (
        <section className="relative bg-white dark:bg-slate-900 py-12 transition-colors duration-300">
            {/* Top Gradient Fade */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 dark:from-slate-900 via-slate-50/50 dark:via-slate-900/50 to-transparent z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                    {/* Project Selesai */}
                    <div ref={refProjects} className="space-y-2 pt-8 md:pt-0">
                        <h3 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 tracking-tight tabular-nums">
                            {countProjects}+
                        </h3>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t.stats.projects}</p>
                    </div>

                    {/* Client Puas */}
                    <div ref={refClients} className="space-y-2 pt-8 md:pt-0">
                        <h3 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 tracking-tight tabular-nums">
                            {countClients}%
                        </h3>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t.stats.clients}</p>
                    </div>

                    {/* Tepat Waktu */}
                    <div ref={refTimely} className="space-y-2 pt-8 md:pt-0">
                        <h3 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 tracking-tight tabular-nums">
                            {countTimely}%
                        </h3>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t.stats.timely}</p>
                    </div>

                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-slate-50/50 dark:via-slate-900/50 to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};

export default Stats;
