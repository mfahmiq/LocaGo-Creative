
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();

  const images = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
  ];

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">{t.portfolio.subtitle}</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{t.portfolio.title}</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            {t.portfolio.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {t.portfolio.projects.map((project, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="overflow-hidden rounded-3xl mb-4 bg-slate-100 dark:bg-slate-800 aspect-video relative">
                <img
                  src={images[idx]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300"></div>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{project.category}</span>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
