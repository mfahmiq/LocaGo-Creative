export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  language: 'id' | 'en';
  category: string;
  readTime: string;
  date: string;
  cover: string;
  excerpt: string;
  content: string;
  youtubeId?: string;
  instagramUrl?: string;
  affiliateTools?: { name: string; url: string }[];
}

export const ARTICLES_LIST: ArticleItem[] = [];
