"use client";

import { m as motion, Variants, Transition } from "framer-motion";
import { ReactNode } from "react";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// 动画预设类型
type AnimationPreset =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur"
  | "slide-up"
  | "spring-up";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  preset?: AnimationPreset;
  duration?: number;
  once?: boolean;
  amount?: number;
  stagger?: number;
  /** 是否在减少动画模式下禁用动画 */
  disableOnReducedMotion?: boolean;
}

// 预定义的动画变体
const presetVariants: Record<AnimationPreset, Variants> = {
  "fade-up": {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -18 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -18 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  "slide-up": {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
  },
  "spring-up": {
    initial: { opacity: 0, y: 20, scale: 0.975 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
};

// 缓动曲线预设
const easePresets = {
  smooth: [0.16, 1, 0.3, 1] as const,
  spring: { type: "spring", stiffness: 180, damping: 22, mass: 0.9 } as const,
  bounce: { type: "spring", stiffness: 400, damping: 25 } as const,
};

export const MotionWrapper = ({
  children,
  className = "",
  delay = 0,
  preset = "fade-up",
  duration = 0.5,
  once = true,
  amount = 0.2,
  disableOnReducedMotion = true,
}: MotionWrapperProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const shouldAnimate =
    (!prefersReducedMotion || !disableOnReducedMotion) && !isLowPerformanceMode;

  const variants = presetVariants[preset];

  const transition: Transition = shouldAnimate
    ? preset === "spring-up"
      ? { ...easePresets.spring, delay }
      : { duration, delay, ease: easePresets.smooth }
    : { duration: 0 };

  // 禁用动画时，直接渲染子元素
  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount, margin: "-8% 0px -12% 0px" }}
      variants={variants}
      transition={transition}
      className={className}
      style={{
        willChange: shouldAnimate ? "transform, opacity" : "auto",
        transform: "translateZ(0)",
      }}
    >
      {children}
    </motion.div>
  );
};

// 容器组件，用于子元素交错动画
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const StaggerContainer = ({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  if (prefersReducedMotion || isLowPerformanceMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
    >
      {children}
    </motion.div>
  );
};

// 子元素动画组件
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  preset?: AnimationPreset;
}

export const StaggerItem = ({
  children,
  className = "",
  preset = "fade-up",
}: StaggerItemProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const variants = presetVariants[preset];

  if (prefersReducedMotion || isLowPerformanceMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.4, ease: easePresets.smooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
