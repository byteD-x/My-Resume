"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import {
  m as motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getPreferredScrollBehavior } from "@/lib/section-scroll";

interface ScrollProgressBarProps {
  className?: string;
  variant?: "fixed" | "dock";
}

export function ScrollProgressBar({
  className,
  variant = "fixed",
}: ScrollProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const { scrollYProgress } = useScroll();
  const [progressValue, setProgressValue] = React.useState(0);
  const lastA11yValueRef = React.useRef(0);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  const glowY = useTransform(smoothProgress, [0, 1], ["100%", "0%"]);
  const labelY = useTransform(smoothProgress, [0, 1], ["48px", "-48px"]);
  const progressText = `${progressValue}%`;

  const scrollToTop = React.useCallback(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({
      top: 0,
      behavior: getPreferredScrollBehavior(),
    });
  }, []);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const nextValue = Math.round(latest * 100);
    const delta = Math.abs(nextValue - lastA11yValueRef.current);
    if (delta < 2 && nextValue !== 0 && nextValue !== 100) return;
    lastA11yValueRef.current = nextValue;
    setProgressValue((prev) => (prev === nextValue ? prev : nextValue));
  });

  if (prefersReducedMotion || isLowPerformanceMode) {
    return null;
  }

  if (variant === "dock") {
    return (
      <div
        className={cn(
          "theme-floating-trigger flex w-full items-center gap-3.5 rounded-[1.1rem] px-3.5 py-3 sm:gap-4 sm:rounded-[1.15rem] sm:px-4",
          className,
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">
                阅读进度
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
                {progressText}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="motion-chip pointer-events-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[rgba(var(--surface-rgb),0.92)] px-3.5 text-[12px] font-semibold text-[color:var(--text-primary)] transition hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--brand-gold)]"
              aria-label="回到顶部"
            >
              <ArrowUp size={12} />
              回到顶部
            </button>
          </div>
          <p className="theme-floating-meta mt-2">
            继续阅读前可快速返回首屏。
          </p>
        </div>

        <div
          className="relative h-16 w-2 overflow-hidden rounded-full border border-[rgba(37,99,235,0.14)] bg-[rgba(241,245,249,0.82)] shadow-sm"
          role="progressbar"
          aria-label="页面滚动进度"
          aria-valuenow={progressValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={progressText}
        >
          <motion.div
            className="absolute bottom-0 left-0 w-full origin-bottom rounded-full bg-gradient-to-t from-blue-700 via-blue-500 to-sky-300"
            style={{ scaleY, height: "100%" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400/70 blur-sm"
            style={{ y: glowY }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block",
        className,
      )}
      role="progressbar"
      aria-label="页面滚动进度"
      aria-valuenow={progressValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={progressText}
    >
      <div className="relative h-32 w-1.5 overflow-hidden rounded-full border border-[rgba(37,99,235,0.14)] bg-[rgba(241,245,249,0.82)] shadow-sm">
        <motion.div
          className="absolute bottom-0 left-0 w-full origin-bottom rounded-full bg-gradient-to-t from-blue-700 via-blue-500 to-sky-300"
          style={{ scaleY, height: "100%" }}
        />

        <motion.div
          className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400/70 blur-sm"
          style={{ y: glowY }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity hover:opacity-100"
        style={{ y: labelY }}
      >
        <motion.span className="rounded-full border border-[rgba(37,99,235,0.16)] bg-[rgba(255,255,255,0.94)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-secondary)] shadow-sm">
          {progressText}
        </motion.span>
      </motion.div>
    </div>
  );
}
