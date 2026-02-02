'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { HERO_ANIMATION } from '@/config/animation';

/**
 * Hero 背景装饰动画组件
 * 懒加载以减少首屏渲染负担
 */
export default function HeroBackground() {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: HERO_ANIMATION.BACKGROUND.duration,
                    repeat: HERO_ANIMATION.BACKGROUND.repeat,
                    ease: HERO_ANIMATION.BACKGROUND.ease,
                }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4 transform-gpu will-change-transform"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: HERO_ANIMATION.BACKGROUND_DURATION_2,
                    repeat: HERO_ANIMATION.BACKGROUND.repeat,
                    ease: HERO_ANIMATION.BACKGROUND.ease,
                    delay: HERO_ANIMATION.BACKGROUND_DELAY,
                }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4 transform-gpu will-change-transform"
            />
        </div>
    );
}
