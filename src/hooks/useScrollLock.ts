import { useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect in SSR-safe way
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useScrollLock(lock: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!lock) return;

    // Get original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts or lock becomes false
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
