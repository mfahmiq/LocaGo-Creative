
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image / Visual Side */}
                    <div className="relative">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 p-1">
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[22px] flex items-center justify-center relative overflow-hidden group">
                                {/* Abstract Shapes */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                                {/* Placeholder Content/Illustration */}
                                <div className="text-center p-8 relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <span className="text-4xl">🚀</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">DevFlow Agency</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Your Trusted Digital Partner</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">5+</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.about.stats.exp}</div>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">50+</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.about.stats.projects}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <span className="block text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">
                            {t.about.subtitle}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                            {t.about.title}
                        </h2>
                        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                            {t.about.description}
                        </p>

                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all active:scale-95"
                        >
                            {t.about.cta}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
