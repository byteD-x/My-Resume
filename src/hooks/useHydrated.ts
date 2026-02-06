'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns true after client hydration is completed.
 * Useful for gating critical JS-driven interactions to avoid early no-op clicks.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
}
