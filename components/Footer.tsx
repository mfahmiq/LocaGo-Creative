import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/locagocreative',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@locagocreative',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.84 1.56V6.79a4.84 4.84 0 01-1.07-.1z" />
        </svg>
      ),
    },
    {
      name: 'Threads',
      url: 'https://threads.net/@locagocreative',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142c-.126-.742-.375-1.332-.74-1.757-.438-.506-1.098-.775-1.962-.8-1.517.032-2.558.599-3.095 1.685l-1.793-.938C7.981 5.98 9.55 5.065 11.955 5c1.44.04 2.7.52 3.617 1.392 1.088 1.03 1.643 2.547 1.74 4.45.16.037.319.075.475.117 1.378.372 2.465 1.113 3.149 2.148.994 1.486 1.12 3.575.348 5.542-1.101 2.78-3.543 4.358-7.098 4.351zm-.557-8.915c-1.002.06-1.798.318-2.34.757-.463.375-.69.87-.656 1.452.03.574.32 1.068.817 1.39.55.357 1.286.528 2.183.478 1.136-.064 1.992-.478 2.546-1.23.421-.566.678-1.322.764-2.252a11.654 11.654 0 00-2.314-.595z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/locagocreative',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const quickLinks = ['about', 'services', 'process', 'contact'];

  return (
    <footer className="bg-neutral-50/70 dark:bg-neutral-950 pt-16 pb-8 transition-colors duration-200 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* 1. Identity & Studio Dossier */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2.5">
              <img
                src="/logo.png"
                alt="LocaGo Creative"
                className="w-8 h-8 object-contain rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5 shadow-sm"
              />
              <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                LocaGo Creative
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{(t.footer as any).location || (language === 'en' ? 'Garut, West Java, Indonesia' : 'Garut, Jawa Barat, Indonesia')}</span>
            </div>
          </div>

          {/* 2. Navigation Quick Links */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {quickLinks.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">→</span>
                    <span>{t.nav[key as keyof typeof t.nav]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Direct Contact */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="https://wa.me/62895336377648"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-2.5"
                >
                  <span className="font-mono text-xs text-neutral-400">WA:</span>
                  <span className="font-medium">+62 895-3363-77648</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:locagocreative@gmail.com"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-2.5"
                >
                  <span className="font-mono text-xs text-neutral-400">Mail:</span>
                  <span className="font-medium">locagocreative@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400">
                <span className="font-mono text-xs text-neutral-400">Loc:</span>
                <span>{(t.footer as any).location || 'Garut, Jawa Barat'}</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Media Channels */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4">
              {t.footer.socials}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm"
                >
                  {social.icon}
                  <span className="text-xs font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Copyright Bar */}
        <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-neutral-400 dark:text-neutral-500">
          <p>© 2026 LocaGo Creative (locagocreative.my.id). Handcrafted code, zero templates.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">Terms</a>
            <a href="https://github.com/mfahmiq" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
