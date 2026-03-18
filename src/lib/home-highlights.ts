import { ProjectItem } from "@/types";

export interface HeroSpotlightItem {
  id: string;
  name: string;
  focus: string;
  summary: string;
  detail?: string;
  href?: string;
}

export interface HomepageFeaturedCard {
  id: string;
  name: string;
  focus: string;
  href: string;
  techTags: string[];
  contentSummary: string;
  capabilitySummary: string;
  technicalSummary: string;
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
    focus: string;
    heroSummary: string;
    heroDetail: string;
    contentSummary: string;
    capabilitySummary: string;
    technicalSummary: string;
  }
> = {
  "proj-cloudpan": {
    focus: "文件平台 / 权限治理 / 可观测交付",
    heroSummary:
      "把上传、分享、权限和监控做成一套可部署的文件平台，高并发链路和安全基线都能复核。",
    heroDetail: "重点看高并发上传链路、缓存治理和安全边界怎么落地。",
    contentSummary:
      "这是一个面向团队内部署的企业级文件平台，不只是做上传下载，而是把认证、分享、回收站、预览和运维入口一起纳入同一套产品内容。",
    capabilitySummary:
      "核心功能覆盖分片上传、秒传、断点续传、分享转存、多租户隔离、OAuth 登录和监控告警，目标是让文件协作真正具备可用的业务闭环。",
    technicalSummary:
      "技术实现重点放在上传主链路、零拷贝合并、PostgreSQL 索引与游标分页、Redis/Caffeine 多级缓存、签名防重放和可观测体系的整体配合。",
  },
  "proj-rag-qa-system": {
    focus: "知识问答 / 资料治理 / 可恢复运行时",
    heroSummary:
      "把分散文档整理成能稳定回答的知识系统，重点放在资料接入、答案溯源和人工校正。",
    heroDetail: "重点看多源资料接入、回答依据和回归验证怎么闭环。",
    contentSummary:
      "这是一个企业知识问答系统，核心内容不是聊天界面本身，而是把多源文档、知识库治理和答案引用依据组织成持续可维护的知识能力。",
    capabilitySummary:
      "功能层覆盖多源资料接入、三路混合检索、答案引用溯源、人工澄清、知识治理工作台和回归评测，确保知识问答不是一次性 demo。",
    technicalSummary:
      "技术实现重点在结构检索 + 全文检索 + 向量检索三路召回、LangGraph 可恢复运行时、chunk 治理、retrieve/debug 以及 smoke-eval / regression gate 的整条链路。",
  },
  "proj-customer-ai-runtime": {
    focus: "客服运行时 / 业务挂载 / 人工协同",
    heroSummary:
      "把 AI 客服做成能接业务系统、能转人工、能持续扩展的运行时，而不是单点问答。",
    heroDetail: "重点看宿主挂载、权限桥接和多通道接入如何统一。",
    contentSummary:
      "这是一个面向客服场景的运行时底座，内容定位不是单轮问答，而是让 AI 能以文本、语音和 RTC 多通道形态嵌入真实业务系统。",
    capabilitySummary:
      "功能上覆盖宿主挂载、业务工具调用、Auth Bridge、低置信度澄清、转人工协同和租户级插件扩展，重点解决可接业务、可持续扩展的问题。",
    technicalSummary:
      "技术实现重点在分层运行时架构、插件注册与启停机制、路由决策链、Voice/RTC 链路、多租户边界控制以及多提供商适配的统一抽象。",
  },
  "proj-wechat-bot": {
    focus: "微信自动化 / 桌面管理 / 长期运行",
    heroSummary:
      "把微信自动回复做成带桌面管理端的长期运行工具，兼顾记忆、风格和成本控制。",
    heroDetail: "重点看异步消息链路、桌面管理端和长期记忆怎么配合。",
    contentSummary:
      "这是一个面向微信场景的 AI 助手工具，内容定位是长期运行的自动化助手，而不是一次性脚本或单纯的聊天机器人展示。",
    capabilitySummary:
      "功能层包括自动回复、长期记忆、桌面管理端、日志观察和运行配置，目标是把日常使用、运维观察和成本控制放进同一套工具里。",
    technicalSummary:
      "技术实现重点在 Quart + asyncio 异步消息链路、RAG 记忆存储、Electron 管理端、Token 压缩与缓存策略之间的配合，而不是只列出技术栈名称。",
  },
};

export function getHomepageFeaturedProjects(
  projects: ProjectItem[],
): HomepageFeaturedCard[] {
  return FEATURED_PROJECT_IDS.map((id) => projects.find((item) => item.id === id))
    .filter((item): item is ProjectItem => Boolean(item))
    .map((item) => {
      const copy = spotlightCopy[item.id as keyof typeof spotlightCopy];

      return {
        id: item.id,
        name: copy?.name ?? item.name,
        focus: copy?.focus ?? item.impact ?? "重点项目",
        href: `/experiences/${item.id}`,
        techTags: item.techTags,
        contentSummary: copy?.contentSummary ?? item.summary,
        capabilitySummary:
          copy?.capabilitySummary ??
          item.businessValue?.zh ??
          item.keyOutcomes?.[0] ??
          item.summary,
        technicalSummary:
          copy?.technicalSummary ??
          item.engineeringDepth?.zh ??
          item.keyOutcomes?.[1] ??
          item.summary,
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
        summary: copy?.heroSummary ?? item.summary,
        detail: copy?.heroDetail ?? item.keyOutcomes?.[0],
        href: `/experiences/${item.id}`,
      };
    });
}
