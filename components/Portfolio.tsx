
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();

  const images = [
    'https://s0.wp.com/mshots/v1/https%3A%2F%2Falharamain-kohl.vercel.app%2F?w=600&h=400&format=webp', // Alharamain
    'https://s0.wp.com/mshots/v1/https%3A%2F%2Fglowup-kohl.vercel.app%2F?w=600&h=400&format=webp', // Glowup
    'https://s0.wp.com/mshots/v1/https%3A%2F%2Fnusatrip.vercel.app%2F?w=600&h=400&format=webp', // Nusatrip
    'https://s0.wp.com/mshots/v1/https%3A%2F%2Furbankicks-one.vercel.app%2F?w=600&h=400&format=webp', // Urban Kicks
    'https://s0.wp.com/mshots/v1/https%3A%2F%2Fmitrakonstruksi.vercel.app%2F?w=600&h=400&format=webp', // Mitra Konstruksi
  ];

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <span className="block text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">{t.portfolio.subtitle}</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{t.portfolio.title}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            {t.portfolio.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {t.portfolio.projects.map((project, idx) => (
            <a
              key={idx}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer block"
            >
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
