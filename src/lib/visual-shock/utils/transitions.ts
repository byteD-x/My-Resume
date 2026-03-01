import type {
  ISceneOrchestrator,
  TransitionFunction,
} from "@/lib/visual-shock/types";

function waitWithAbort(durationMs: number, signal: AbortSignal): Promise<void> {
  if (durationMs <= 0) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, durationMs);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Transition aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function timedTransition(multiplier: number): TransitionFunction {
  return async (_from, _to, options, signal) => {
    await waitWithAbort(Math.round(options.duration * multiplier), signal);
  };
}

export const builtInTransitions: Record<string, TransitionFunction> = {
  fade: timedTransition(1),
  slide: timedTransition(1.05),
  zoom: timedTransition(0.95),
  morph: timedTransition(1.2),
  shatter: timedTransition(0.85),
  ripple: timedTransition(1.1),
  wipe: timedTransition(1),
  dissolve: timedTransition(1.15),
};

export function registerBuiltInTransitions(
  orchestrator: ISceneOrchestrator,
): void {
  Object.entries(builtInTransitions).forEach(([name, transition]) => {
    orchestrator.registerTransition(name, transition);
  });
}
