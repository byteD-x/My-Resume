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
      {/* Track */}
      <div className="relative w-1.5 h-32 rounded-full bg-slate-200/50 dark:bg-slate-700/50 backdrop-blur-sm overflow-hidden">
        {/* Progress fill */}
        <motion.div
          className="absolute bottom-0 left-0 w-full origin-bottom rounded-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400"
          style={{ scaleY, height: "100%" }}
        />

        {/* Glow effect on progress */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500/50 blur-sm"
          style={{ y: glowY }}
        />
      </div>

      {/* Percentage indicator (optional - shows on hover) */}
      <motion.div
        className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{ y: labelY }}
      >
        <motion.span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
          {progressText}
        </motion.span>
      </motion.div>
    </div>
  );
}
