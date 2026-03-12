"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { defaultPortfolioData } from "@/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImmersiveBackdrop from "@/components/ImmersiveBackdrop";
import SectionRail from "@/components/SectionRail";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import Footer from "@/components/Footer";
import FloatingResumeButton from "@/components/FloatingResumeButton";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { clearScrollRestore, readScrollRestore } from "@/lib/scroll-restore";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { scheduleDeferredTask } from "@/lib/visual-shock/utils/defer";
import { getHeroSpotlights } from "@/lib/home-highlights";

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => (
    <div
      className="h-96 rounded-2xl bg-slate-50 animate-pulse"
      aria-hidden="true"
    />
  ),
});

const ProjectList = dynamic(
  () => import("@/components/ProjectList").then((mod) => mod.ProjectList),
  {
    loading: () => (
      <div
        className="h-96 rounded-2xl bg-slate-50 animate-pulse"
        aria-hidden="true"
      />
    ),
  },
);

const TechStack = dynamic(() => import("@/components/TechStack"), {
  loading: () => (
    <div
      className="h-96 rounded-2xl bg-slate-900 animate-pulse"
      aria-hidden="true"
    />
  ),
});

const Timeline = dynamic(
  () =>
    import("@/components/Timeline/TimelineNew").then((mod) => ({
      default: mod.Timeline,
    })),
  {
    ssr: true,
    loading: () => (
      <div
        className="space-y-6 animate-pulse"
        role="status"
        aria-label="加载中"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-100 to-slate-50"
            style={{ animationDelay: `${i * 100}ms` }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">正在加载职业履历...</span>
      </div>
    ),
  },
);

const HighlightDeck = dynamic(() => import("@/components/HighlightDeck"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-50/50" />,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-50/50" />,
});

const EngineeringCommandCenter = dynamic(
  () => import("@/components/EngineeringCommandCenter"),
  {
    ssr: false,
    loading: () => null,
  },
);

const VisualShock = dynamic(() => import("@/components/VisualShock"), {
  ssr: false,
  loading: () => <ImmersiveBackdrop />,
});

const SECTION_RAIL_ITEMS = [
  { id: "impact", label: "影响力" },
  { id: "experience", label: "履历" },
  { id: "projects", label: "项目" },
  { id: "services", label: "服务" },
  { id: "skills", label: "技能" },
  { id: "contact", label: "联系" },
];

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

export default function HomePageClient() {
  const data = defaultPortfolioData;
  const isLowPerformanceMode = useLowPerformanceMode();
  const [shouldMountVisualShock, setShouldMountVisualShock] = useState(false);
  const heroProofItems = useMemo(() => {
    return getHeroSpotlights(data.projects);
  }, [data.projects]);
  const timelineByDate = useMemo(() => {
    return [...data.timeline].sort(
      (a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year),
    );
  }, [data.timeline]);

  useEffect(() => {
    const state = readScrollRestore();
    if (!state || typeof window === "undefined") return;

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (state.path && state.path !== currentPath) return;

    const restoreScroll = () => {
      if (typeof state.y === "number" && Number.isFinite(state.y)) {
        window.scrollTo({ top: state.y, behavior: "smooth" });
      } else if (state.section) {
        const target = document.getElementById(state.section);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      clearScrollRestore();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });
  }, []);

  useEffect(() => {
    const cancel = scheduleDeferredTask(() => {
      void import("@/components/Services");
      void import("@/components/ProjectList");
      void import("@/components/TechStack");
      void import("@/components/Timeline/TimelineNew");
      void import("@/components/HighlightDeck");
      void import("@/components/Contact");
    });

    return cancel;
  }, []);

  useEffect(() => {
    // Delay mounting VisualShock heavy WebGL payload until browser is idle
    // to ensure LCP and initial scrolling are buttery smooth.
    let timer: ReturnType<typeof setTimeout>;
    let idleHandle: number;

    const mount = () => {
      timer = setTimeout(() => {
        setShouldMountVisualShock(true);
      }, 500); // reduced further delay since idle already waited
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(mount, { timeout: 2500 });
    } else {
      timer = setTimeout(() => setShouldMountVisualShock(true), 1200);
    }

    return () => {
      clearTimeout(timer);
      if (
        typeof window !== "undefined" &&
        "requestIdleCallback" in window &&
        idleHandle
      ) {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-50/30">
      {shouldMountVisualShock ? <VisualShock /> : <ImmersiveBackdrop />}
      <Navbar heroData={data.hero} contactData={data.contact} />
      {!isLowPerformanceMode && <ScrollProgressBar />}
      <SectionRail sections={SECTION_RAIL_ITEMS} />

      <Hero
        data={data.hero}
        proofItems={heroProofItems}
      />

      <MotionWrapper delay={0.1}>
        <Section
          id="impact"
          className="relative py-20 md:py-32 scroll-mt-24"
          data-vs-reveal
          data-vs-reveal-order={0}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-200/15 via-transparent to-transparent"
          />
          <Container>
            <HighlightDeck items={data.impact} timeline={timelineByDate} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <Section
          id="experience"
          className="relative py-20 md:py-32 scroll-mt-24 bg-white/55 backdrop-blur-md"
          data-vs-reveal
          data-vs-reveal-order={1}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 right-0 -z-10 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"
          />
          <Container>
            <div className="mb-16">
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                职业履历
              </h2>
              <p className="max-w-2xl text-lg text-slate-600">
                优先展示 5
                段核心经历，其余经历作为补充背景，便于快速判断岗位匹配度。
              </p>
            </div>
            <Timeline items={timelineByDate} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <Section
          id="projects"
          className="relative py-20 md:py-32 scroll-mt-24 bg-gradient-to-b from-slate-50/70 via-white/55 to-slate-100/45"
          data-vs-reveal
          data-vs-reveal-order={2}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
          />
          <Container>
            <div className="mb-12">
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                项目经历
              </h2>
              <p className="max-w-2xl text-lg text-slate-600">
                个人开源项目 / 创业项目 / 实验性产品。
              </p>
            </div>
            <ProjectList items={data.projects} />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <div
          id="services"
          className="scroll-mt-24 content-auto py-20 md:py-32"
          style={{ containIntrinsicSize: "auto 600px" }}
          data-vs-reveal
          data-vs-reveal-order={3}
        >
          <Services services={data.services} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <div
          id="skills"
          className="scroll-mt-24 content-auto py-20 md:py-32"
          style={{ containIntrinsicSize: "auto 800px" }}
          data-vs-reveal
          data-vs-reveal-order={4}
        >
          <TechStack skills={data.skills} vibeCoding={data.vibeCoding} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <div
          id="contact"
          className="scroll-mt-24 content-auto py-20 md:py-32"
          style={{ containIntrinsicSize: "auto 400px" }}
          data-vs-reveal
          data-vs-reveal-order={5}
        >
          <Contact contactData={data.contact} />
        </div>
      </MotionWrapper>

      <EngineeringCommandCenter />
      <FloatingResumeButton />

      <Footer name={data.hero.name} githubUrl={data.contact.github} />
    </main>
  );
}
