// Portfolio Data Type Definitions

// ==========================================
// Shared Types
// ==========================================

export interface ExperienceDetail {
  background?: string;     // 背景
  problem?: string;        // 问题
  solution?: string;       // 方案
  result?: string;         // 结果
  role?: string;           // 我的角色
  techStack?: string[];    // 技术栈
  links?: { label: string; url: string }[];  // 相关链接
  images?: { src: string; alt: string }[];   // 可选：项目截图
}

export interface BaseExperienceItem {
  id: string;              // 唯一标识 (slug)
  year: string;
  role?: string;           // 角色 (Timeline) 或 empty (Project)
  company?: string;        // 公司 (Timeline) 或 empty (Project)
  name?: string;           // 项目名 (Project)
  location?: string;       // 地点
  summary: string;         // 1-2 行摘要
  techTags: string[];      // 技术标签
  highlighted?: boolean;   // 是否为重点
  expandedDetails?: ExperienceDetail;  // 展开后的结构化详情
  keyOutcomes?: string[];  // 核心结果
  link?: string;           // Project link
  demoLink?: string;       // Project demo link
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
  tech: string[]; // Keep for backward compatibility, mapped to techTags
  details: string[]; // Keep for backward compatibility
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
  description?: string;    // 口径/场景/方法说明
  linkedExperienceId?: string;  // 关联的经历 ID，点击跳转
  icon: string;            // lucide icon 名称
  colSpan?: string;
  rowSpan?: string;
  bg?: string;
  isFocal?: boolean;
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

export interface HeroData {
  name: string;
  title: string;           // 主标题
  subtitle: string;        // 副标题
  bullets: HeroBullet[];   // 3 个核心能力点
  quickFacts?: QuickFacts; // "Quick Facts" 卡片数据
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

export interface VibeCodingData {
  title: string;
  description: string;
}

// ==========================================
// Contact Section Types
// ==========================================

export interface ContactData {
  phone: string;
  email: string;
  github: string;
  website: string;
  resumeButtonText?: string;  // 下载简历按钮文案
  ctaText?: string;           // CTA 文案
}

// ==========================================
// Complete Portfolio Data
// ==========================================

export interface PortfolioData {
  hero: HeroData;
  about: string;
  impact: ImpactItem[];
  timeline: TimelineItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  vibeCoding: VibeCodingData;
  contact: ContactData;
}

// ==========================================
// Editor State Types
// ==========================================

export interface EditorState {
  isEditorEnabled: boolean;  // 是否启用编辑功能（环境变量控制）
  isEditing: boolean;        // 当前是否处于编辑模式
  isDirty: boolean;          // 是否有未保存的更改
  lastSaved?: Date;          // 上次保存时间
}
