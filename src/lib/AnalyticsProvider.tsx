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
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const sectionSeenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!initializedRef.current) {
      initGA();
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) {
      trackPageView(pathname);
    }
  }, [pathname]);

  useEffect(() => {
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
  }, [pathname]);

  useEffect(() => {
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
  }, [pathname]);

  return <>{children}</>;
}
