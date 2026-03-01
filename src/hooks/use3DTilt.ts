"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

// 默认配置常量
const DEFAULT_MAX_TILT = 10;
const DEFAULT_PERSPECTIVE = 1000;
const DEFAULT_SCALE = 1.02;
const DEFAULT_SPEED = 400;
const DEFAULT_GLARE_OPACITY = 0.2;

interface TiltConfig {
  maxTilt?: number; // 最大倾斜角度
  perspective?: number; // 透视距离
  scale?: number; // 悬停放大比例
  speed?: number; // 动画速度 (ms)
  glare?: boolean; // 是否显示光泽效果
  glareOpacity?: number; // 光泽不透明度
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

type RefCallback<T> = (instance: T | null) => void;

export function use3DTilt<T extends HTMLElement = HTMLDivElement>(
  config: TiltConfig = {},
) {
  const {
    maxTilt = DEFAULT_MAX_TILT,
    perspective = DEFAULT_PERSPECTIVE,
    scale = DEFAULT_SCALE,
    speed = DEFAULT_SPEED,
    glare = true,
    glareOpacity = DEFAULT_GLARE_OPACITY,
  } = config;

  const elementRef = useRef<T | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const prefersReducedMotion = useReducedMotion();
  const rafIdRef = useRef<number | null>(null);
  const lastMousePos = useRef<{
    percentX: number;
    percentY: number;
    glareX: number;
    glareY: number;
  } | null>(null);

  // 使用 RAF 节流更新倾斜状态
  const updateTilt = useCallback(() => {
    if (lastMousePos.current) {
      const { percentX, percentY, glareX, glareY } = lastMousePos.current;
      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;
      setTilt({ rotateX, rotateY, glareX, glareY });
    }
    rafIdRef.current = null;
  }, [maxTilt]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion || !elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;

      lastMousePos.current = { percentX, percentY, glareX, glareY };

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateTilt);
      }
    },
    [prefersReducedMotion, updateTilt],
  );

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion) {
      setIsHovered(true);
    }
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    // 清理 RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    lastMousePos.current = null;
  }, []);

  // 清理 RAF 的 effect
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // 设置元素引用的回调
  const setRef: RefCallback<T> = useCallback(
    (node: T | null) => {
      // 清理旧的事件监听器
      if (elementRef.current) {
        elementRef.current.removeEventListener("mousemove", handleMouseMove);
        elementRef.current.removeEventListener("mouseenter", handleMouseEnter);
        elementRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      elementRef.current = node;

      // 添加新的事件监听器
      if (node) {
        node.addEventListener("mousemove", handleMouseMove);
        node.addEventListener("mouseenter", handleMouseEnter);
        node.addEventListener("mouseleave", handleMouseLeave);
      }
    },
    [handleMouseMove, handleMouseEnter, handleMouseLeave],
  );

  // 生成内联样式
  const tiltStyle: React.CSSProperties = {
    transform: isHovered
      ? `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${scale})`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    transformStyle: "preserve-3d" as const,
  };

  // 光泽层样式
  const glareStyle: React.CSSProperties = glare
    ? {
        position: "absolute" as const,
        inset: 0,
        pointerEvents: "none" as const,
        borderRadius: "inherit",
        background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${isHovered ? glareOpacity : 0}), transparent 60%)`,
        transition: `opacity ${speed}ms ease`,
        zIndex: 10,
      }
    : {};

  return {
    ref: setRef,
    tiltStyle,
    glareStyle,
    isHovered,
  };
}
