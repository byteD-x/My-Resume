"use client";

import React from "react";
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

interface ScrollProgressBarProps {
  className?: string;
}

/**
 * Vertical scroll progress bar displayed on the right side of the viewport.
 * Shows the current scroll depth as a gradient-filled bar.
 */
export function ScrollProgressBar({ className }: ScrollProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const { scrollYProgress } = useScroll();
  const [progressValue, setProgressValue] = React.useState(0);
  const lastA11yValueRef = React.useRef(0);

  // Smooth spring animation for natural feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Transform progress to scaleY (0 to 1)
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  const glowY = useTransform(smoothProgress, [0, 1], ["100%", "0%"]);
  const labelY = useTransform(smoothProgress, [0, 1], ["48px", "-48px"]);
  const progressText = `${progressValue}%`;

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
        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{ y: labelY }}
      >
        <motion.span className="rounded-full border border-[rgba(37,99,235,0.16)] bg-[rgba(255,255,255,0.94)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-secondary)] shadow-sm">
          {progressText}
        </motion.span>
      </motion.div>
    </div>
  );
}
