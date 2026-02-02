'use client';

import React, { useRef, useState, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// 默认配置常量
const DEFAULT_STRENGTH = 0.3;
const DEFAULT_RADIUS = 100;

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number;     // 磁性强度 (0-1)
    radius?: number;       // 触发半径 (px)
    as?: 'button' | 'a' | 'div';
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
    ariaLabel?: string;
}

export function MagneticButton({
    children,
    className = '',
    strength = DEFAULT_STRENGTH,
    radius = DEFAULT_RADIUS,
    as = 'button',
    onClick,
    href,
    target,
    rel,
    disabled = false,
    ariaLabel,
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const prefersReducedMotion = useReducedMotion();
    const rafIdRef = useRef<number | null>(null);
    const lastMousePos = useRef({ x: 0, y: 0, distance: 0, distanceX: 0, distanceY: 0 });

    // 使用 RAF 节流计算磁性效果
    const calculateMagneticPosition = useCallback(() => {
        const { distanceX, distanceY, distance } = lastMousePos.current;

        if (distance < radius) {
            const factor = 1 - distance / radius;
            setPosition({
                x: distanceX * strength * factor,
                y: distanceY * strength * factor,
            });
        }

        rafIdRef.current = null;
    }, [strength, radius]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!buttonRef.current || disabled || prefersReducedMotion) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        lastMousePos.current = { x: e.clientX, y: e.clientY, distance, distanceX, distanceY };

        // 只在半径内且RAF空闲时触发计算
        if (distance < radius && rafIdRef.current === null) {
            rafIdRef.current = requestAnimationFrame(calculateMagneticPosition);
        }
    }, [disabled, prefersReducedMotion, radius, calculateMagneticPosition]);

    const handleMouseEnter = useCallback(() => {
        if (!disabled && !prefersReducedMotion) {
            window.addEventListener('mousemove', handleMouseMove);
        }
    }, [handleMouseMove, disabled, prefersReducedMotion]);

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
        window.removeEventListener('mousemove', handleMouseMove);
        // 清理 RAF
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
    }, [handleMouseMove]);

    // 清理事件监听器
    React.useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [handleMouseMove]);

    const commonProps = {
        ref: buttonRef as React.RefObject<HTMLButtonElement>,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: cn(
            "inline-flex items-center justify-center",
            disabled && "opacity-50 cursor-not-allowed",
            className
        ),
        'aria-label': ariaLabel,
    };

    const motionStyle = {
        x: position.x,
        y: position.y,
    };

    // 使用更平滑稳定的缓动，避免回弹震颤
    const transition = {
        type: 'spring' as const,
        stiffness: 300,
        damping: 40,
        mass: 1,
    };

    if (as === 'a' && href) {
        return (
            <motion.a
                {...commonProps}
                ref={buttonRef as React.RefObject<HTMLAnchorElement>}
                href={href}
                target={target}
                rel={rel}
                animate={motionStyle}
                transition={transition}
            >
                {children}
            </motion.a>
        );
    }

    if (as === 'div') {
        return (
            <motion.div
                {...commonProps}
                ref={buttonRef as React.RefObject<HTMLDivElement>}
                animate={motionStyle}
                transition={transition}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.button
            {...commonProps}
            onClick={onClick}
            disabled={disabled}
            animate={motionStyle}
            transition={transition}
        >
            {children}
        </motion.button>
    );
}
