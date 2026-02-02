'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const rafIdRef = useRef<number | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

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

    // 使用 RAF 节流的鼠标移动处理
    const handleMouseMove = useCallback((e: MouseEvent) => {
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        if (rafIdRef.current === null) {
            rafIdRef.current = requestAnimationFrame(() => {
                setMousePosition(lastMousePos.current);
                rafIdRef.current = null;
            });
        }
    }, []);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
        // 清理 RAF
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!enabled || prefersReducedMotion || (hideOnMobile && isMobile)) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            // 清理 RAF
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [enabled, prefersReducedMotion, hideOnMobile, isMobile, handleMouseMove, handleMouseEnter, handleMouseLeave]);

    // 移动端或禁用时不渲染
    if (!enabled || prefersReducedMotion || (hideOnMobile && isMobile)) {
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
                    style={{ mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'] }}
                >
                    <motion.div
                        className="absolute rounded-full"
                        animate={{
                            x: mousePosition.x - size / 2,
                            y: mousePosition.y - size / 2,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 28,
                            mass: 0.5,
                        }}
                        style={{
                            width: size,
                            height: size,
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// 暗色模式专用的光标光晕
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
