'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLowPerformanceMode } from '@/hooks/useLowPerformanceMode';

// 榛樿閰嶇疆甯搁噺
const DEFAULT_SIZE = 300;
const DEFAULT_COLOR = 'rgba(59, 130, 246, 0.15)';
const MOBILE_BREAKPOINT = 768;

interface CursorGlowProps {
    size?: number;           // 鍏夋枒澶у皬
    color?: string;          // 鍏夋枒棰滆壊
    blendMode?: string;      // 娣峰悎妯″紡
    enabled?: boolean;       // 鏄惁鍚敤
    hideOnMobile?: boolean;  // 绉诲姩绔殣钘?
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
    const [isPageHidden, setIsPageHidden] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const isLowPerformanceMode = useLowPerformanceMode();
    const rafIdRef = useRef<number | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // 妫€娴嬬Щ鍔ㄧ
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
                'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 妫€娴嬮〉闈㈠彲瑙佹€?- 椤甸潰涓嶅彲瑙佹椂绂佺敤鍔ㄧ敾
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageHidden(document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // 浣跨敤 RAF 鑺傛祦鐨勯紶鏍囩Щ鍔ㄥ鐞?- 娣诲姞鑺傛祦浼樺寲
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isPageHidden) return;

        lastMousePos.current = { x: e.clientX, y: e.clientY };

        if (rafIdRef.current === null) {
            rafIdRef.current = requestAnimationFrame(() => {
                setMousePosition(lastMousePos.current);
                rafIdRef.current = null;
            });
        }
    }, [isPageHidden]);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
        // 娓呯悊 RAF
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!enabled || prefersReducedMotion || isLowPerformanceMode || (hideOnMobile && isMobile)) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            // 娓呯悊 RAF
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [
        enabled,
        prefersReducedMotion,
        isLowPerformanceMode,
        hideOnMobile,
        isMobile,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
    ]);

    // 绉诲姩绔€佺鐢ㄣ€佹垨椤甸潰闅愯棌鏃朵笉娓叉煋
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
                        animate={{
                            x: mousePosition.x - size / 2,
                            y: mousePosition.y - size / 2,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8,
                        }}
                        style={{
                            width: size,
                            height: size,
                            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                            willChange: 'transform',
                            transform: 'translateZ(0)',
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

        // 鐩戝惉涓婚鍙樺寲
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

