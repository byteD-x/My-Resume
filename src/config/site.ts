const defaultSiteUrl = "https://my-resume-gray-five.vercel.app";
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/g, "");

export const siteConfig = {
  name: "杜旭嘉",
  role: "AI 应用工程师（RAG / Agent）",
  siteUrl: envSiteUrl || defaultSiteUrl,
  description:
    "AI 应用工程师，主攻 RAG、Agent 运行时与业务系统集成，强调可恢复、可评测、可复核的工程交付与真实业务落地。",
  email: "2041487752dxj@gmail.com",
  ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
