// Site configuration - centralized constants for metadata and SEO
const defaultSiteUrl = "https://my-resume-gray-five.vercel.app";
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/g, "");

export const siteConfig = {
  name: "杜旭嘉",
  role: "全栈工程师（工程效率方向）",
  siteUrl: envSiteUrl || defaultSiteUrl,
  description:
    "全栈工程师（工程效率方向）· AI 工程化 · 后端性能优化 | 专注可验证交付与业务价值落地",
  email: "2041487752dxj@gmail.com",
  ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
