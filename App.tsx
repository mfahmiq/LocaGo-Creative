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

const getInitialTab = (): NavigationTab => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '').split('?')[0].split('&')[0];
    if (hash === 'source-code' || hash === 'github-trending' || hash === 'ai-tools' || hash === 'linklists' || hash === 'articles') {
      return hash as NavigationTab;
    }
  }
  return 'agency';
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '').split('?')[0].split('&')[0];
      if (currentHash === 'source-code' || currentHash === 'github-trending' || currentHash === 'ai-tools' || currentHash === 'linklists' || currentHash === 'articles') {
        setActiveTab(currentHash as NavigationTab);
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
