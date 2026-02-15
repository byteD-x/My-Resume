'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { m as motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLowPerformanceMode } from '@/hooks/useLowPerformanceMode';

// 默认配置常量
const DEFAULT_SIZE = 300;
const DEFAULT_COLOR = 'rgba(59, 130, 246, 0.15)';
const MOBILE_BREAKPOINT = 768;

interface CursorGlowProps {
    size?: number;           // 光斑大小
    color?: string;          // 光斑颜色
    blendMode?: string;      // 混合模式
    enabled?: boolean;       // 是否启用
    hideOnMobile?: boolean;  // 移动端隐藏
}

export function CursorGlow({
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    blendMode = 'normal',
    enabled = true,
    hideOnMobile = true,
}: CursorGlowProps) {
    // 使用 useMotionValue 替代 useState，避免因为坐标变化导致组件重渲染
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 平滑弹簧动画配置
    const springConfig = { damping: 30, stiffness: 400, mass: 0.8 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // 将坐标转换为 transform 能够直接使用的值 (居中)
    const x = useTransform(springX, (value) => value - size / 2);
    const y = useTransform(springY, (value) => value - size / 2);

    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isPageHidden, setIsPageHidden] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const isLowPerformanceMode = useLowPerformanceMode();
    const rafIdRef = useRef<number | null>(null);

    // 检测移动端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
                'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 检测页面可见性 - 页面不可见时禁用动画
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageHidden(document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // 直接更新 MotionValue，不触发 React Render
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPageHidden) return;

        // 直接设置 MotionValue，这就是性能优化的关键点
        // React 不会因为这行代码而重新渲染组件
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }, [isPageHidden, mouseX, mouseY]);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    useEffect(() => {
        if (!enabled || prefersReducedMotion || isLowPerformanceMode || (hideOnMobile && isMobile)) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [
        enabled,
        prefersReducedMotion,
        isLowPerformanceMode,
        hideOnMobile,
        isMobile,
        handleMouseMove, // 现在 handleMouseMove 依赖很少变化
        handleMouseEnter,
        handleMouseLeave,
    ]);

    // 移动端、禁用、或页面隐藏时不渲染
    if (!enabled || prefersReducedMotion || isLowPerformanceMode || (hideOnMobile && isMobile) || isPageHidden) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
                    aria-hidden="true"
                    style={{
                        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
                        contain: 'strict'
                    }}
                >
                    <motion.div
                        className="absolute rounded-full"
                        style={{
                            width: size,
                            height: size,
                            x, //直接绑定 MotionValue
                            y, //直接绑定 MotionValue
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                            willChange: 'transform',
                            transform: 'translateZ(0)', // Force GPU layer
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Dark-mode specific cursor glow wrapper.
export function DarkModeCursorGlow() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(
                document.documentElement.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );
        };

        checkDarkMode();

        // 监听主题变化
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkDarkMode);

        return () => {
            observer.disconnect();
            mediaQuery.removeEventListener('change', checkDarkMode);
        };
    }, []);

    return (
        <CursorGlow
            color={isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(59, 130, 246, 0.1)'}
            size={isDarkMode ? 350 : 250}
        />
    );
}
