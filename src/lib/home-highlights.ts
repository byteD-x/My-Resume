import { ProjectItem } from "@/types";

export interface HeroSpotlightItem {
  id: string;
  name: string;
  focus: string;
  summary: string;
  detail?: string;
  href?: string;
}

export const FEATURED_PROJECT_IDS = [
  "proj-customer-ai-runtime",
  "proj-rag-qa-system",
  "proj-wechat-bot",
  "proj-cloudpan",
] as const;

const spotlightCopy: Record<
  (typeof FEATURED_PROJECT_IDS)[number],
  {
    name?: string;
    summary: string;
    focus: string;
    cardSummary: string;
    decisionLine: string;
    executionLine: string;
  }
> = {
  "proj-cloudpan": {
    summary:
      "把上传、分享、权限和监控做成一套可部署的文件平台，高并发链路和安全基线都能复核。",
    focus: "文件平台 / 并发上传 / 安全基线",
    cardSummary:
      "把文件平台真正做完整，不只是上传下载，还把权限、安全和监控一起收住。",
    decisionLine: "重点看高并发上传链路、缓存治理和安全边界怎么落地。",
    executionLine: "我负责把上传主链路、性能优化和安全机制放进同一套可部署方案里。",
  },
  "proj-rag-qa-system": {
    summary:
      "把分散文档整理成能稳定回答的知识系统，重点放在资料接入、答案溯源和人工校正。",
    focus: "知识问答 / 可追溯回答 / 人工校正",
    cardSummary:
      "不是简单接模型，而是把资料整理、检索、回答和校验连成一条稳定链路。",
    decisionLine: "重点看多源资料接入、回答依据和回归验证怎么闭环。",
    executionLine: "我重点处理资料接入、回答依据展示和人工校正的完整流程。",
  },
  "proj-customer-ai-runtime": {
    summary:
      "把 AI 客服做成能接业务系统、能转人工、能持续扩展的运行时，而不是单点问答。",
    focus: "客服接入 / 业务挂载 / 人工协同",
    cardSummary:
      "把客服能力做成可接入业务系统的底座，兼顾接待、工具调用和人工接管。",
    decisionLine: "重点看宿主挂载、权限桥接和多通道接入如何统一。",
    executionLine: "我重点处理客服流程、业务工具接入和人工接管之间的衔接问题。",
  },
  "proj-wechat-bot": {
    name: "WeChat Chat",
    summary:
      "把微信自动回复做成带桌面管理端的长期运行工具，兼顾记忆、风格和成本控制。",
    focus: "微信自动化 / 桌面端 / 长期运行",
    cardSummary:
      "把微信自动回复从脚本做成可配置、可观察、可持续运行的完整工具。",
    decisionLine: "重点看异步消息链路、桌面管理端和长期记忆怎么配合。",
    executionLine: "我把消息处理、桌面管理和长期运行成本放在同一套方案里处理。",
  },
};

export function getHomepageFeaturedProjects(
  projects: ProjectItem[],
): ProjectItem[] {
  return FEATURED_PROJECT_IDS.map((id) => projects.find((item) => item.id === id))
    .filter((item): item is ProjectItem => Boolean(item))
    .map((item) => {
      const copy = spotlightCopy[item.id as keyof typeof spotlightCopy];
      if (!copy) return item;

      return {
        ...item,
        name: copy.name ?? item.name,
        summary: copy.cardSummary,
        keyOutcomes: [
          copy.decisionLine,
          copy.executionLine,
          ...(item.keyOutcomes?.slice(2) ?? []),
        ],
      };
    });
}

export function getHeroSpotlights(projects: ProjectItem[]): HeroSpotlightItem[] {
  return FEATURED_PROJECT_IDS.map((id) => projects.find((item) => item.id === id))
    .filter((item): item is ProjectItem => Boolean(item))
    .map((item) => {
      const copy = spotlightCopy[item.id as keyof typeof spotlightCopy];

      return {
        id: item.id,
        name: copy?.name ?? item.name,
        focus: copy?.focus ?? item.impact ?? "近期项目",
        summary: copy?.summary ?? item.summary,
        detail: copy?.decisionLine ?? item.keyOutcomes?.[0],
        href: `/experiences/${item.id}`,
      };
    });
}
