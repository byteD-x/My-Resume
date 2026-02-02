import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 使用 RAF 节流的高性能鼠标位置追踪
 * @param callback 位置更新回调
 * @returns 节流后的处理函数
 */
export function useRafThrottle<T extends (e: MouseEvent) => void>(callback: T): T {
    let rafId: number | null = null;
    let lastEvent: MouseEvent | null = null;

    const throttled = function (e: MouseEvent) {
        lastEvent = e;

        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                if (lastEvent) {
                    callback(lastEvent);
                }
                rafId = null;
            });
        }
    } as T;

    return throttled;
}

/**
 * 使用 RAF 节流的通用状态更新
 * @param callback 状态更新回调
 * @returns 节流后的处理函数和清理函数
 */
export function createRafThrottle<T>(callback: (value: T) => void): {
    throttled: (value: T) => void;
    cancel: () => void;
} {
    let rafId: number | null = null;
    let pendingValue: T | null = null;

    const throttled = (value: T) => {
        pendingValue = value;

        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                if (pendingValue !== null) {
                    callback(pendingValue);
                }
                pendingValue = null;
                rafId = null;
            });
        }
    };

    const cancel = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        pendingValue = null;
    };

    return { throttled, cancel };
}
