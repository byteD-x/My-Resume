// 检测是否应该禁用无限动画 (用于静态导出)
const shouldDisableInfiniteAnimations = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// 创建动态变体的工厂函数
export const createInfiniteVariant = (
  keyframes: number[],
  duration: number,
  property: "y" | "opacity" | "scale",
) => {
  return (() => {
    if (shouldDisableInfiniteAnimations()) {
      return {
        initial: { [property]: keyframes[0] },
        animate: { [property]: keyframes[0] },
      };
    }
    return {
      initial: { [property]: keyframes[0] },
      animate: {
        [property]: keyframes,
        transition: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    };
  })();
};

export const transitions = {
  spring: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
  smooth: {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.6,
  },
};

export const variants = {
  // Stagger Container
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Standard Fade Up
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.spring,
    },
  },

  // Scale In (for cards/images)
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: transitions.spring,
    },
  },

  // Slide In from Left/Right (Timeline)
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.smooth,
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.smooth,
    },
  },

  // Aurora Float Effect - 尊重 prefers-reduced-motion
  float: {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },

  // Pulse Glow - 尊重 prefers-reduced-motion
  glow: {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
};

export const numberCount = (from: number, to: number) => ({
  from,
  to,
  transition: { duration: 2, ease: "easeOut" },
});

// 安全的 hover 变体 - 接受条件参数
export const safeCardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  whileTap: { scale: 0.98 },
};
