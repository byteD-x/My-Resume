// Site configuration - centralized constants for metadata and SEO
export const siteConfig = {
    name: "杜旭嘉",
    role: "后端工程师",
    siteUrl: "https://my-resume-gray-five.vercel.app",
    description: "后端工程师 · AI 工程化 · 全栈开发 | 专注高并发架构与 LLM 应用落地",
    email: "2041487752dxj@gmail.com",
    ogImagePath: "/og.png", // TODO: Add actual OG image to /public/og.png
} as const;

export type SiteConfig = typeof siteConfig;
