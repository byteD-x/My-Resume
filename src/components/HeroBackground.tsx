'use client';

import { m as motion, useReducedMotion } from 'framer-motion';
import { HERO_ANIMATION } from '@/config/animation';
import { useLowPerformanceMode } from '@/hooks/useLowPerformanceMode';

/**
 * Hero 背景装饰动画组件。
 * 在低性能模式下自动降级到静态背景，避免持续动画造成掉帧。
 */
export default function HeroBackground() {
    const prefersReducedMotion = useReducedMotion();
    const isLowPerformanceMode = useLowPerformanceMode();

    if (prefersReducedMotion || isLowPerformanceMode) {
        return (
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-100/40 to-sky-100/40 opacity-40 blur-3xl dark:from-blue-900/20 dark:to-sky-900/20" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 opacity-40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
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
                className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 transform-gpu rounded-full bg-gradient-to-br from-blue-100/40 to-sky-100/40 opacity-40 blur-3xl will-change-transform dark:from-blue-900/20 dark:to-sky-900/20"
                style={{ contain: 'layout style paint' }}
            />
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
                className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 transform-gpu rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 opacity-40 blur-3xl will-change-transform dark:from-emerald-900/20 dark:to-teal-900/20"
                style={{ contain: 'layout style paint' }}
            />
        </div>
    );
}
