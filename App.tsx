import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Process from './components/Process';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Stats from './components/Stats';
import About from './components/About';
import WhyChooseUs from './components/WhyChooseUs';
import { SourceCodeHub } from './components/SourceCodeHub';
import { GitHubTrendingHub } from './components/GitHubTrendingHub';
import { AIToolsHub } from './components/AIToolsHub';
import { LinkListsHub } from './components/LinkListsHub';
import { ArticlesHub } from './components/ArticlesHub';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { NavigationTab } from './types';
import { DonateWidget } from './components/DonateWidget';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminPortal } from './components/AdminPortal';

const getInitialTab = (): NavigationTab => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#+/, '').split('?')[0].split('#')[0].split('&')[0];
    if (hash === 'source-code' || hash === 'github-trending' || hash === 'ai-tools' || hash === 'linklists' || hash === 'articles') {
      return hash as NavigationTab;
    }
    if (hash === 'portal' || hash.startsWith('portal/')) return 'portal';
    if (hash === 'admin') return 'admin';
  }
  return 'agency';
};

// Token portal pelanggan dari hash #portal/<token>.
// Sengaja mengembalikan segmen mentah (bukan hanya UUID): CustomerPortal
// sendiri yang memutuskan valid/tidaknya dan menampilkan pesan yang tepat.
// FIX bug blank saat hash navigation: token sebelumnya hanya dibaca saat
// render (getPortalToken() inline) dan tidak tersimpan di state — saat
// hash berubah tanpa reload dan activeTab tetap 'portal', React tidak
// me-render ulang tokennya. Sekarang token disimpan di state dan
// disinkronkan di SETIAP hashchange.
const getPortalToken = (): string => {
  if (typeof window === 'undefined') return '';
  const m = window.location.hash.match(/#portal\/([^/?#&]+)/);
  return m ? decodeURIComponent(m[1]) : '';
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);
  const [portalToken, setPortalToken] = useState<string>(() => getPortalToken());

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace(/^#+/, '').split('?')[0].split('#')[0].split('&')[0];
      // Token selalu disinkronkan, walau tab tidak berubah (portal -> portal
      // dengan token lain): tanpanya CustomerPortal memakai token basi.
      setPortalToken(getPortalToken());
      if (currentHash === 'source-code' || currentHash === 'github-trending' || currentHash === 'ai-tools' || currentHash === 'linklists' || currentHash === 'articles') {
        setActiveTab(currentHash as NavigationTab);
      } else if (currentHash === 'portal' || currentHash.startsWith('portal/')) {
        setActiveTab('portal');
      } else if (currentHash === 'admin') {
        setActiveTab('admin');
      } else if (!currentHash || currentHash === 'agency') {
        setActiveTab('agency');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-200 flex flex-col justify-between">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'portal' && (
          <ErrorBoundary fallbackTitle="Portal Pelanggan">
            {/* key per token: pindah token = remount bersih, state loading/
                error token lama tidak terbawa. */}
            <CustomerPortal key={portalToken || 'invalid'} token={portalToken} />
          </ErrorBoundary>
        )}
        {activeTab === 'admin' && (
          <ErrorBoundary fallbackTitle="Portal Admin">
            <AdminPortal />
          </ErrorBoundary>
        )}

        {activeTab === 'agency' && (
          <>
            <Hero />
            <Stats />
            <About />
            <WhyChooseUs />
            <Services />
            <Pricing />
            <Process />
            <FAQ />
            <Contact />
          </>
        )}

        {activeTab === 'source-code' && (
          <ErrorBoundary fallbackTitle="Source Code Hub">
            <SourceCodeHub />
          </ErrorBoundary>
        )}
        {activeTab === 'github-trending' && (
          <ErrorBoundary fallbackTitle="GitHub Trending Radar">
            <GitHubTrendingHub />
          </ErrorBoundary>
        )}
        {activeTab === 'ai-tools' && (
          <ErrorBoundary fallbackTitle="AI Tools Library">
            <AIToolsHub />
          </ErrorBoundary>
        )}
        {activeTab === 'linklists' && (
          <ErrorBoundary fallbackTitle="Pustaka LinkList Publik">
            <LinkListsHub />
          </ErrorBoundary>
        )}
        {activeTab === 'articles' && (
          <ErrorBoundary fallbackTitle="Artikel & Panduan AI">
            <ArticlesHub />
          </ErrorBoundary>
        )}
      </main>

      <Footer />
      <AuthModal />
      <DonateWidget />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
