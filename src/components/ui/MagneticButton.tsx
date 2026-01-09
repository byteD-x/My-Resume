'use client';

import React, { useRef, useState, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    strength = 0.3,
    radius = 100,
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
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!buttonRef.current || disabled) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 计算鼠标到中心的距离
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // 只在半径内产生磁性效果
        if (distance < radius) {
            const factor = 1 - distance / radius; // 距离越近，吸引力越强
            setPosition({
                x: distanceX * strength * factor,
                y: distanceY * strength * factor,
            });
        }
    }, [strength, radius, disabled]);

    const handleMouseEnter = useCallback(() => {
        if (!disabled) {
            setIsHovered(true);
            window.addEventListener('mousemove', handleMouseMove);
        }
    }, [handleMouseMove, disabled]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
        window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    // 清理事件监听器
    React.useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
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

    const transition = {
        type: 'spring' as const,
        stiffness: 150,
        damping: 15,
        mass: 0.1,
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
