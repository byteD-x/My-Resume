"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SECTION_REQUEST_EVENT,
  getRequestedSectionId,
  scrollToSection,
} from "@/lib/section-scroll";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useUiCopy } from "@/lib/LocaleProvider";

const HomeDeferredSectionsBody = dynamic(
  () =>
    import("@/components/home/HomeDeferredSectionsBody").then((mod) => ({
      default: mod.HomeDeferredSectionsBody,
    })),
  {
    ssr: false,
    loading: () => <DeferredSectionsSkeleton />,
  },
);

const PRELOAD_ROOT_MARGIN = "420px 0px";
const REALIGN_MAX_ATTEMPTS = 180;
const REALIGN_MIN_ATTEMPTS = 60;
const REALIGN_STABLE_ATTEMPTS = 8;
const REALIGN_INTERVAL_MS = 50;

function SkeletonCard({
  className,
  heightClassName,
}: {
  className?: string;
  heightClassName: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`theme-card-muted rounded-[1.25rem] ${heightClassName} ${className ?? ""}`.trim()}
    />
  );
}

function DeferredSectionsSkeleton() {
  const copy = useUiCopy();

  return (
    <>
      <Section
        id="experience"
        className="theme-grid-section theme-section-dense relative z-10 scroll-mt-24 border-b section-divider !py-8 sm:!py-10 lg:!py-12"
      >
        <Container>
          <div
            className="theme-section-header experience-section-header scroll-mt-28 !mb-5 sm:!mb-6 lg:!mb-7"
            data-scroll-target="experience"
          >
            <p className="theme-kicker mb-2">{copy.sections.experienceKicker}</p>
            <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
              {copy.sections.experienceTitle}
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-5">
            {[0, 1, 2].map((item) => (
              <SkeletonCard
                key={item}
                heightClassName="h-28 sm:h-32"
                className="w-full"
              />
            ))}
          </div>
        </Container>
      </Section>

      <div
        id="impact"
        className="theme-grid-section defer-section-render relative z-10 scroll-mt-24 border-b section-divider"
      >
        <div className="section-grid-fade pointer-events-none absolute inset-0 opacity-70" />
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <SkeletonCard heightClassName="h-[24rem] sm:h-[26rem]" />
        </div>
      </div>
    </>
  );
}

export function HomeDeferredSectionsShell() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestedSectionRef = useRef<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  const queueSectionRequest = useCallback((sectionId: string) => {
    requestedSectionRef.current = sectionId;
    setRequestVersion((version) => version + 1);
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let initialSyncFrame: number | null = null;
    const pendingSectionId = getRequestedSectionId();
    if (pendingSectionId) {
      initialSyncFrame = window.requestAnimationFrame(() => {
        queueSectionRequest(pendingSectionId);
      });
    }

    const handleSectionRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      const sectionId = detail?.id?.trim();
      if (!sectionId) return;
      queueSectionRequest(sectionId);
    };

    window.addEventListener(SECTION_REQUEST_EVENT, handleSectionRequest);
    return () => {
      if (initialSyncFrame !== null) {
        window.cancelAnimationFrame(initialSyncFrame);
      }
      window.removeEventListener(SECTION_REQUEST_EVENT, handleSectionRequest);
    };
  }, [queueSectionRequest]);

  useEffect(() => {
    if (shouldLoad || typeof window === "undefined") return;

    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const activate = () => {
      const pendingSectionId = getRequestedSectionId();
      if (pendingSectionId) {
        requestedSectionRef.current = pendingSectionId;
        setRequestVersion((version) => version + 1);
      }
      setShouldLoad(true);
    };

    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            activate();
          }
        },
        { rootMargin: PRELOAD_ROOT_MARGIN },
      );
    }

    if (containerRef.current && observer) {
      observer.observe(containerRef.current);
    }

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(activate, {
        timeout: 1800,
      }) as unknown as number;
    } else {
      timeoutId = window.setTimeout(activate, 1400);
    }

    return () => {
      observer?.disconnect();
      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || typeof window === "undefined") return;

    const sectionId = requestedSectionRef.current;
    if (!sectionId) return;

    let attempt = 0;
    let stableInViewCount = 0;
    let timeoutId: number | null = null;

    const realign = () => {
      const aligned = scrollToSection(sectionId, {
        behavior: "auto",
        emitRequest: false,
        updateHash: false,
      });

      const targetTop =
        document
          .getElementById(sectionId)
          ?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const isInView =
        Number.isFinite(targetTop) &&
        targetTop >= 0 &&
        targetTop <= window.innerHeight * 0.72;

      attempt += 1;
      stableInViewCount = isInView ? stableInViewCount + 1 : 0;
      const shouldContinue =
        attempt < REALIGN_MAX_ATTEMPTS &&
        (!aligned ||
          attempt < REALIGN_MIN_ATTEMPTS ||
          stableInViewCount < REALIGN_STABLE_ATTEMPTS);

      if (shouldContinue) {
        timeoutId = window.setTimeout(realign, REALIGN_INTERVAL_MS);
      }
    };

    realign();
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [shouldLoad, requestVersion]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <HomeDeferredSectionsBody /> : <DeferredSectionsSkeleton />}
    </div>
  );
}
