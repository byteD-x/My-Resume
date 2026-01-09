'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface TiltConfig {
    maxTilt?: number;      // 最大倾斜角度
    perspective?: number;  // 透视距离
    scale?: number;       // 悬停放大比例
    speed?: number;       // 动画速度 (ms)
    glare?: boolean;      // 是否显示光泽效果
    glareOpacity?: number; // 光泽不透明度
}

interface TiltState {
    rotateX: number;
    rotateY: number;
    glareX: number;
    glareY: number;
}

type RefCallback<T> = (instance: T | null) => void;

export function use3DTilt<T extends HTMLElement = HTMLDivElement>(config: TiltConfig = {}) {
    const {
        maxTilt = 10,
        perspective = 1000,
        scale = 1.02,
        speed = 400,
        glare = true,
        glareOpacity = 0.2,
    } = config;

    const elementRef = useRef<T | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState<TiltState>({
        rotateX: 0,
        rotateY: 0,
        glareX: 50,
        glareY: 50,
    });

    // 检查用户是否偏好减少动画
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (prefersReducedMotion || !elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 计算鼠标相对于中心的偏移 (-1 到 1)
        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);

        // 计算倾斜角度
        const rotateX = -percentY * maxTilt;
        const rotateY = percentX * maxTilt;

        // 计算光泽位置 (0-100%)
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;

        setTilt({ rotateX, rotateY, glareX, glareY });
    }, [maxTilt, prefersReducedMotion]);

    const handleMouseEnter = useCallback(() => {
        if (!prefersReducedMotion) {
            setIsHovered(true);
        }
    }, [prefersReducedMotion]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    }, []);

    // 设置元素引用的回调
    const setRef: RefCallback<T> = useCallback((node: T | null) => {
        // 清理旧的事件监听器
        if (elementRef.current) {
            elementRef.current.removeEventListener('mousemove', handleMouseMove);
            elementRef.current.removeEventListener('mouseenter', handleMouseEnter);
            elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }

        elementRef.current = node;

        // 添加新的事件监听器
        if (node) {
            node.addEventListener('mousemove', handleMouseMove);
            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        }
    }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

    // 生成内联样式
    const tiltStyle: React.CSSProperties = {
        transform: isHovered
            ? `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${scale})`
            : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        transformStyle: 'preserve-3d' as const,
    };

    // 光泽层样式
    const glareStyle: React.CSSProperties = glare ? {
        position: 'absolute' as const,
        inset: 0,
        pointerEvents: 'none' as const,
        borderRadius: 'inherit',
        background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${isHovered ? glareOpacity : 0}), transparent 60%)`,
        transition: `opacity ${speed}ms ease`,
        zIndex: 10,
    } : {};

    return {
        ref: setRef,
        tiltStyle,
        glareStyle,
        isHovered,
    };
}
