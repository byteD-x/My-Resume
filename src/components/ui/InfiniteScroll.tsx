'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { INFINITE_SCROLL } from '@/config/animation';

interface InfiniteScrollProps {
    items: React.ReactNode[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    pauseOnHover?: boolean;
    className?: string;
    /** 屏幕阅读器标签 */
    ariaLabel?: string;
}

export const InfiniteScroll = ({
    items,
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    className,
    ariaLabel = '滚动内容列表',
}: InfiniteScrollProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [start, setStart] = React.useState(false);

    // 设置动画方向
    const setDirection = React.useCallback((dir: 'left' | 'right') => {
        if (containerRef.current) {
            containerRef.current.style.setProperty(
                '--animation-direction', 
                dir === 'left' ? 'forwards' : 'reverse'
            );
        }
    }, []);

    // 设置动画速度
    const setSpeed = React.useCallback((spd: 'fast' | 'normal' | 'slow') => {
        if (containerRef.current) {
            const duration = spd === 'fast' 
                ? INFINITE_SCROLL.SPEED_FAST 
                : spd === 'normal' 
                    ? INFINITE_SCROLL.SPEED_NORMAL 
                    : INFINITE_SCROLL.SPEED_SLOW;
            containerRef.current.style.setProperty('--animation-duration', `${duration}s`);
        }
    }, []);

    // 添加动画
    const addAnimation = React.useCallback(() => {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            setDirection(direction);
            setSpeed(speed);
            setStart(true);
        }
    }, [direction, speed, setDirection, setSpeed]);

    React.useEffect(() => {
        if (!prefersReducedMotion) {
            addAnimation();
        }
    }, [addAnimation, prefersReducedMotion]);

    // 如果用户偏好减少动画，使用静态布局
    if (prefersReducedMotion) {
        return (
            <div
                ref={containerRef}
                className={cn(
                    'relative z-20 max-w-7xl overflow-hidden',
                    className
                )}
                role="list"
                aria-label={ariaLabel}
            >
                <ul
                    ref={scrollerRef}
                    className="flex flex-wrap gap-4 py-4"
                >
                    {items.map((item, idx) => (
                        <li
                            className="w-[150px] relative rounded-2xl border border-slate-200 dark:border-slate-800 px-8 py-6 md:w-[200px] bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0"
                            key={idx}
                            role="listitem"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
                className
            )}
            role="list"
            aria-label={ariaLabel}
            aria-live="polite"
            aria-atomic="false"
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    'flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
                    start && 'animate-scroll',
                    pauseOnHover && 'hover:[animation-play-state:paused]'
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[150px] relative rounded-2xl border border-slate-200 dark:border-slate-800 px-8 py-6 md:w-[200px] bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0"
                        key={idx}
                        role="listitem"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};
