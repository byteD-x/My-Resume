import { useEffect, useLayoutEffect } from "react";

// Use useLayoutEffect in SSR-safe way
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useScrollLock(lock: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!lock) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalScrollLockOffset = document.documentElement.style.getPropertyValue(
      "--scroll-lock-offset",
    );
    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight =
      scrollbarWidth > 0 ? `${scrollbarWidth}px` : originalPaddingRight;
    document.documentElement.style.setProperty(
      "--scroll-lock-offset",
      `${scrollbarWidth}px`,
    );

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
      if (originalScrollLockOffset) {
        document.documentElement.style.setProperty(
          "--scroll-lock-offset",
          originalScrollLockOffset,
        );
      } else {
        document.documentElement.style.removeProperty("--scroll-lock-offset");
      }
    };
  }, [lock]);
}
