// Portfolio Data Type Definitions

export interface HeroData {
  name: string;
  title: string;
  subtitle: string;
}

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  summary: string;
  details: string[];
}

export interface ProjectItem {
  year: string;
  name: string;
  link?: string;
  demoLink?: string;
  tech: string[];
  summary: string;
  details: string[];
  impact?: string; // e.g. "Performance +50%"
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface VibeCodingData {
  title: string;
  description: string;
}

export interface ContactData {
  phone: string;
  email: string;
  github: string;
  website: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: string;
  timeline: TimelineItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  vibeCoding: VibeCodingData;
  contact: ContactData;
}
