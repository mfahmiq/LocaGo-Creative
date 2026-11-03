import React from 'react';

export interface PricingTier {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

export interface Project {
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ==========================================
// NEW TYPES FOR LOCAGO ECOSYSTEM
// ==========================================

export type NavigationTab = 'agency' | 'source-code' | 'github-trending' | 'ai-tools' | 'articles';

export interface SourceCodeItem {
  id: string;
  title: string;
  slug: string;
  category: 'PHP & Laravel' | 'Google Apps Script' | 'Python & AI' | 'Next.js & React' | 'Mobile & Desktop';
  techStack: string[];
  description: string;
  shortDesc: string;
  thumbnail: string;
  downloadsCount: number;
  rating: number;
  isPopular?: boolean;
  isFree: boolean;
  hasDatabase: boolean;
  databaseType?: 'MySQL (.sql)' | 'Google Sheets' | 'SQLite' | 'PostgreSQL';
  demoUrl?: string;
  fileSize: string;
  tutorialSteps: string[];
  keyFeatures: string[];
  downloadUrlFree: string; // Goes to safelink loop dwollopus.eu.org
  downloadUrlFast: string; // Direct VIP link / Saweria donation
}

export interface GitHubTrendingItem {
  id: string;
  name: string;
  repo: string;
  starsToday: number;
  totalStars: string;
  category: 'AI Agents & LLM' | 'Dev Tools & Automation' | 'Web & Scrapers' | 'Productivity & Media';
  language?: string;
  topics?: string[];
  growthRate?: string;
  rank?: number;
  oneSentencePitch: string;
  features: string[];
  benefits: string[];
  mediaType: 'image' | 'gif' | 'video' | 'none';
  mediaUrl?: string;
  officialSite?: string;
}

export interface AIToolItem {
  id: string;
  name: string;
  category: 'AI Writing & SEO' | 'Voice & Audio AI' | 'Automation & No-Code' | 'Video & Graphics' | 'AI Coding';
  pricingType: 'Free' | 'Freemium' | 'Free Trial' | 'Paid';
  commissionRate: string;
  tagline: string;
  description: string;
  features: string[];
  tags?: string[];
  upvotes?: number;
  logoUrl?: string;
  affiliateUrl: string;
  isFeatured?: boolean;
}
