export type ScrollRestoreSection = "experience" | "projects";

export interface ScrollRestoreState {
  path: string;
  y?: number;
  section?: ScrollRestoreSection;
  ts?: number;
}

const STORAGE_KEY = "portfolio_scroll_restore_v1";

const isBrowser = () => typeof window !== "undefined";

export function saveScrollRestore(state: ScrollRestoreState) {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function readScrollRestore(): ScrollRestoreState | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as ScrollRestoreState;
  } catch {
    return null;
  }
}

export function clearScrollRestore() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
