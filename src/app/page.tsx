import dynamic from "next/dynamic";
import ImmersiveBackdrop from "@/components/ImmersiveBackdrop";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Section } from "@/components/ui/Section";
import { defaultPortfolioData } from "@/data";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { CapabilitySummary } from "@/components/home/CapabilitySummary";
import { HomePageRuntimeShell } from "@/components/home/HomePageRuntimeShell";
import type { PortfolioData } from "@/types";
import {
  getHeroSpotlights,
  getHomepageFeaturedProjects,
} from "@/lib/home-highlights";

const Timeline = dynamic(
  () =>
    import("@/components/Timeline/TimelineNew").then((mod) => ({
      default: mod.Timeline,
    })),
  {
    loading: () => (
      <div className="space-y-6" aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <div key={item} className="theme-card h-32 rounded-[1.25rem]" />
        ))}
      </div>
    ),
  },
);

const HighlightDeck = dynamic(() => import("@/components/HighlightDeck"), {
  loading: () => (
    <div className="theme-card-muted h-[28rem] rounded-[1.25rem]" />
  ),
});

const ProjectList = dynamic(
  () => import("@/components/ProjectList").then((mod) => mod.ProjectList),
  {
    loading: () => (
      <div className="theme-card-muted h-[30rem] rounded-[1.25rem]" />
    ),
  },
);

const TechStack = dynamic(() => import("@/components/TechStack"), {
  loading: () => (
    <div className="theme-card-muted h-[32rem] rounded-[1.25rem]" />
  ),
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => (
    <div className="theme-card-muted h-[24rem] rounded-[1.25rem]" />
  ),
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => (
    <div className="theme-card-muted h-[24rem] rounded-[1.25rem]" />
  ),
});

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

function buildTechOverview(data: PortfolioData): Array<{
  id: string;
  label: string;
  items: string[];
}> {
  const tokens = collectConcreteTechTokens(data);

  const groups: Array<{
    id: string;
    label: string;
    candidates: Array<[string, string[]]>;
  }> = [
    {
      id: "backend",
      label: "后端运行时",
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
      label: "AI 接入",
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
      label: "数据存储",
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
      label: "前端与交付",
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

export default function HomePage() {
  const data = defaultPortfolioData;
  const timelineByDate = [...data.timeline].sort(
    (a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year),
  );

  const homepageFeaturedProjects = getHomepageFeaturedProjects(data.projects);
  const heroProofItems = getHeroSpotlights(data.projects);
  const techOverview = buildTechOverview(data);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="page-grid-bg page-grid-fade pointer-events-none absolute inset-0 z-0 opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-8rem] top-[12rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.22),transparent_72%)] blur-3xl" />
        <div className="absolute right-[-6rem] top-[36rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.24),transparent_74%)] blur-3xl" />
        <div className="absolute bottom-[12rem] left-[22%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.2),transparent_74%)] blur-3xl" />
      </div>

      <ImmersiveBackdrop />
      <HomePageRuntimeShell
        resumeOwnerName={data.hero.name}
        resumeOwnerTitle={data.hero.title}
      />
      <Navbar heroData={data.hero} contactData={data.contact} />
      <Hero data={data.hero} proofItems={heroProofItems} />

      <MotionWrapper delay={0.02} duration={0.5} amount={0.12}>
        <div
          id="impact"
          className="theme-grid-section relative z-10 scroll-mt-24 border-b section-divider"
        >
          <div className="section-grid-fade pointer-events-none absolute inset-0 opacity-70" />
          <HighlightDeck items={data.impact} timeline={timelineByDate} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.04} duration={0.52} amount={0.12}>
        <div className="theme-grid-section relative z-10">
          <FeaturedProjects items={homepageFeaturedProjects} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.06} duration={0.52} amount={0.12}>
        <div className="theme-grid-section relative z-10">
          <CapabilitySummary
            bullets={data.hero.bullets}
            skills={data.skills}
            services={data.services}
          />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.08} duration={0.54} amount={0.12}>
        <Section
          id="experience"
          className="theme-grid-section theme-section-dense relative z-10 scroll-mt-24 border-y section-divider !py-8 sm:!py-10 lg:!py-12"
        >
          <Container>
            <div
              className="theme-section-header scroll-mt-28 !mb-5 sm:!mb-6 lg:!mb-7"
              data-scroll-target="experience"
            >
              <p className="theme-kicker mb-2">履历时间线</p>
              <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
                专业履历与实践
              </h2>
              <p className="theme-section-copy">
                从后端架构优化、性能治理到智能应用集成，我的工作始终围绕复杂问题的系统化解决与业务价值交付展开。按时间线整理关键职责、代表结果与方法沉淀。
              </p>
            </div>
            <Timeline items={timelineByDate} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.1} duration={0.54} amount={0.12}>
        <Section
          id="projects"
          className="theme-grid-section-strong theme-section-balanced relative z-10 scroll-mt-24"
        >
          <Container>
            <div
              className="theme-section-header grid gap-6 scroll-mt-28 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-8"
              data-scroll-target="projects"
            >
              <div>
                <p className="theme-kicker mb-3">更多项目</p>
                <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
                  开源与更多探索
                </h2>
                <p className="theme-section-copy">
                  除了核心商业项目，我也持续在开源和个人项目中验证新思路。收录完整项目实践与实现细节。
                </p>
              </div>
              <div className="theme-card rounded-[1.35rem] p-4 sm:p-5">
                <p className="flex items-center gap-2 text-[13px] font-bold text-[color:var(--text-primary)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  </span>
                  阅读导航
                </p>
                <p className="theme-copy mt-2.5 text-[13px] leading-7">
                  项目默认按影响力排序，可按标签筛选技术栈、业务场景或交付类型。
                </p>
              </div>
            </div>
            <ProjectList items={data.projects} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.12} duration={0.56} amount={0.12}>
        <div
          id="skills"
          className="theme-grid-section relative z-10 scroll-mt-24"
        >
          <TechStack
            skills={data.skills}
            vibeCoding={data.vibeCoding}
            techOverview={techOverview}
          />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.14} duration={0.56} amount={0.12}>
        <div
          id="services"
          className="theme-grid-section relative z-10 scroll-mt-24"
        >
          <Services services={data.services} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.16} duration={0.58} amount={0.12}>
        <div
          id="contact"
          className="theme-grid-section relative z-10 scroll-mt-24 border-t section-divider"
        >
          <Contact contactData={data.contact} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.18} duration={0.58} amount={0.12}>
        <div className="relative z-10">
          <Footer
            name={data.hero.name}
            title={data.hero.title}
            availability={data.hero.location}
            email={data.contact.email}
            githubUrl={data.contact.github}
            websiteLinks={data.contact.websiteLinks}
          />
        </div>
      </MotionWrapper>
    </main>
  );
}
