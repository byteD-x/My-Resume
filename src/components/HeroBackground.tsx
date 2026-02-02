'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { HERO_ANIMATION, MOBILE_CONFIG } from '@/config/animation';
import { useState, useEffect } from 'react';

/**
 * Hero 背景装饰动画组件
 * 懒加载以减少首屏渲染负担
 * 性能优化：
 * - 移动端禁用动画
 * - 减少动画属性变化
 * - 使用 CSS transform 优化
 */
export default function HeroBackground() {
    const prefersReducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_CONFIG.BREAKPOINT);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 在移动端或减少动画模式下，使用静态背景
    if (prefersReducedMotion || isMobile) {
        return (
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* 第一个背景 - 只使用 transform，避免重排 */}
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: HERO_ANIMATION.BACKGROUND.duration,
                    repeat: HERO_ANIMATION.BACKGROUND.repeat,
                    ease: HERO_ANIMATION.BACKGROUND.ease,
                    times: [0, 0.5, 1],
                }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4 transform-gpu will-change-transform"
                style={{ contain: 'layout style paint' }}
            />
            {/* 第二个背景 - 减少动画范围 */}
            <motion.div
                animate={{
                    scale: [1, 1.08, 1],
                }}
                transition={{
                    duration: HERO_ANIMATION.BACKGROUND_DURATION_2,
                    repeat: HERO_ANIMATION.BACKGROUND.repeat,
                    ease: HERO_ANIMATION.BACKGROUND.ease,
                    delay: HERO_ANIMATION.BACKGROUND_DELAY,
                    times: [0, 0.5, 1],
                }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4 transform-gpu will-change-transform"
                style={{ contain: 'layout style paint' }}
            />
        </div>
    );
}
