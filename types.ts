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

export type NavigationTab = 'agency' | 'source-code' | 'github-trending' | 'ai-tools' | 'linklists' | 'articles';

export interface SourceCodeCredential {
  role: string;
  username: string;
  password: string;
}

export interface SourceCodeItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  techStack: string[];
  description: string;
  shortDesc: string;
  howItWorks?: string;
  requirements?: string;
  screenshots?: string[];
  defaultCredentials?: SourceCodeCredential[];
  updatedAt?: string;
  releaseDate?: string;
  recentFastDownloads?: number;
  thumbnail: string;
  downloadsCount: number;
  rating: number;
  isPopular?: boolean;
  isFree: boolean;
  hasDatabase: boolean;
  databaseType?: string;
  demoUrl?: string;
  fileSize: string;
  tutorialSteps: string[];
  keyFeatures: string[];
  downloadUrlFree: string; // Goes to safelink loop dwollopus.eu.org
  downloadUrlFast: string; // Direct VIP link / QRIS donation
  driveUrl?: string;
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
  screenshotUrl?: string;
  demoVideoUrl?: string;
  affiliateUrl: string;
  isFeatured?: boolean;
}

export interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  note?: string;
  createdAt?: string;
}

export interface LinkListItem {
  id: string;
  title: string;
  notes: string;
  videoUrl?: string;
  toolIds: string[];
  customLinks?: CustomLinkItem[];
  userId?: string;
  authorEmail?: string;
  authorName?: string;
  isOfficial?: boolean;
  createdAt: string;
  views?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'member';
  isOwner: boolean;
}
