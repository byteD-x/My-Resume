import type { ImpactItem, PortfolioData, ProjectItem, TimelineItem } from "@/types";
import {
  FEATURED_PROJECT_IDS,
  getHeroSpotlights,
  getHomepageFeaturedProjects,
  type HeroSpotlightItem,
  type HomepageFeaturedCard,
} from "@/lib/home-highlights";
import { getDefaultLocale, type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/locale-copy";
import { getPortfolioData } from "@/lib/portfolio-data";

interface TechOverviewGroup {
  id: string;
  label: string;
  items: string[];
}

interface EvidenceStripItem {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  href: string;
  actionLabel: string;
  meta: string;
}

export interface HomepageData {
  hero: PortfolioData["hero"];
  contact: PortfolioData["contact"];
  impact: ImpactItem[];
  skills: PortfolioData["skills"];
  services: PortfolioData["services"];
  homepageTimeline: TimelineItem[];
  impactTimeline: TimelineItem[];
  homepageProjects: ProjectItem[];
  homepageFeaturedProjects: HomepageFeaturedCard[];
  heroProofItems: HeroSpotlightItem[];
  techOverview: TechOverviewGroup[];
  evidenceStripItems: EvidenceStripItem[];
}

function extractTimelineSortKey(period: string): number {
  const match = period.match(/(\d{4})(?:\.(\d{1,2}))?/);
  if (!match) return Number.NEGATIVE_INFINITY;

  const year = Number(match[1]);
  const month = Number(match[2] ?? "1");
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return Number.NEGATIVE_INFINITY;
  }

  return year * 100 + Math.min(Math.max(month, 1), 12);
}

function normalizeTechTagKey(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, " ").trim();
}

function resolvePrimaryLinks(item: TimelineItem | ProjectItem) {
  const directLink = item.link?.trim() || undefined;
  const directDemoLink = item.demoLink?.trim() || undefined;
  const detailLinks = item.expandedDetails?.links ?? [];

  const githubLink =
    directLink ||
    detailLinks.find((link) => link.label.toLowerCase().includes("github"))?.url;
  const demoLink =
    directDemoLink ||
    detailLinks.find((link) => !link.label.toLowerCase().includes("github"))?.url;

  return {
    link: githubLink,
    demoLink,
  };
}

function createTimelineSummary(item: TimelineItem): TimelineItem {
  const { link, demoLink } = resolvePrimaryLinks(item);

  return {
    id: item.id,
    year: item.year,
    role: item.role,
    company: item.company,
    location: item.location,
    summary: item.summary,
    techTags: item.techTags,
    highlighted: item.highlighted,
    keyOutcomes: item.keyOutcomes?.slice(0, 3),
    link,
    demoLink,
    groupParentId: item.groupParentId,
    childIds: item.childIds,
    hideFromSection: item.hideFromSection,
    expandedDetails: undefined,
    bulletPoints: undefined,
  };
}

function createProjectSummary(item: ProjectItem): ProjectItem {
  const { link, demoLink } = resolvePrimaryLinks(item);

  return {
    id: item.id,
    year: item.year,
    name: item.name,
    summary: item.summary,
    techTags: item.techTags,
    highlighted: item.highlighted,
    impact: item.impact,
    keyOutcomes: item.keyOutcomes?.slice(0, 3),
    businessValue: item.businessValue,
    engineeringDepth: item.engineeringDepth,
    link,
    demoLink,
    groupParentId: item.groupParentId,
    childIds: item.childIds,
    hideFromSection: item.hideFromSection,
    expandedDetails: undefined,
  };
}

function createFeaturedProjectSummary(item: ProjectItem): ProjectItem {
  const { link, demoLink } = resolvePrimaryLinks(item);

  return {
    id: item.id,
    year: item.year,
    name: item.name,
    summary: item.summary,
    techTags: item.techTags,
    highlighted: item.highlighted,
    impact: item.impact,
    keyOutcomes: item.keyOutcomes?.slice(0, 2),
    businessValue: item.businessValue,
    engineeringDepth: item.engineeringDepth,
    link,
    demoLink,
    groupParentId: item.groupParentId,
    childIds: item.childIds,
    hideFromSection: item.hideFromSection,
    expandedDetails: undefined,
  };
}

function createImpactLinkedTimeline(item: TimelineItem): TimelineItem {
  const { link, demoLink } = resolvePrimaryLinks(item);

  return {
    id: item.id,
    year: item.year,
    role: item.role,
    company: item.company,
    location: item.location,
    summary: item.summary,
    techTags: item.techTags,
    highlighted: item.highlighted,
    link,
    demoLink,
    groupParentId: item.groupParentId,
    childIds: item.childIds,
    hideFromSection: item.hideFromSection,
    expandedDetails: item.expandedDetails
      ? {
          background: item.expandedDetails.background,
          solution: item.expandedDetails.solution,
          result: item.expandedDetails.result,
          techStack: item.expandedDetails.techStack,
          links: item.expandedDetails.links,
        }
      : undefined,
    bulletPoints: undefined,
  };
}

function collectConcreteTechTokens(data: PortfolioData): Set<string> {
  const buckets = [
    ...data.timeline.flatMap((item) => item.techTags ?? []),
    ...data.projects.flatMap((item) => item.techTags ?? []),
    ...data.projects.flatMap((item) => item.expandedDetails?.techStack ?? []),
    ...data.skills.flatMap((category) => category.items),
  ];

  const tokens = new Set<string>();

  for (const raw of buckets) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const noDetail = trimmed.replace(/\s*[（(][^（）()]+[）)]$/, "").trim();
    const parts = noDetail
      .split(/[\/、,，|]/)
      .map((part) => normalizeTechTagKey(part))
      .filter(Boolean);

    tokens.add(normalizeTechTagKey(noDetail));
    parts.forEach((part) => tokens.add(part));
  }

  return tokens;
}

function buildTechOverview(
  data: PortfolioData,
  locale: Locale,
): TechOverviewGroup[] {
  const tokens = collectConcreteTechTokens(data);

  const groups: Array<{
    id: string;
    label: string;
    candidates: Array<[string, string[]]>;
  }> = [
    {
      id: "backend",
      label: locale === "en" ? "Backend runtime" : "后端运行时",
      candidates: [
        ["Java", ["java"]],
        ["Spring Boot", ["spring boot"]],
        ["Spring Security", ["spring security"]],
        ["Python", ["python"]],
        ["FastAPI", ["fastapi"]],
        ["AsyncIO", ["asyncio"]],
        ["OAuth2", ["oauth2"]],
      ],
    },
    {
      id: "ai",
      label: locale === "en" ? "AI integration" : "AI 接入",
      candidates: [
        ["LangGraph", ["langgraph"]],
        ["OpenAI SDK", ["openai"]],
        ["Qdrant", ["qdrant"]],
        ["WebSocket", ["websocket"]],
        ["RTC", ["rtc"]],
      ],
    },
    {
      id: "data",
      label: locale === "en" ? "Data storage" : "数据存储",
      candidates: [
        ["PostgreSQL", ["postgresql"]],
        ["MySQL", ["mysql"]],
        ["Redis", ["redis"]],
        ["ClickHouse", ["clickhouse"]],
        ["MinIO", ["minio"]],
        ["Kafka", ["kafka"]],
        ["RabbitMQ", ["rabbitmq"]],
        ["Elasticsearch", ["elasticsearch"]],
      ],
    },
    {
      id: "delivery",
      label: locale === "en" ? "Frontend and delivery" : "前端与交付",
      candidates: [
        ["React", ["react"]],
        ["Next.js", ["next.js", "nextjs"]],
        ["TypeScript", ["typescript"]],
        ["Vue 3", ["vue 3"]],
        ["Docker Compose", ["docker compose"]],
        ["Playwright", ["playwright"]],
        ["pytest", ["pytest"]],
        ["Prometheus", ["prometheus"]],
        ["Grafana", ["grafana"]],
        ["Nginx", ["nginx"]],
      ],
    },
  ];

  return groups
    .map((group) => ({
      id: group.id,
      label: group.label,
      items: group.candidates
        .filter(([, aliases]) =>
          aliases.some((alias) =>
            Array.from(tokens).some((token) => token.includes(alias)),
          ),
        )
        .map(([label]) => label),
    }))
    .filter((group) => group.items.length > 0);
}

function buildEvidenceStripItems(
  data: PortfolioData,
  heroProofItems: HeroSpotlightItem[],
  locale: Locale,
): EvidenceStripItem[] {
  const copy = getUiCopy(locale);
  const impactItem = data.impact[0];
  const featuredItem = heroProofItems[0];
  const primarySkills = data.skills[0]?.items.slice(0, 3) ?? [];
  const primaryService = data.services[0];
  const primaryBullet = data.hero.bullets[0];

  return [
    {
      id: "impact-summary",
      kicker: copy.sections.impactKicker,
      title: impactItem
        ? `${impactItem.value} ${impactItem.label}`
        : locale === "en"
          ? "Traceable key metrics"
          : "关键指标可复核",
      summary:
        impactItem?.description ??
        (locale === "en"
          ? "Start with outcomes, then inspect the project breakdown and evidence notes."
          : "先看结果，再看完整项目拆解与证据口径。"),
      href: "#impact",
      actionLabel: locale === "en" ? "View all metrics" : "查看全部指标",
      meta: locale === "en" ? "30-second reviewer path" : "面试官 30 秒速读",
    },
    {
      id: "featured-proof",
      kicker: locale === "en" ? "Representative work" : "代表项目",
      title:
        featuredItem?.name ??
        (locale === "en" ? "Recent representative project" : "近期代表项目"),
      summary:
        featuredItem?.summary ??
        (locale === "en"
          ? "Start with the most recent cases that best represent current engineering capability."
          : "优先看最近、最能代表当前工程能力的案例拆解。"),
      href: featuredItem?.href ?? "#projects",
      actionLabel: copy.featured.detail,
      meta:
        featuredItem?.focus ??
        (locale === "en" ? "Engineering evidence first" : "工程证据优先"),
    },
    {
      id: "capability-summary",
      kicker: locale === "en" ? "Engineering capability" : "工程能力",
      title:
        primaryService?.title ??
        primaryBullet?.title ??
        (locale === "en" ? "End-to-end delivery" : "端到端交付"),
      summary:
        primaryBullet?.description ??
        primaryService?.description ??
        (locale === "en"
          ? "Focused on runtimes, retrieval augmentation, and real business-system integration."
          : "聚焦运行时、检索增强与真实业务系统集成。"),
      href: "#skills",
      actionLabel: locale === "en" ? "View capability structure" : "查看能力结构",
      meta:
        primarySkills.length > 0
          ? primarySkills.join(locale === "en" ? " / " : " 路 ")
          : locale === "en"
            ? "RAG / Agent / Full-stack"
            : "RAG 路 Agent 路 Full-stack",
    },
  ];
}

export function getHomepageData(
  locale: Locale = getDefaultLocale(),
): HomepageData {
  const data = getPortfolioData(locale);
  const homepageTimeline = [...data.timeline]
    .sort((a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year))
    .map(createTimelineSummary);
  const homepageProjects = data.projects.map(createProjectSummary);
  const featuredSourceProjects = FEATURED_PROJECT_IDS.map((id) =>
    data.projects.find((item) => item.id === id),
  ).filter((item): item is ProjectItem => Boolean(item)).map(createFeaturedProjectSummary);
  const heroProofItems = getHeroSpotlights(featuredSourceProjects, locale);
  const homepageFeaturedProjects = getHomepageFeaturedProjects(
    featuredSourceProjects,
    locale,
  );
  const techOverview = buildTechOverview(data, locale);
  const evidenceStripItems = buildEvidenceStripItems(
    data,
    heroProofItems,
    locale,
  );
  const linkedTimelineIds = new Set(
    data.impact
      .map((item) => item.linkedExperienceId)
      .filter((id): id is string => Boolean(id)),
  );
  const impactTimeline = [...data.timeline]
    .filter((item) => linkedTimelineIds.has(item.id))
    .sort((a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year))
    .map(createImpactLinkedTimeline);

  return {
    hero: data.hero,
    contact: data.contact,
    impact: data.impact,
    skills: data.skills,
    services: data.services,
    homepageTimeline,
    impactTimeline,
    homepageProjects,
    homepageFeaturedProjects,
    heroProofItems,
    techOverview,
    evidenceStripItems,
  };
}
