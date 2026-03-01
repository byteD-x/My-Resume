"use client";

import { useSyncExternalStore } from "react";

interface NavigatorConnectionWithSaveData {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

interface NavigatorWithDeviceHints extends Navigator {
  deviceMemory?: number;
  connection?: NavigatorConnectionWithSaveData;
}

const DEVICE_HINTS = {
  LOW_CORE_COUNT: 4,
  LOW_MEMORY_GB: 4,
} as const;

const LOW_PERF_MEDIA_QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(pointer: coarse)",
  "(hover: none)",
] as const;

let snapshot = false;
let isListening = false;
let resizeRafId: number | null = null;
let mediaQueries: MediaQueryList[] = [];
let connectionRef: NavigatorConnectionWithSaveData | null = null;
const listeners = new Set<() => void>();

function detectLowPerformanceMode(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as NavigatorWithDeviceHints;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const lowCoreCount =
    typeof nav.hardwareConcurrency === "number" &&
    nav.hardwareConcurrency <= DEVICE_HINTS.LOW_CORE_COUNT;
  const lowMemory =
    typeof nav.deviceMemory === "number" &&
    nav.deviceMemory <= DEVICE_HINTS.LOW_MEMORY_GB;
  const saveDataEnabled = Boolean(nav.connection?.saveData);

  return (
    prefersReducedMotion ||
    saveDataEnabled ||
    lowCoreCount ||
    lowMemory ||
    (coarsePointer && noHover)
  );
}

const emit = () => {
  listeners.forEach((listener) => listener());
};

const syncSnapshot = () => {
  const next = detectLowPerformanceMode();
  if (next === snapshot) return;
  snapshot = next;
  emit();
};

const scheduleSyncSnapshot = () => {
  if (typeof window === "undefined") return;
  if (resizeRafId !== null) return;
  resizeRafId = window.requestAnimationFrame(() => {
    resizeRafId = null;
    syncSnapshot();
  });
};

const startListening = () => {
  if (isListening || typeof window === "undefined") return;
  isListening = true;
  const next = detectLowPerformanceMode();
  if (next !== snapshot) {
    snapshot = next;
    emit();
  }

  mediaQueries = LOW_PERF_MEDIA_QUERIES.map((query) =>
    window.matchMedia(query),
  );
  mediaQueries.forEach((mediaQuery) =>
    mediaQuery.addEventListener("change", syncSnapshot),
  );
  window.addEventListener("resize", scheduleSyncSnapshot, { passive: true });

  const nav = navigator as NavigatorWithDeviceHints;
  connectionRef = nav.connection ?? null;
  connectionRef?.addEventListener?.("change", syncSnapshot);
};

const stopListening = () => {
  if (!isListening || typeof window === "undefined") return;
  isListening = false;

  mediaQueries.forEach((mediaQuery) =>
    mediaQuery.removeEventListener("change", syncSnapshot),
  );
  mediaQueries = [];

  window.removeEventListener("resize", scheduleSyncSnapshot);
  connectionRef?.removeEventListener?.("change", syncSnapshot);
  connectionRef = null;

  if (resizeRafId !== null) {
    window.cancelAnimationFrame(resizeRafId);
    resizeRafId = null;
  }
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

const getSnapshot = () => snapshot;

export function useLowPerformanceMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
