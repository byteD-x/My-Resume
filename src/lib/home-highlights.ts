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
      "面向团队内部部署的企业级文件平台，覆盖认证、分享、回收站、预览和运维入口。",
    capabilitySummary:
      "核心功能覆盖分片上传、秒传、断点续传、分享转存、多租户隔离、OAuth 登录和监控告警。",
    technicalSummary:
      "技术实现重点放在上传主链路、零拷贝合并、PostgreSQL 索引与游标分页、Redis/Caffeine 多级缓存、签名防重放和可观测体系的整体配合。",
  },
  "proj-rag-qa-system": {
    focus: "知识问答 / 资料治理 / 可恢复运行时",
    heroSummary:
      "把分散文档整理成能稳定回答的知识系统，重点放在资料接入、答案溯源和人工校正。",
    heroDetail: "重点看多源资料接入、回答依据和回归验证怎么闭环。",
    contentSummary:
      "企业知识问答系统，覆盖多源文档接入、知识治理与答案引用依据。",
    capabilitySummary:
      "功能覆盖多源资料接入、三路混合检索、答案引用溯源、人工澄清、知识治理工作台和回归评测。",
    technicalSummary:
      "技术实现重点在结构检索 + 全文检索 + 向量检索三路召回、LangGraph 可恢复运行时、chunk 治理、retrieve/debug 以及 smoke-eval / regression gate 的整条链路。",
  },
  "proj-customer-ai-runtime": {
    focus: "客服运行时 / 业务挂载 / 人工协同",
    heroSummary:
      "把客服能力做成可接业务系统、可转人工、可治理知识与扩展能力的运行时。",
    heroDetail: "重点看宿主挂载、权限桥接、多通道接入和治理能力如何统一。",
    contentSummary:
      "面向客服场景的运行时底座，支持文本、语音、RTC 与宿主挂载接入真实业务系统。",
    capabilitySummary:
      "覆盖宿主挂载、业务工具调用、Auth Bridge、低置信度澄清、转人工协同、知识版本治理与租户级插件扩展。",
    technicalSummary:
      "技术实现重点在分层运行时架构、插件注册与启停机制、`route_confidence + intent_stack` 决策链、Voice/RTC 链路、多租户边界控制以及 request_id / diagnostics / rate limit / redaction 治理能力。",
  },
  "proj-wechat-bot": {
    focus: "微信机器人 / 分层记忆 / 长期运行",
    heroSummary:
      "把微信机器人做成能长期运行的智能助手，兼顾消息接入、记忆增强、诊断观测和成本控制。",
    heroDetail: "重点看微信消息接入、LangGraph 编排、分层记忆和运行治理怎么配合。",
    contentSummary:
      "面向 Windows 微信生态的微信机器人项目，支持长期运行、自动回复与运行治理。",
    capabilitySummary:
      "覆盖微信接入抽象、分层记忆、运行期 RAG、配置热重载、运行观测、成本分析与发布链路。",
    technicalSummary:
      "技术实现重点在 `BaseTransport` 接入边界、`LangGraph` 运行时、轻量重排与可选本地 Cross-Encoder 回退、配置快照/热重载以及 `/api/status`、`/api/metrics`、成本接口的协同。",
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
