const defaultSiteUrl = "https://www.byted.online";
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/g, "");

export const siteConfig = {
  name: "杜旭嘉",
  role: "AI 应用工程师（RAG / Agent）",
  siteUrl: envSiteUrl || defaultSiteUrl,
  description:
    "AI 应用工程师，主攻检索增强、智能体运行时与业务系统集成，强调可验证、可维护的工程交付与真实业务落地。",
  email: "2041487752dxj@gmail.com",
  icpRecord: "晋ICP备2026004157号-1",
  icpRecordUrl: "https://beian.miit.gov.cn/",
  ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
