import { RefObject, useEffect, useRef } from "react";

interface UseFocusTrapOptions {
  onEscape?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  lockBodyScroll?: boolean;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  options: UseFocusTrapOptions = {},
) {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { onEscape, initialFocusRef, lockBodyScroll = false } = options;

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusInitialElement = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const elements =
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      elements[0]?.focus();
    };

    focusInitialElement();

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousScrollLockOffset = document.documentElement.style.getPropertyValue(
      "--scroll-lock-offset",
    );
    if (lockBodyScroll) {
      const scrollbarWidth = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth,
      );

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        scrollbarWidth > 0 ? `${scrollbarWidth}px` : previousPaddingRight;
      document.documentElement.style.setProperty(
        "--scroll-lock-offset",
        `${scrollbarWidth}px`,
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }

      if (e.key !== "Tab") return;

      const elements =
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (lockBodyScroll) {
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPaddingRight;
        if (previousScrollLockOffset) {
          document.documentElement.style.setProperty(
            "--scroll-lock-offset",
            previousScrollLockOffset,
          );
        } else {
          document.documentElement.style.removeProperty("--scroll-lock-offset");
        }
      }
      previousFocusRef.current?.focus();
    };
  }, [isActive, initialFocusRef, lockBodyScroll, onEscape]);

  return containerRef;
}
