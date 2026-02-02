/**
 * 动画和交互配置常量
 * 集中管理所有动画相关的魔法数字，便于维护和调整
 */

// ==========================================
// 性能优化配置
// ==========================================

/** RAF 节流配置 */
export const RAF_CONFIG = {
  /** 默认动画帧率限制 */
  FPS: 60,
  /** 帧间隔 (ms) */
  FRAME_INTERVAL: 1000 / 60,
} as const;

/** 移动端检测配置 */
export const MOBILE_CONFIG = {
  /** 移动端断点 (px) */
  BREAKPOINT: 768,
} as const;

/** 检测是否为触控设备 (需在客户端调用) */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window;
};

// ==========================================
// 光标光晕配置 (CursorGlow)
// ==========================================

export const CURSOR_GLOW_CONFIG = {
  /** 默认光斑大小 (px) */
  SIZE: 300,
  /** 默认光斑颜色 */
  COLOR_LIGHT: 'rgba(59, 130, 246, 0.15)',
  COLOR_DARK: 'rgba(99, 102, 241, 0.2)',
  /** 暗色模式增大尺寸 */
  SIZE_DARK: 350,
  SIZE_LIGHT: 250,
  /** 混合模式 */
  BLEND_MODE: 'normal',
} as const;

// ==========================================
// 磁性按钮配置 (MagneticButton)
// ==========================================

export const MAGNETIC_CONFIG = {
  /** 默认磁性强度 (0-1) */
  STRENGTH: 0.3,
  /** 默认触发半径 (px) */
  RADIUS: 100,
  /** 动画弹簧配置 */
  SPRING: {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  },
} as const;

// ==========================================
// 3D 倾斜配置 (use3DTilt)
// ==========================================

export const TILT_CONFIG = {
  /** 最大倾斜角度 (度) */
  MAX_TILT: 10,
  /** 透视距离 (px) */
  PERSPECTIVE: 1000,
  /** 悬停放大比例 */
  SCALE: 1.02,
  /** 动画速度 (ms) */
  SPEED: 400,
  /** 光泽配置 */
  GLARE: {
    enabled: true,
    opacity: 0.2,
    defaultPosition: 50,
  },
  /** 缓动曲线 */
  EASING: 'cubic-bezier(0.03, 0.98, 0.52, 0.99)',
} as const;

// ==========================================
// 动画时间配置
// ==========================================

export const ANIMATION_DURATION = {
  /** 快速动画 (ms) */
  FAST: 150,
  /** 正常动画 (ms) */
  NORMAL: 250,
  /** 慢速动画 (ms) */
  SLOW: 400,
  /** 更慢动画 (ms) */
  SLOWER: 600,
} as const;

/** 交错动画延迟 (ms) */
export const STAGGER_DELAY = 50;

// ==========================================
// 缓动曲线配置
// ==========================================

export const EASING_CURVES = {
  /** 指数缓出 - 自然流畅 */
  OUT_EXPO: [0.16, 1, 0.3, 1] as const,
  /** 弹性缓出 - 有回弹效果 */
  OUT_BACK: [0.34, 1.56, 0.64, 1] as const,
  /** 平滑缓入缓出 */
  IN_OUT_SMOOTH: [0.4, 0, 0.2, 1] as const,
  /** 弹簧效果 */
  SPRING: [0.175, 0.885, 0.32, 1.275] as const,
} as const;

// ==========================================
// Hero 区域动画配置
// ==========================================

export const HERO_ANIMATION = {
  /** 背景装饰动画 */
  BACKGROUND: {
    duration: 8,
    repeat: Infinity,
    ease: 'easeInOut',
  },
  /** 第二个背景装饰延迟 */
  BACKGROUND_DELAY: 1,
  /** 第二个背景装饰时长 */
  BACKGROUND_DURATION_2: 10,
  /** 淡入动画 */
  FADE_IN: {
    duration: 0.6,
    ease: EASING_CURVES.OUT_EXPO,
  },
  /** 内容入场延迟基数 (s) */
  DELAY_BASE: 0.1,
  /** 状态徽章延迟 (s) */
  DELAY_BADGES: 0,
  /** 标题延迟 (s) */
  DELAY_TITLE: 0.1,
  /** 价值主张延迟 (s) */
  DELAY_PROPOSITION: 0.15,
  /** 要点延迟 (s) */
  DELAY_BULLETS: 0.2,
  /** CTA 延迟 (s) */
  DELAY_CTA: 0.3,
  /** 右侧卡片延迟 (s) */
  DELAY_CARD: 0.4,
  /** 滚动提示延迟 (s) */
  DELAY_SCROLL: 0.8,
} as const;

// ==========================================
// 无限滚动配置 (InfiniteScroll)
// ==========================================

export const INFINITE_SCROLL = {
  /** 快速滚动时长 (s) */
  SPEED_FAST: 20,
  /** 正常滚动时长 (s) */
  SPEED_NORMAL: 40,
  /** 慢速滚动时长 (s) */
  SPEED_SLOW: 80,
} as const;

// ==========================================
// 页面滚动配置
// ==========================================

export const SCROLL_CONFIG = {
  /** 导航栏显示阈值 (px) */
  NAVBAR_THRESHOLD: 50,
  /** 平滑滚动偏移 (px) */
  SCROLL_OFFSET: 100,
} as const;
