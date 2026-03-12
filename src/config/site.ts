const defaultSiteUrl = "https://my-resume-gray-five.vercel.app";
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/g, "");

export const siteConfig = {
  name: "杜旭嘉",
  role: "AI 应用工程师（RAG / Agent / 智能客服）",
  siteUrl: envSiteUrl || defaultSiteUrl,
  description:
    "AI 应用工程师，主攻 RAG、Agent 运行时、多通道智能客服与业务系统集成，强调可恢复、可评测、可复核的工程交付。",
  email: "2041487752dxj@gmail.com",
  ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
