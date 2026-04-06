// Portfolio Data Type Definitions

// ==========================================
// Shared Types
// ==========================================

export type AudienceType = "hr" | "jobSeeker" | "partner" | "client";
export type EvidenceLevel = "strict" | "estimated";

export interface VerificationInfo {
  sourceType: "repo" | "experience" | "manual";
  sourceLabel?: string;
  sourceUrl?: string;
  verifiedAt: string;
  confidence: "high" | "medium";
  level: EvidenceLevel;
  confidenceBasis?: string[]; // Optional explicit basis for confidence judgement.
  confidenceReason?: string; // Optional explicit reason for confidence judgement.
}

export interface BilingualText {
  zh: string;
  en: string;
}

export interface DualLensCopy {
  business: string;
  engineering: string;
}

export interface ExperienceDetail {
  background?: string; // 背景
  problem?: string; // 问题
  solution?: string; // 方案
  result?: string; // 结果
  role?: string; // 我的角色
  techStack?: string[]; // 技术栈
  links?: { label: string; url: string }[]; // 相关链接
  images?: { src: string; alt: string }[]; // 可选：项目截图
}

export interface BaseExperienceItem {
  id: string; // 唯一标识 (slug)
  year: string;
  role?: string; // 角色 (Timeline) 或 empty (Project)
  company?: string; // 公司 (Timeline) 或 empty (Project)
  name?: string; // 项目名 (Project)
  location?: string; // 地点
  summary: string; // 1-2 行摘要
  techTags: string[]; // 技术标签
  highlighted?: boolean; // 是否为重点
  expandedDetails?: ExperienceDetail; // 展开后的结构化详情
  keyOutcomes?: string[]; // 核心结果
  link?: string; // Project link
  demoLink?: string; // Project demo link
  audienceTags?: AudienceType[]; // 面向角色
  businessValue?: BilingualText; // 面向业务/客户视角
  engineeringDepth?: BilingualText; // 面向工程/求职视角
  verification?: VerificationInfo[]; // 证据来源
}

// ==========================================
// Experience / Timeline Types
// ==========================================

export interface TimelineItem extends BaseExperienceItem {
  role: string;
  company: string;
  bulletPoints?: string[]; // 旧版详情（兼容）
}

export interface ProjectItem extends BaseExperienceItem {
  name: string;
  impact?: string; // string format impact
}

// ==========================================
// Impact Section Types
// ==========================================

export interface ImpactItem {
  id: string;
  title: string;
  value: string;
  label: string;
  description?: string; // 口径/场景/方法说明
  details?: string; // Optional: longer markdown to show in the metric drawer.
  linkedExperienceId?: string; // 关联的经历 ID，点击跳转
  icon: string; // lucide icon 名称
  colSpan?: string;
  rowSpan?: string;
  bg?: string;
  isFocal?: boolean;
  githubRepo?: string; // Optional: GitHub repo name (e.g. "byteD-x/wechat-bot") for dynamic stats
  verification?: VerificationInfo;
}

// ==========================================
// Hero Section Types
// ==========================================

export interface HeroBullet {
  id: string;
  title: string;
  description: string;
}

export interface QuickFacts {
  role: string;
  availability: string;
  techStack: string[];
}

export interface RoleSnapshot {
  primaryRole: string;
  secondaryRole?: string;
  availability: string;
  location: string;
  updatedAt: string;
  // stats?: { ... }
}

export interface HeroData {
  name: string;
  title: string; // 主标题
  subtitle: string; // 副标题
  location?: string; // 地点/远程说明
  bullets: HeroBullet[]; // 3 个核心能力点
  quickFacts?: QuickFacts; // "Quick Facts" 卡片数据
  roleSnapshot?: RoleSnapshot; // 岗位匹配快照
}

// ==========================================
// Skills Section Types
// ==========================================

export interface SkillCategory {
  id: string;
  category: string;
  description?: string;
  items: string[];
}

export interface HarnessEngineeringData {
  title: string;
  description: string;
}

// ==========================================
// Services Section Types
// ==========================================

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  techStack?: string[]; // Optional tech stack badges
  gradient?: string; // Optional custom gradient for the card
  milestones?: string[]; // 协作里程碑
}

// ==========================================
// Contact Section Types
// ==========================================

export interface ContactData {
  phone: string;
  email: string;
  github: string;
  website?: string;
  websites?: string[];
  websiteLinks?: { label: string; url: string }[];
  resumeButtonText?: string; // 下载简历按钮文案
  ctaText?: string; // CTA 文案
  wechat?: string; // 微信号
  responseSlaText?: string; // 响应承诺文案
  visibility?: {
    defaultExpanded?: boolean;
    showPhoneByDefault?: boolean;
    showWechatByDefault?: boolean;
  };
  consultationChecklist?: string[]; // 咨询前准备项
}

export interface AudienceCard {
  id: AudienceType;
  title: string;
  focus: string;
  targetSection: "experience" | "projects" | "services" | "contact";
  primaryCTA: string;
  secondaryCTA?: string;
  highlightMetrics: string[];
}

// ==========================================
// Complete Portfolio Data
// ==========================================

export interface PortfolioData {
  hero: HeroData;
  about: BilingualText;
  aboutLenses?: DualLensCopy;
  impact: ImpactItem[];
  timeline: TimelineItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  services: ServiceItem[];
  harnessEngineering: HarnessEngineeringData;
  contact: ContactData;
  audienceCards: AudienceCard[];
}
