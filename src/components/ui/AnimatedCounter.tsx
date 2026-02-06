'use client';

import { useEffect, useRef, useState } from 'react';
import { m as motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    suffix?: string;    // 后缀如 +, %, x
    prefix?: string;    // 前缀如 $, ¥
    duration?: number;  // 动画时长 (秒)
    delay?: number;     // 延迟 (秒)
    className?: string;
    once?: boolean;     // 只播放一次
}

export function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    duration = 2,
    delay = 0,
    className = '',
    once = true,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once, margin: '-50px' });
    const [hasAnimated, setHasAnimated] = useState(false);

    // 使用 spring 物理动画
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
        duration: duration * 1000,
    });

    // 转换为整数显示
    const displayValue = useTransform(springValue, (latest) =>
        Math.round(latest).toLocaleString()
    );

    useEffect(() => {
        if (isInView && !hasAnimated) {
            const timer = setTimeout(() => {
                springValue.set(value);
                setHasAnimated(true);
            }, delay * 1000);

            return () => clearTimeout(timer);
        }
    }, [isInView, value, springValue, delay, hasAnimated]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            <motion.span className="tabular-nums">
                {displayValue}
            </motion.span>
            {suffix}
        </span>
    );
}

// 解析字符串值，提取数字和后缀
export function parseValueString(valueString: string): { value: number; suffix: string } {
    const match = valueString.match(/^([\d,]+\.?\d*)(.*)$/);
    if (match) {
        const numericPart = match[1].replace(/,/g, '');
        return {
            value: parseFloat(numericPart) || 0,
            suffix: match[2] || '',
        };
    }
    return { value: 0, suffix: valueString };
}

// 便捷组件：自动解析字符串值
interface AutoAnimatedCounterProps {
    valueString: string;  // 如 "500+", "99%", "10x"
    duration?: number;
    delay?: number;
    className?: string;
}

export function AutoAnimatedCounter({
    valueString,
    duration = 2,
    delay = 0,
    className = '',
}: AutoAnimatedCounterProps) {
    const { value, suffix } = parseValueString(valueString);

    return (
        <AnimatedCounter
            value={value}
            suffix={suffix}
            duration={duration}
            delay={delay}
            className={className}
        />
    );
}
