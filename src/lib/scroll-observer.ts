'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

export interface ScrollObserverState {
    y: number;
    progress: number;
}

const initialState: ScrollObserverState = { y: 0, progress: 0 };
let state: ScrollObserverState = initialState;

const listeners = new Set<() => void>();
let listening = false;
let frameId: number | null = null;

const getDocHeight = () => {
    if (typeof document === 'undefined') return 0;
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
};

const computeState = (): ScrollObserverState => {
    if (typeof window === 'undefined') return initialState;

    const y = window.scrollY;
    const docHeight = getDocHeight();
    const progress = docHeight > 0 ? Math.min(Math.max(y / docHeight, 0), 1) : 0;
    return { y, progress };
};

const emit = () => {
    listeners.forEach((listener) => listener());
};

const syncState = () => {
    frameId = null;
    const next = computeState();
    if (next.y === state.y && next.progress === state.progress) return;
    state = next;
    emit();
};

const scheduleSync = () => {
    if (frameId !== null) return;
    frameId = window.requestAnimationFrame(syncState);
};

const onScrollOrResize = () => {
    scheduleSync();
};

const startListening = () => {
    if (listening || typeof window === 'undefined') return;
    listening = true;
    state = computeState();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
};

const stopListening = () => {
    if (!listening || typeof window === 'undefined') return;
    listening = false;
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
    if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
    }
    state = initialState;
};

export function subscribeScrollObserver(listener: () => void): () => void {
    listeners.add(listener);
    startListening();

    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            stopListening();
        }
    };
}

export function getScrollObserverSnapshot(): ScrollObserverState {
    return state;
}

export function useScrollObserverState(): ScrollObserverState {
    return useSyncExternalStore(
        subscribeScrollObserver,
        getScrollObserverSnapshot,
        () => initialState,
    );
}

/**
 * Subscribe to a Y threshold and only trigger React updates when crossing it.
 * This avoids re-rendering UI on every scroll frame for simple show/hide states.
 */
export function useScrollPastThreshold(threshold: number): boolean {
    // Keep SSR and first client render deterministic to avoid hydration mismatch.
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const syncThreshold = () => {
            const next = getScrollObserverSnapshot().y > threshold;
            setIsPast((prev) => (prev === next ? prev : next));
        };

        const unsubscribe = subscribeScrollObserver(syncThreshold);
        syncThreshold();
        return unsubscribe;
    }, [threshold]);

    return isPast;
}
