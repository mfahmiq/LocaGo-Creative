import React, { useState, useEffect, useCallback } from 'react';
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
import { GratisPage } from './components/GratisPage';
import { setPageMeta, DEFAULT_META, titleFromSlug } from './lib/seo';

// ============================================================================
// Rute nyata (SEO) — 19 Nov 2026
// ----------------------------------------------------------------------------
// Dulu semua konten di balik hash (#ai-tools, #articles, ...) yang diabaikan
// Google, jadi situs ini praktis satu halaman. Sekarang tiap hub & item punya
// path nyata yang diteruskan Vercel ke index.html (rewrite SPA di vercel.json):
//   /ai-tools  /artikel  /source-code  /github-trending  /linklists  /gratis
//   /tools/<slug>  /artikel/<slug>  /source-code/<slug>
// Hash lama TETAP didukung (fallback di parseRoute) supaya link lama,
// bookmark, dan share link lama tidak mati. Canonical + link internal memakai
// path nyata. Portal (#portal/<token>) dan admin (#admin) tetap hash-only.
// ============================================================================

export interface RouteInfo {
  tab: NavigationTab;
  toolSlug: string | null;
  articleSlug: string | null;
  sourceSlug: string | null;
  /** Id (slug) LinkList pada rute /linklists/<id>; null bila hub biasa. */
  linklistSlug: string | null;
}

const TAB_PATHS: Record<NavigationTab, string> = {
  agency: '/',
  'ai-tools': '/ai-tools',
  articles: '/artikel',
  'source-code': '/source-code',
  'github-trending': '/github-trending',
  linklists: '/linklists',
  gratis: '/gratis',
  portal: '/#portal',
  admin: '/#admin',
};

const parseHashRoute = (): RouteInfo | null => {
  const hash = window.location.hash.replace(/^#+/, '').split('?')[0].split('#')[0].split('&')[0];
  if (hash === 'source-code' || hash === 'github-trending' || hash === 'ai-tools' || hash === 'linklists' || hash === 'articles' || hash === 'gratis') {
    return { tab: hash as NavigationTab, toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  }
  if (hash === 'portal' || hash.startsWith('portal/')) return { tab: 'portal', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  if (hash === 'admin') return { tab: 'admin', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  return null;
};

const parseRoute = (): RouteInfo => {
  if (typeof window === 'undefined') {
    return { tab: 'agency', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  // Rute detail: /tools/<slug>, /artikel/<slug>, /source-code/<slug>
  if (segments.length === 2) {
    const [kind, slug] = segments;
    const decoded = decodeURIComponent(slug);
    if (kind === 'tools') return { tab: 'ai-tools', toolSlug: decoded, articleSlug: null, sourceSlug: null, linklistSlug: null };
    if (kind === 'artikel') return { tab: 'articles', toolSlug: null, articleSlug: decoded, sourceSlug: null, linklistSlug: null };
    if (kind === 'source-code') return { tab: 'source-code', toolSlug: null, articleSlug: null, sourceSlug: decoded, linklistSlug: null };
    if (kind === 'linklists') return { tab: 'linklists', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: decoded };
  }
  // Rute hub
  if (segments.length === 1) {
    const hub: Record<string, NavigationTab> = {
      'ai-tools': 'ai-tools',
      artikel: 'articles',
      'source-code': 'source-code',
      'github-trending': 'github-trending',
      linklists: 'linklists',
      gratis: 'gratis',
    };
    const tab = hub[segments[0]];
    if (tab) return { tab, toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  }
  if (path === '/') {
    // Halaman utama: hormati hash lama (#ai-tools, #source-code?item=<slug>, ...).
    const hashRoute = parseHashRoute();
    if (hashRoute) {
      // Deep-link lama source code: #source-code?item=<slug>
      if (hashRoute.tab === 'source-code') {
        const m = window.location.hash.match(/item=([^&#]+)/);
        if (m) hashRoute.sourceSlug = decodeURIComponent(m[1]);
      }
      return hashRoute;
    }
    return { tab: 'agency', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
  }
  // Path tidak dikenal: perlakukan sebagai halaman utama (SPA fallback).
  return { tab: 'agency', toolSlug: null, articleSlug: null, sourceSlug: null, linklistSlug: null };
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

// Meta per rute (hub & home). Halaman detail memakai judul sementara dari
// slug di sini, lalu hub memperhalusnya begitu data item dimuat.
const HUB_META: Record<Exclude<NavigationTab, 'portal' | 'admin'>, { title: string; description: string; canonicalPath: string }> = {
  agency: {
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    canonicalPath: '/',
  },
  'ai-tools': {
    title: 'Katalog AI Tools Terlengkap 2026 — 500+ Tool AI Terkurasi | LocaGo Creative',
    description:
      'Direktori 500+ AI tools terkurasi untuk coding, penulisan & SEO, voice & audio, video & grafis, dan otomasi bisnis. Bandingkan harga, fitur, dan ulasan — gratis.',
    canonicalPath: '/ai-tools',
  },
  articles: {
    title: 'Artikel & Panduan AI Terlengkap — Tutorial, Komparasi & Strategi | LocaGo Creative',
    description:
      'Kumpulan artikel edukasi mendalam, komparasi software AI, dan strategi monetisasi digital dalam Bahasa Indonesia dan English.',
    canonicalPath: '/artikel',
  },
  'source-code': {
    title: 'Download Source Code Gratis — POS, Absensi QR, Katalog UMKM, SIAKAD | LocaGo Creative',
    description:
      'Koleksi source code aplikasi gratis siap pakai: POS kasir, absensi QR, katalog UMKM, SIAKAD, dan sistem inventaris — PHP, Laravel, Next.js, dan Python lengkap dengan database.',
    canonicalPath: '/source-code',
  },
  'github-trending': {
    title: 'GitHub Trending Radar — Repositori AI Paling Berkembang Hari Ini | LocaGo Creative',
    description:
      'Pelacak live repositori GitHub dan AI agent dengan lonjakan bintang tertinggi hari ini — radar harian dan mingguan.',
    canonicalPath: '/github-trending',
  },
  linklists: {
    title: 'Pustaka LinkList Publik — Koleksi Tool AI Pilihan Komunitas | LocaGo Creative',
    description:
      'Jelajahi LinkList publik berisi kumpulan AI tools pilihan komunitas LocaGo Creative berdasarkan kebutuhan dan use-case.',
    canonicalPath: '/linklists',
  },
  gratis: {
    title: 'Gratis — 600+ AI Tools, Source Code Website & GitHub Trending | LocaGo Creative',
    description:
      'Semua yang gratis di LocaGo Creative: 600+ AI tools terkurasi, download source code website premium (POS, absensi QR, katalog UMKM, SIAKAD), dan radar GitHub Trending harian — tanpa login.',
    canonicalPath: '/gratis',
  },
};

const AppContent: React.FC = () => {
  const [route, setRoute] = useState<RouteInfo>(() => parseRoute());
  const [portalToken, setPortalToken] = useState<string>(() => getPortalToken());
  const activeTab = route.tab;

  const navigate = useCallback((path: string, replace = false) => {
    if (typeof window === 'undefined') return;
    if (replace) window.history.replaceState(null, '', path);
    else window.history.pushState(null, '', path);
    setPortalToken(getPortalToken());
    setRoute(parseRoute());
    window.scrollTo({ top: 0 });
  }, []);

  const setActiveTab = useCallback(
    (tab: NavigationTab) => {
      navigate(TAB_PATHS[tab]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate],
  );

  // Navigasi browser (back/forward) + hash lama.
  useEffect(() => {
    const handleRouteChange = () => {
      // Token selalu disinkronkan, walau tab tidak berubah (portal -> portal
      // dengan token lain): tanpanya CustomerPortal memakai token basi.
      setPortalToken(getPortalToken());
      setRoute(parseRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Meta dinamis per rute. Portal & admin dilewati: AdminPortal mengatur
  // sendiri title + robots noindex saat mount, CustomerPortal tidak butuh
  // meta index. Hub memperhalus meta detail begitu data item dimuat.
  useEffect(() => {
    if (route.tab === 'portal' || route.tab === 'admin') return;
    if (route.toolSlug) {
      const name = titleFromSlug(route.toolSlug);
      setPageMeta({
        title: `${name} — Review, Harga & Fitur | LocaGo Creative`,
        description: `Pelajari ${name}: fitur, harga, dan cara pakainya. Lihat detail lengkap ${name} di direktori AI tools LocaGo Creative.`,
        canonicalPath: `/tools/${encodeURIComponent(route.toolSlug)}`,
        ogType: 'article',
      });
      return;
    }
    if (route.articleSlug) {
      const name = titleFromSlug(route.articleSlug);
      setPageMeta({
        title: `${name} | LocaGo Creative`,
        description: `Baca artikel ${name} — panduan AI, tutorial, dan strategi digital dari LocaGo Creative.`,
        canonicalPath: `/artikel/${encodeURIComponent(route.articleSlug)}`,
        ogType: 'article',
      });
      return;
    }
    if (route.linklistSlug) {
      const name = titleFromSlug(route.linklistSlug.replace(/^list-/, ''));
      setPageMeta({
        title: `${name} — Panduan & LinkList | LocaGo Creative`,
        description: `Buka LinkList ${name} — kumpulan panduan dan link pilihan dari LocaGo Creative.`,
        canonicalPath: `/linklists/${encodeURIComponent(route.linklistSlug)}`,
        ogType: 'article',
      });
      return;
    }
    if (route.sourceSlug) {
      const name = titleFromSlug(route.sourceSlug);
      setPageMeta({
        title: `${name} — Download Source Code Gratis | LocaGo Creative`,
        description: `Download source code ${name} gratis — aplikasi siap pakai lengkap dengan database dan panduan instalasi dari LocaGo Creative.`,
        canonicalPath: `/source-code/${encodeURIComponent(route.sourceSlug)}`,
        ogType: 'article',
      });
      return;
    }
    const hub = HUB_META[route.tab as keyof typeof HUB_META];
    if (hub) setPageMeta(hub);
  }, [route]);

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
            <SourceCodeHub
              initialItemSlug={route.sourceSlug}
              onItemNavigate={(slug) => navigate(slug ? `/source-code/${encodeURIComponent(slug)}` : '/source-code')}
            />
          </ErrorBoundary>
        )}
        {activeTab === 'github-trending' && (
          <ErrorBoundary fallbackTitle="GitHub Trending Radar">
            <GitHubTrendingHub />
          </ErrorBoundary>
        )}
        {activeTab === 'ai-tools' && (
          <ErrorBoundary fallbackTitle="AI Tools Library">
            <AIToolsHub
              initialToolSlug={route.toolSlug}
              onToolNavigate={(slug) => navigate(slug ? `/tools/${encodeURIComponent(slug)}` : '/ai-tools')}
            />
          </ErrorBoundary>
        )}
        {activeTab === 'linklists' && (
          <ErrorBoundary fallbackTitle="Pustaka LinkList Publik">
            <LinkListsHub
              initialLinklistSlug={route.linklistSlug}
              onLinklistNavigate={(slug) => navigate(slug ? `/linklists/${encodeURIComponent(slug)}` : '/linklists')}
            />
          </ErrorBoundary>
        )}
        {activeTab === 'articles' && (
          <ErrorBoundary fallbackTitle="Artikel & Panduan AI">
            <ArticlesHub
              initialArticleSlug={route.articleSlug}
              onArticleNavigate={(slug) => navigate(slug ? `/artikel/${encodeURIComponent(slug)}` : '/artikel')}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'gratis' && (
          <ErrorBoundary fallbackTitle="Gratis">
            <GratisPage />
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
