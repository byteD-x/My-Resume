type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout?: number },
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };

export function scheduleDeferredTask(
  task: () => void,
  delayMs = 480,
): () => void {
  if (typeof window === "undefined") {
    task();
    return () => undefined;
  }

  const idleWindow = window as IdleWindow;
  let cancelled = false;
  let timeoutId: number | null = null;
  let idleId: number | null = null;

  const run = () => {
    if (cancelled) return;
    task();
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    idleId = idleWindow.requestIdleCallback(run, {
      timeout: delayMs,
    });
  } else {
    timeoutId = window.setTimeout(run, delayMs);
  }

  return () => {
    cancelled = true;
    if (
      idleId !== null &&
      typeof idleWindow.cancelIdleCallback === "function"
    ) {
      idleWindow.cancelIdleCallback(idleId);
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  };
}
