import { ProjectItem } from "@/types";
import type { Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/locale-copy";

export interface HeroSpotlightItem {
  id: string;
  name: string;
  focus: string;
  summary: string;
  detail?: string;
  href?: string;
}

export interface HomepageProjectStorySection {
  id: string;
  title: string;
  body: string;
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
  storySections: HomepageProjectStorySection[];
}

export const FEATURED_PROJECT_IDS = [
  "proj-customer-ai-runtime",
  "proj-rag-qa-system",
  "proj-wechat-bot",
  "proj-cloudpan",
] as const;

const zhSpotlightCopy: Record<
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
      "功能覆盖多源资料接入、三路混合检索、答案引用溯源、人工澄清、知识治理工作台、检索调试和回归评测。",
    technicalSummary:
      "技术实现重点在三路召回、LangGraph 可恢复运行时、chunk 治理、`signal_scores / evidence_path` 可解释调试，以及 deterministic fixture 驱动的 smoke-eval / regression gate。",
  },
  "proj-customer-ai-runtime": {
    focus: "客服运行时 / 业务挂载 / 人工协同",
    heroSummary:
      "把客服能力做成可接业务系统、可转人工、可治理知识与扩展能力的运行时。",
    heroDetail: "重点看宿主挂载、权限桥接、多通道接入和治理能力如何统一。",
    contentSummary:
      "面向客服场景的运行时底座，支持文本、语音、RTC 与宿主挂载接入真实业务系统。",
    capabilitySummary:
      "覆盖宿主挂载、业务工具调用、Auth Bridge、低置信度澄清、转人工队列、知识版本治理、成本摘要与租户级插件扩展。",
    technicalSummary:
      "技术实现重点在分层运行时架构、插件注册与启停机制、`route_confidence + intent_stack` 决策链、Voice/RTC 链路、多租户边界控制，以及 cost summary / safe cache / RAG eval / handoff queue 治理能力。",
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

const enSpotlightCopy: typeof zhSpotlightCopy = {
  "proj-cloudpan": {
    focus: "File platform / access control / observable delivery",
    heroSummary:
      "A deployable file platform where upload, sharing, permissions, and monitoring can all be verified.",
    heroDetail: "Focus on the high-concurrency upload path, cache governance, and security boundaries.",
    contentSummary:
      "An enterprise file platform for private deployment, covering auth, sharing, recycle bin, preview, and operations.",
    capabilitySummary:
      "Supports chunked upload, instant upload, resumable upload, share transfer, tenant isolation, OAuth login, and monitoring.",
    technicalSummary:
      "The implementation connects upload state, zero-copy merge, PostgreSQL indexes, cursor pagination, Redis/Caffeine caching, replay-safe signatures, and observability.",
  },
  "proj-rag-qa-system": {
    focus: "Knowledge QA / content governance / recoverable runtime",
    heroSummary:
      "Turns scattered documents into a stable knowledge system with ingestion, traceable answers, and human correction paths.",
    heroDetail: "Focus on multi-source ingestion, answer evidence, and regression closure.",
    contentSummary:
      "Enterprise knowledge QA system covering multi-source documents, governance, and citation-backed answers.",
    capabilitySummary:
      "Covers ingestion, three-way hybrid retrieval, answer citations, clarification, knowledge governance, and evaluation.",
    technicalSummary:
      "The core is structured retrieval + full-text retrieval + vector retrieval, weighted RRF, reranking, LangGraph recovery, chunk governance, retrieve/debug, and regression gates.",
  },
  "proj-customer-ai-runtime": {
    focus: "Customer-service runtime / host mounting / human handoff",
    heroSummary:
      "Makes customer-service AI mountable into business systems with tools, handoff, knowledge governance, and extensions.",
    heroDetail: "Focus on host mounting, auth bridging, multi-channel access, and governance.",
    contentSummary:
      "A customer-service runtime for text, voice, RTC, and host-system integration.",
    capabilitySummary:
      "Covers host mounting, business tool calls, Auth Bridge, low-confidence clarification, human handoff, knowledge versions, and tenant plugins.",
    technicalSummary:
      "The implementation emphasizes layered runtime design, plugin lifecycle, route_confidence + intent_stack, voice/RTC flows, tenant boundaries, diagnostics, rate limits, and redaction.",
  },
  "proj-wechat-bot": {
    focus: "WeChat bot / layered memory / long-running assistant",
    heroSummary:
      "A long-running WeChat assistant that balances message access, memory, diagnostics, and cost control.",
    heroDetail: "Focus on WeChat access, LangGraph orchestration, memory, and runtime governance.",
    contentSummary:
      "A Windows WeChat assistant project for long-running auto-reply and runtime governance.",
    capabilitySummary:
      "Covers WeChat access abstraction, layered memory, runtime RAG, config hot reload, observability, cost analytics, and release flow.",
    technicalSummary:
      "The implementation centers on BaseTransport, LangGraph runtime, lightweight reranking, optional local Cross-Encoder fallback, config snapshots, and status/metrics/cost APIs.",
  },
};

function getSpotlightCopy(locale: Locale) {
  return locale === "en" ? enSpotlightCopy : zhSpotlightCopy;
}

function buildProjectStorySections(
  item: ProjectItem,
  locale: Locale,
  copy?: {
    contentSummary: string;
    capabilitySummary: string;
    technicalSummary: string;
  },
): HomepageProjectStorySection[] {
  const details = item.expandedDetails;
  const localeBusinessValue = item.businessValue?.[locale] ?? item.businessValue?.zh;
  const localeEngineeringDepth =
    item.engineeringDepth?.[locale] ?? item.engineeringDepth?.zh;
  const techStackLine =
    details?.techStack && details.techStack.length > 0
      ? locale === "en"
        ? `Tech stack: ${details.techStack.join(" / ")}`
        : `技术栈：${details.techStack.join(" / ")}`
      : "";
  const outcomeList =
    item.keyOutcomes && item.keyOutcomes.length > 0
      ? item.keyOutcomes.slice(0, 3).map((entry) => `- ${entry}`).join("\n")
      : "";

  const sections = [
    {
      id: "positioning",
      title: locale === "en" ? "Content focus" : "内容定位",
      body:
        [details?.background, details?.problem].filter(Boolean).join("\n\n") ||
        copy?.contentSummary ||
        item.summary,
    },
    {
      id: "capability",
      title: locale === "en" ? "Capability breakdown" : "功能描述",
      body:
        details?.solution ||
        outcomeList ||
        copy?.capabilitySummary ||
        localeBusinessValue ||
        item.summary,
    },
    {
      id: "technical",
      title: locale === "en" ? "Technical implementation" : "技术描述",
      body:
        [copy?.technicalSummary || localeEngineeringDepth, techStackLine]
          .filter(Boolean)
          .join("\n\n") || item.summary,
    },
    {
      id: "result",
      title: locale === "en" ? "Delivery result" : "交付结果",
      body:
        [details?.result, localeBusinessValue, outcomeList]
          .filter(Boolean)
          .join("\n\n") || item.impact || item.summary,
    },
  ];

  return sections.filter((section) => section.body.trim().length > 0);
}

export function getHomepageFeaturedProjects(
  projects: ProjectItem[],
  locale: Locale,
): HomepageFeaturedCard[] {
  const spotlightCopy = getSpotlightCopy(locale);
  const ui = getUiCopy(locale);

  return FEATURED_PROJECT_IDS.map((id) => projects.find((item) => item.id === id))
    .filter((item): item is ProjectItem => Boolean(item))
    .map((item) => {
      const copy = spotlightCopy[item.id as keyof typeof spotlightCopy];

      return {
        id: item.id,
        name: copy?.name ?? item.name,
        focus: copy?.focus ?? item.impact ?? ui.featured.fallbackFocus,
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
        storySections: buildProjectStorySections(item, locale, copy),
      };
    });
}

export function getHeroSpotlights(
  projects: ProjectItem[],
  locale: Locale,
): HeroSpotlightItem[] {
  const spotlightCopy = getSpotlightCopy(locale);
  const ui = getUiCopy(locale);

  return FEATURED_PROJECT_IDS.map((id) => projects.find((item) => item.id === id))
    .filter((item): item is ProjectItem => Boolean(item))
    .map((item) => {
      const copy = spotlightCopy[item.id as keyof typeof spotlightCopy];

      return {
        id: item.id,
        name: copy?.name ?? item.name,
        focus: copy?.focus ?? item.impact ?? ui.featured.fallbackRecent,
        summary: copy?.heroSummary ?? item.summary,
        detail: copy?.heroDetail ?? item.keyOutcomes?.[0],
        href: `/experiences/${item.id}`,
      };
    });
}
