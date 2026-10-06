const defaultSiteUrl = "https://blog.byted.online";
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/g, "");

const siteUrl = envSiteUrl || defaultSiteUrl;

export const localizedSiteConfig = {
  zh: {
    name: "杜旭嘉",
    role: "AI Agent / FDE 工程师（企业 AI 落地）",
    title: "杜旭嘉｜AI Agent / FDE 工程师作品集",
    description:
      "杜旭嘉的 AI Agent / FDE 工程师作品集：面向从小团队到大型企业的 AI 落地，覆盖传统行业流程智能化、RAG、Agent Runtime、业务系统接入与全栈交付，展示可复核的项目结果。",
    keywords: [
      "AI Agent 工程师",
      "FDE 工程师",
      "Forward Deployed Engineer",
      "企业 AI 落地",
      "企业 AI 赋能",
      "传统行业 AI",
      "流程智能化",
      "杜旭嘉",
      "AI 工程师作品集",
      "RAG",
      "Agent",
      "Agent Runtime",
      "FastAPI",
      "LangGraph",
      "Python",
      "Next.js",
      "智能体运行时",
      "检索增强生成",
      "Portfolio",
      "Resume",
    ],
  },
  en: {
    name: "Xujia Du",
    role: "AI Agent / FDE Engineer (Enterprise AI Delivery)",
    title: "Xujia Du | AI Agent / FDE Engineer Portfolio",
    description:
      "Xujia Du's AI Agent / Forward-Deployed Engineer portfolio: helping companies of every size move from AI pilots to production through traditional-industry workflow modernization, agent runtimes, RAG, and business-system integration.",
    keywords: [
      "Xujia Du",
      "AI Agent Engineer",
      "FDE Engineer",
      "Forward Deployed Engineer",
      "Enterprise AI delivery",
      "AI enablement",
      "Traditional industry AI",
      "AI engineer portfolio",
      "RAG",
      "Agent",
      "Agent Runtime",
      "FastAPI",
      "LangGraph",
      "Python",
      "Next.js",
      "Retrieval Augmented Generation",
      "Portfolio",
      "Resume",
    ],
  },
} as const;

export const siteConfig = {
  ...localizedSiteConfig.zh,
  siteName: "杜旭嘉｜AI Agent / FDE 工程师作品集",
  shortName: "作品小集",
  siteUrl,
  email: "2041487752dxj@gmail.com",
  icpRecord: "晋ICP备2026004157号-1",
  icpRecordUrl: "https://beian.miit.gov.cn/",
  ogImagePath: "/og.png",
} as const;

export type SiteConfig = typeof siteConfig;
