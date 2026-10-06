"use client";

import type { ReactNode } from "react";
import {
  m as motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollStoryMotionProps {
  children: ReactNode;
  className?: string;
  index?: number;
  total?: number;
}

/**
 * Adds a restrained scroll story to an existing content block. The content and
 * layout stay intact; only its depth and entrance respond to the page scroll.
 */
export function ScrollStoryMotion({
  children,
  className = "",
  index = 0,
  total = 1,
}: ScrollStoryMotionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const shouldAnimate = !prefersReducedMotion && !isLowPerformanceMode;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 94%", "end 12%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    mass: 0.45,
  });
  const direction = index % 2 === 0 ? 1 : -1;
  const entranceY = 18 + Math.min(index, total - 1) * 2;
  const x = useTransform(
    progress,
    [0, 0.45, 1],
    [direction * 10, 0, direction * -2],
  );
  const y = useTransform(progress, [0, 0.45, 1], [entranceY, 0, -2]);
  const opacity = useTransform(progress, [0, 0.28, 0.55, 1], [0.9, 0.97, 1, 1]);
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  if (!shouldAnimate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ opacity, transform }}>
      {children}
    </motion.div>
  );
}
