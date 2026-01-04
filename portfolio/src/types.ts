// Portfolio Data Type Definitions

export interface HeroData {
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
  tech: string[];
  summary: string;
  details: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface VibeCodingData {
  title: string;
  description: string;
}

export interface ContactInfo {
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
  contact: ContactInfo;
}
