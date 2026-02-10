'use client';

import React, { useRef, useState, useCallback, ReactNode } from 'react';
import { m as motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;       // 光晕颜色 (CSS 颜色值)
    glowSize?: number;        // 光晕大小 (px)
    glowOpacity?: number;     // 光晕不透明度
    borderGlow?: boolean;     // 是否显示边框光晕
    as?: 'div' | 'article' | 'section';
}

export function GlowCard({
    children,
    className = '',
    glowColor = 'rgba(59, 130, 246, 0.5)',
    glowSize = 200,
    glowOpacity = 0.15,
    borderGlow = true,
    as: Component = 'div',
}: GlowCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const MotionComponent = motion[Component];

    return (
        <MotionComponent
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-2xl",
                className
            )}
            style={{ isolation: 'isolate' }}
        >
            {/* 主光晕效果 */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(${glowSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 60%)`,
                }}
                aria-hidden="true"
            />

            {/* 边框光晕效果 */}
            {borderGlow && (
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                        opacity: isHovered ? glowOpacity * 2 : 0,
                        background: `radial-gradient(${glowSize * 0.8}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 50%)`,
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'xor',
                        padding: '1px',
                    }}
                    aria-hidden="true"
                />
            )}

            {/* 内容 */}
            <div className="relative z-10">
                {children}
            </div>
        </MotionComponent>
    );
}

// 预设颜色主题
export const glowThemes = {
    blue: 'rgba(59, 130, 246, 0.5)',
    sky: 'rgba(14, 165, 233, 0.5)',
    cyan: 'rgba(6, 182, 212, 0.5)',
    emerald: 'rgba(16, 185, 129, 0.5)',
    rose: 'rgba(244, 63, 94, 0.5)',
    amber: 'rgba(245, 158, 11, 0.5)',
    gradient: 'rgba(14, 165, 233, 0.4)',
};
