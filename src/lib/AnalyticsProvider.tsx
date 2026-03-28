"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  initGA,
  trackPageView,
  trackScrollDepth,
  trackSectionView,
} from "./analytics";
import {
  getScrollObserverSnapshot,
  subscribeScrollObserver,
} from "./scroll-observer";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analyticsConfigured = Boolean(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  );
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const pathnameRef = useRef(pathname);
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const sectionSeenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!analyticsConfigured || initializedRef.current) {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const bootstrap = async () => {
      await initGA();
      if (cancelled) return;
      initializedRef.current = true;
      trackPageView(pathnameRef.current);
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => {
        void bootstrap();
      });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = globalThis.setTimeout(() => {
      void bootstrap();
    }, 1200);

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [analyticsConfigured]);

  useEffect(() => {
    if (!analyticsConfigured || !initializedRef.current) {
      return;
    }

    trackPageView(pathname);
  }, [analyticsConfigured, pathname]);

  useEffect(() => {
    if (!analyticsConfigured) {
      return;
    }

    scrollMilestonesRef.current.clear();

    const trackMilestones = () => {
      if (!initializedRef.current) return;
      const scrollPercent = Math.round(
        getScrollObserverSnapshot().progress * 100,
      );
      [25, 50, 75, 100].forEach((milestone) => {
        if (
          scrollPercent < milestone ||
          scrollMilestonesRef.current.has(milestone)
        )
          return;
        scrollMilestonesRef.current.add(milestone);
        trackScrollDepth(milestone);
      });
    };

    trackMilestones();
    return subscribeScrollObserver(trackMilestones);
  }, [analyticsConfigured, pathname]);

  useEffect(() => {
    if (!analyticsConfigured) {
      return;
    }

    sectionSeenRef.current.clear();
    const sectionIds = [
      "impact",
      "experience",
      "projects",
      "skills",
      "contact",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionId = entry.target.id;
          if (!sectionId || sectionSeenRef.current.has(sectionId)) return;

          sectionSeenRef.current.add(sectionId);
          trackSectionView(sectionId);
        });
      },
      { threshold: 0.4 },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [analyticsConfigured, pathname]);

  return <>{children}</>;
}
