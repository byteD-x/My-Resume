import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { defaultPortfolioData } from "@/data";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { CapabilitySummary } from "@/components/home/CapabilitySummary";
import { HomePageRuntime } from "@/components/home/HomePageRuntime";
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
          <div
            key={item}
            className="h-32 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
          />
        ))}
      </div>
    ),
  },
);

const HighlightDeck = dynamic(() => import("@/components/HighlightDeck"), {
  loading: () => (
    <div className="h-[28rem] rounded-lg bg-zinc-100 dark:bg-zinc-900/80" />
  ),
});

const ProjectList = dynamic(
  () => import("@/components/ProjectList").then((mod) => mod.ProjectList),
  {
    loading: () => (
      <div className="h-[30rem] rounded-lg bg-zinc-100 dark:bg-zinc-900/80" />
    ),
  },
);

const TechStack = dynamic(() => import("@/components/TechStack"), {
  loading: () => (
    <div className="h-[32rem] rounded-lg bg-zinc-100 dark:bg-zinc-900/80" />
  ),
});

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => (
    <div className="h-[24rem] rounded-lg bg-zinc-100 dark:bg-zinc-900/80" />
  ),
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => (
    <div className="h-[24rem] rounded-lg bg-zinc-100 dark:bg-zinc-900/80" />
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

export default function HomePage() {
  const data = defaultPortfolioData;
  const timelineByDate = [...data.timeline].sort(
    (a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year),
  );

  const homepageFeaturedProjects = getHomepageFeaturedProjects(data.projects);
  const heroProofItems = getHeroSpotlights(data.projects);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-white dark:bg-zinc-950">
      <HomePageRuntime />
      <Navbar heroData={data.hero} contactData={data.contact} />

      <Hero data={data.hero} proofItems={heroProofItems} />

      <div
        id="impact"
        className="relative scroll-mt-24 border-b border-zinc-200 dark:border-zinc-800"
      >
        <HighlightDeck items={data.impact} timeline={timelineByDate} />
      </div>

      <FeaturedProjects items={homepageFeaturedProjects} />

      <CapabilitySummary
        bullets={data.hero.bullets}
        skills={data.skills}
        services={data.services}
      />

      <Section
        id="experience"
        className="relative scroll-mt-24 border-y border-zinc-200 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-950 md:py-32"
      >
        <Container>
          <div
            className="mb-16 max-w-3xl scroll-mt-28"
            data-scroll-target="experience"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Professional Journey
            </p>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              专业履历与实践
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              从底层架构优化到 AI 原生应用落地，我的工作始终围绕“复杂问题的系统化解决”与“真实业务价值的交付”展开。这里记录了我在不同阶段的核心贡献与技术沉淀。
            </p>
          </div>
          <Timeline items={timelineByDate} />
        </Container>
      </Section>

      <Section
        id="projects"
        className="relative scroll-mt-24 bg-zinc-50 py-24 dark:bg-zinc-950/50 md:py-32"
      >
        <Container>
          <div
            className="mb-16 grid gap-8 scroll-mt-28 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end"
            data-scroll-target="projects"
          >
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                More Explorations
              </p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
                开源与更多探索
              </h2>
              <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                除了核心商业项目，我也在开源社区和业余时间持续探索。这里收录了我在不同技术栈和业务场景下的完整工程实践。
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="flex items-center gap-2 text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500" />
                </span>
                阅读导航
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                默认按项目影响力和技术深度排序。你可以通过下方标签快速筛选自己关心的技术栈或业务领域。
              </p>
            </div>
          </div>
          <ProjectList items={data.projects} />
        </Container>
      </Section>

      <div id="skills" className="relative scroll-mt-24">
        <TechStack skills={data.skills} vibeCoding={data.vibeCoding} />
      </div>

      <div id="services" className="relative scroll-mt-24">
        <Services services={data.services} />
      </div>

      <div
        id="contact"
        className="relative scroll-mt-24 border-t border-zinc-200 dark:border-zinc-800"
      >
        <Contact contactData={data.contact} />
      </div>

      <Footer name={data.hero.name} githubUrl={data.contact.github} />
    </main>
  );
}
