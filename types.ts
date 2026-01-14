
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
