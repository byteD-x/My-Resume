import { useSyncExternalStore } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
let shouldReduceMotion = false;
let mediaQuery: MediaQueryList | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const handleChange = () => {
  if (!mediaQuery) return;
  const next = mediaQuery.matches;
  if (next === shouldReduceMotion) return;
  shouldReduceMotion = next;
  emit();
};

const startListening = () => {
  if (typeof window === "undefined" || mediaQuery) return;
  mediaQuery = window.matchMedia(MEDIA_QUERY);
  const next = mediaQuery.matches;
  if (next !== shouldReduceMotion) {
    shouldReduceMotion = next;
    emit();
  }
  mediaQuery.addEventListener("change", handleChange);
};

const stopListening = () => {
  if (!mediaQuery) return;
  mediaQuery.removeEventListener("change", handleChange);
  mediaQuery = null;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  startListening();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopListening();
    }
  };
};

const getSnapshot = () => shouldReduceMotion;

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
