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
      "这是一个面向团队内部部署的企业级文件平台，不只是在做上传下载，而是把认证、分享、回收站、预览和运维入口一起纳入同一套产品能力。",
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
      "把 AI 客服做成能接业务系统、能转人工、能治理知识与扩展能力的运行时，而不是单点问答。",
    heroDetail: "重点看宿主挂载、权限桥接、多通道接入和治理能力如何统一。",
    contentSummary:
      "这是一个面向客服场景的运行时底座，定位不是单轮问答，而是让 AI 以文本、语音、RTC 和宿主挂载等多种形态接入真实业务系统。",
    capabilitySummary:
      "能力上覆盖宿主挂载、业务工具调用、Auth Bridge、低置信度澄清、转人工协同、知识版本/反馈治理与租户级插件扩展，重点解决可接业务、可持续治理的问题。",
    technicalSummary:
      "技术实现重点在分层运行时架构、插件注册与启停机制、`route_confidence + intent_stack` 决策链、Voice/RTC 链路、多租户边界控制以及 request_id / diagnostics / rate limit / redaction 治理能力。",
  },
  "proj-wechat-bot": {
    focus: "微信机器人 / 分层记忆 / 长期运行",
    heroSummary:
      "把微信机器人做成能长期运行的 AI 助手，兼顾消息接入、记忆增强、诊断观测和成本控制。",
    heroDetail: "重点看微信消息接入、LangGraph 编排、分层记忆和运行治理怎么配合。",
    contentSummary:
      "这是一个面向 Windows 微信生态的微信机器人项目，定位是长期运行的自动化 AI 助手，而不是一次性脚本或单纯的聊天机器人展示。",
    capabilitySummary:
      "能力层包括微信接入抽象、分层记忆、运行期 RAG、配置热重载、运行观测、成本分析与发布链路，目标是把日常使用、运维观察和交付管理收敛进同一套工具里。",
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
