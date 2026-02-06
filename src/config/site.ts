// Site configuration - centralized constants for metadata and SEO
const defaultSiteUrl = 'https://my-resume-gray-five.vercel.app';
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/g, '');

export const siteConfig = {
    name: "杜旭嘉",
    role: "后端工程师",
    siteUrl: envSiteUrl || defaultSiteUrl,
    description: "后端工程师 · AI 工程化 · 全栈开发 | 专注高并发架构与 LLM 应用落地",
    email: "2041487752dxj@gmail.com",
    ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
