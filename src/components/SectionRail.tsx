"use client";

import { useEffect, useState } from "react";
import { m as motion, useMotionValue } from "framer-motion";
import { useScrollObserverState } from "@/lib/scroll-observer";
import { cn } from "@/lib/utils";

export interface SectionRailItem {
  id: string;
  label: string;
}

interface SectionRailProps {
  sections: SectionRailItem[];
}

const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
  window.history.replaceState(null, "", `#${id}`);
};

export default function SectionRail({ sections }: SectionRailProps) {
  const { y } = useScrollObserverState();
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id ?? "",
  );
  const railProgress = useMotionValue(0.02);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
      },
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex === -1) return;

    const currentEl = document.getElementById(activeSection);
    if (!currentEl) return;

    const startY = currentEl.offsetTop;
    const sectionHeight = currentEl.offsetHeight;

    // The IntersectionObserver triggers when a section is roughly 40% from the top
    // We align the rail's focal point to this offset.
    const readOffset = window.innerHeight * 0.4;
    const currentScroll = Math.max(0, y + readOffset - startY);

    let sectionProgress = 0;
    if (sectionHeight > 0) {
      sectionProgress = Math.min(Math.max(currentScroll / sectionHeight, 0), 1);
    }

    // Map progress to the equidistant dots format
    const totalSegments = Math.max(1, sections.length - 1);
    let interpolatedVal = (currentIndex + sectionProgress) / totalSegments;

    // Force exactly 0 at the very top of the page
    if (y <= 0) {
      interpolatedVal = 0;
    }

    // Force exactly 1 if we've hit the absolute bottom of the document
    // so the indicator doesn't get stuck before reaching the final dot
    const isAtBottom =
      window.innerHeight + y >= document.body.offsetHeight - 10;
    if (isAtBottom) {
      interpolatedVal = 1;
    }

    railProgress.set(Math.max(Math.min(Math.max(interpolatedVal, 0), 1), 0.02));
  }, [y, activeSection, sections, railProgress]);

  if (sections.length === 0) return null;

  return (
    <aside
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      aria-label="页面区块导航"
    >
      <div className="glass-light rounded-[1.25rem] px-3 py-4">
        <div className="relative flex flex-col items-center gap-3">
          <div className="absolute left-1/2 top-1 -z-10 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-[rgba(37,99,235,0.14)]" />
          <motion.div
            className="absolute left-1/2 top-1 -z-10 h-[calc(100%-0.5rem)] w-px origin-top -translate-x-1/2 bg-gradient-to-b from-blue-700 via-blue-500 to-cyan-300"
            style={{ scaleY: railProgress }}
          />

          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group relative flex min-h-9 items-center rounded-full pl-2 pr-3 transition-colors",
                  isActive
                    ? "bg-[rgba(255,255,255,0.98)] text-[color:var(--text-primary)] shadow-sm"
                    : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]",
                )}
                aria-current={isActive ? "location" : undefined}
                aria-label={`跳转到${section.label}`}
              >
                <span
                  className={cn(
                    "mr-2 h-2.5 w-2.5 shrink-0 rounded-full border transition-all",
                    isActive
                      ? "border-blue-500 bg-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.16)]"
                      : "border-[rgba(15,23,42,0.18)] bg-[rgba(255,255,255,0.94)] group-hover:border-[rgba(37,99,235,0.3)]",
                  )}
                />
                <span
                  className={cn(
                    "max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-300",
                    isActive
                      ? "max-w-28 opacity-100"
                      : "opacity-70 group-hover:max-w-28 group-hover:opacity-100",
                  )}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
