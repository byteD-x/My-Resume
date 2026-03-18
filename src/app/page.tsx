import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
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

export default function HomePage() {
  const data = defaultPortfolioData;
  const timelineByDate = [...data.timeline].sort(
    (a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year),
  );

  const homepageFeaturedProjects = getHomepageFeaturedProjects(data.projects);
  const heroProofItems = getHeroSpotlights(data.projects);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="page-grid-bg page-grid-fade pointer-events-none absolute inset-0 z-0 opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-8rem] top-[12rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.22),transparent_72%)] blur-3xl" />
        <div className="absolute right-[-6rem] top-[36rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.24),transparent_74%)] blur-3xl" />
        <div className="absolute bottom-[12rem] left-[22%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.2),transparent_74%)] blur-3xl" />
      </div>

      <HomePageRuntime />
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
          className="theme-grid-section relative z-10 scroll-mt-24 border-y section-divider py-24 md:py-32"
        >
          <Container>
            <div
              className="mb-16 max-w-3xl scroll-mt-28"
              data-scroll-target="experience"
            >
              <p className="theme-kicker mb-3">Professional Journey</p>
              <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
                专业履历与实践
              </h2>
              <p className="theme-copy text-[15px] leading-relaxed">
                从底层架构优化到 AI 原生应用落地，我的工作始终围绕“复杂问题的系统化解决”与“真实业务价值的交付”展开。这里记录了我在不同阶段的核心贡献与技术沉淀。
              </p>
            </div>
            <Timeline items={timelineByDate} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.1} duration={0.54} amount={0.12}>
        <Section
          id="projects"
          className="theme-grid-section-strong relative z-10 scroll-mt-24 py-24 md:py-32"
        >
          <Container>
            <div
              className="mb-16 grid gap-8 scroll-mt-28 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end"
              data-scroll-target="projects"
            >
              <div className="max-w-3xl">
                <p className="theme-kicker mb-3">More Explorations</p>
                <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
                  开源与更多探索
                </h2>
                <p className="theme-copy text-[15px] leading-relaxed">
                  除了核心商业项目，我也在开源社区和业余时间持续探索。这里收录了我在不同技术栈和业务场景下的完整工程实践。
                </p>
              </div>
              <div className="theme-card rounded-[1.5rem] p-5">
                <p className="flex items-center gap-2 text-[13px] font-bold text-[color:var(--text-primary)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  </span>
                  阅读导航
                </p>
                <p className="theme-copy mt-2.5 text-[13px] leading-relaxed">
                  默认按项目影响力和技术深度排序。你可以通过下方标签快速筛选自己关心的技术栈或业务领域。
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
          <TechStack skills={data.skills} vibeCoding={data.vibeCoding} />
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
        <div className="theme-grid-section relative z-10">
          <Footer
            name={data.hero.name}
            githubUrl={data.contact.github}
            websiteLinks={data.contact.websiteLinks}
          />
        </div>
      </MotionWrapper>
    </main>
  );
}
