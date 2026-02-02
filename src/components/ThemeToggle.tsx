'use client';

import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

/**
 * 深色模式切换组件
 * 支持三种模式：浅色、深色、跟随系统
 * 使用 localStorage 持久化用户偏好
 */
export function ThemeToggle({ className }: { className?: string }) {
    // 使用 lazy initializer 来避免在 effect 中调用 setState
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'system';
        const stored = localStorage.getItem('theme') as Theme | null;
        return stored || 'system';
    });
    const [mounted, setMounted] = useState(false);

    // 获取实际显示的主题
    const getResolvedTheme = useCallback((t: Theme): 'light' | 'dark' => {
        if (t === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return t;
    }, []);

    // 应用主题
    const applyTheme = useCallback((t: Theme) => {
        const resolved = getResolvedTheme(t);
        const root = document.documentElement;

        if (resolved === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
    }, [getResolvedTheme]);

    // 初始化 - 应用主题并标记 mounted
    useEffect(() => {
        // 应用当前主题到 DOM
        applyTheme(theme);
        // 使用 RAF 延迟 setMounted，避免同步调用 setState
        const rafId = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(rafId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 仅在组件挂载时执行，theme 和 applyTheme 在初始化后由其他 effect 处理

    // 监听系统主题变化
    useEffect(() => {
        if (!mounted) return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, applyTheme, mounted]);

    // 切换主题
    const cycleTheme = () => {
        const order: Theme[] = ['light', 'dark', 'system'];
        const nextIndex = (order.indexOf(theme) + 1) % order.length;
        const next = order[nextIndex];

        setTheme(next);
        localStorage.setItem('theme', next);
        applyTheme(next);
    };

    // 防止服务端渲染不匹配
    if (!mounted) {
        return (
            <button
                className={cn(
                    "p-2.5 rounded-full bg-slate-100 text-slate-400",
                    className
                )}
                aria-label="切换主题"
            >
                <Monitor size={18} />
            </button>
        );
    }

    const icons = {
        light: <Sun size={18} />,
        dark: <Moon size={18} />,
        system: <Monitor size={18} />,
    };

    const labels = {
        light: '浅色模式',
        dark: '深色模式',
        system: '跟随系统',
    };

    return (
        <button
            onClick={cycleTheme}
            className={cn(
                "p-2.5 rounded-full transition-all duration-200",
                "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900",
                "dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                className
            )}
            aria-label={`当前：${labels[theme]}，点击切换`}
            title={labels[theme]}
        >
            {icons[theme]}
        </button>
    );
}
