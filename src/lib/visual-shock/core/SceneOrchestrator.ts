import type {
  CoordinatedEffect,
  GlobalState,
  ISceneOrchestrator,
  IVisualSystem,
  SceneDefinition,
  SystemContext,
  TransitionCompleteCallback,
  TransitionFunction,
  TransitionOptions,
  TransitionResult,
  Unsubscribe,
} from "@/lib/visual-shock/types";

interface SceneOrchestratorOptions {
  getState: () => GlobalState;
  setState: (partial: Partial<GlobalState>) => void;
  emitEvent: SystemContext["emitEvent"];
  preloadSceneAssets?: (sceneId: string) => Promise<void>;
}

const defaultTransition: TransitionFunction = async (
  _from,
  _to,
  options,
  signal,
) => {
  const durationMs = Math.max(0, Math.round(options.duration));
  if (durationMs === 0) return;

  await new Promise<void>((resolve, reject) => {
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
};

interface ActiveTransitionMeta {
  fromSceneId: string;
  toSceneId: string;
  type: string;
  duration: number;
  startedAt: number;
  reversed: boolean;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export class SceneOrchestrator implements ISceneOrchestrator {
  private readonly systems = new Map<string, IVisualSystem>();

  private readonly scenes = new Map<string, SceneDefinition>();

  private readonly transitions = new Map<string, TransitionFunction>();

  private readonly enterCallbacks = new Map<string, Set<() => void>>();

  private readonly exitCallbacks = new Map<string, Set<() => void>>();

  private readonly transitionCallbacks = new Set<TransitionCompleteCallback>();

  private readonly options: SceneOrchestratorOptions;

  private currentScene = "hero";

  private previousScene: string | null = null;

  private activeTransitionController: AbortController | null = null;

  private activeTransitionMeta: ActiveTransitionMeta | null = null;

  constructor(options: SceneOrchestratorOptions) {
    this.options = options;
  }

  registerSystem(system: IVisualSystem): void {
    this.systems.set(system.id, system);
  }

  unregisterSystem(systemId: string): void {
    const system = this.systems.get(systemId);
    if (!system) return;
    system.dispose();
    this.systems.delete(systemId);
  }

  getSystemById(systemId: string): IVisualSystem | null {
    return this.systems.get(systemId) ?? null;
  }

  registerScene(scene: SceneDefinition): void {
    this.scenes.set(scene.id, scene);
  }

  getCurrentScene(): string {
    return this.currentScene;
  }

  registerTransition(name: string, transition: TransitionFunction): void {
    this.transitions.set(name, transition);
  }

  async preloadScene(sceneId: string): Promise<void> {
    if (!this.scenes.has(sceneId)) {
      throw new Error(`Scene "${sceneId}" not registered`);
    }

    if (!this.options.preloadSceneAssets) return;
    await this.options.preloadSceneAssets(sceneId);
  }

  async coordinateEffect(effect: CoordinatedEffect): Promise<void> {
    const event = {
      type: "coordinated-effect",
      source: "scene-orchestrator",
      timestamp: Date.now(),
      payload: effect,
    } as const;

    this.options.emitEvent(event);
    effect.systemIds.forEach((systemId) => {
      const system = this.systems.get(systemId);
      if (!system) return;
      system.onEvent(event);
    });

    if (effect.duration <= 0) return;
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, effect.duration);
    });
  }

  onSceneEnter(sceneId: string, callback: () => void): Unsubscribe {
    const set = this.enterCallbacks.get(sceneId) ?? new Set<() => void>();
    set.add(callback);
    this.enterCallbacks.set(sceneId, set);
    return () => {
      const current = this.enterCallbacks.get(sceneId);
      if (!current) return;
      current.delete(callback);
      if (current.size === 0) {
        this.enterCallbacks.delete(sceneId);
      }
    };
  }

  onSceneExit(sceneId: string, callback: () => void): Unsubscribe {
    const set = this.exitCallbacks.get(sceneId) ?? new Set<() => void>();
    set.add(callback);
    this.exitCallbacks.set(sceneId, set);
    return () => {
      const current = this.exitCallbacks.get(sceneId);
      if (!current) return;
      current.delete(callback);
      if (current.size === 0) {
        this.exitCallbacks.delete(sceneId);
      }
    };
  }

  onTransitionComplete(callback: TransitionCompleteCallback): Unsubscribe {
    this.transitionCallbacks.add(callback);
    return () => {
      this.transitionCallbacks.delete(callback);
    };
  }

  async transitionTo(
    sceneId: string,
    options: TransitionOptions,
  ): Promise<void> {
    if (!this.scenes.has(sceneId)) {
      throw new Error(`Scene "${sceneId}" not registered`);
    }

    const targetScene = this.scenes.get(sceneId);
    if (!targetScene) return;

    if (!this.activeTransitionController && sceneId === this.currentScene) {
      return;
    }

    let reversed = this.previousScene === sceneId;
    if (
      this.activeTransitionMeta &&
      this.activeTransitionMeta.fromSceneId === sceneId
    ) {
      reversed = true;
    }

    if (this.activeTransitionController && this.activeTransitionMeta) {
      const interrupted = this.activeTransitionMeta;
      this.activeTransitionController.abort();
      this.emitTransitionEvent("transition-interrupted", {
        fromSceneId: interrupted.fromSceneId,
        toSceneId: interrupted.toSceneId,
        type: interrupted.type,
        duration: interrupted.duration,
        startedAt: interrupted.startedAt,
        interruptedAt: Date.now(),
      });
      this.notifyTransitionComplete({
        fromSceneId: interrupted.fromSceneId,
        toSceneId: interrupted.toSceneId,
        type: interrupted.type,
        duration: interrupted.duration,
        startedAt: interrupted.startedAt,
        completedAt: Date.now(),
        interrupted: true,
        reversed: interrupted.reversed,
      });
    }

    if (this.activeTransitionController && !this.activeTransitionMeta) {
      this.activeTransitionController.abort();
    }

    const fromScene = this.currentScene;
    const effectiveOptions: TransitionOptions = {
      ...options,
      duration: Math.max(
        0,
        Math.round(reversed ? options.duration * 0.72 : options.duration),
      ),
    };
    const transition =
      this.transitions.get(effectiveOptions.type) ?? defaultTransition;
    const controller = new AbortController();
    const startedAt = Date.now();
    this.activeTransitionController = controller;
    this.activeTransitionMeta = {
      fromSceneId: fromScene,
      toSceneId: sceneId,
      type: effectiveOptions.type,
      duration: effectiveOptions.duration,
      startedAt,
      reversed,
    };

    this.options.setState({ transitioning: true });
    this.emitSceneCallbacks(this.exitCallbacks.get(fromScene));
    await this.preloadSceneForTransition(sceneId, controller.signal);

    this.emitTransitionEvent("transition-start", {
      fromSceneId: fromScene,
      toSceneId: sceneId,
      type: effectiveOptions.type,
      duration: effectiveOptions.duration,
      reversed,
      startedAt,
      easing: effectiveOptions.easing,
    });

    if (effectiveOptions.cameraAnimation) {
      this.emitTransitionEvent("transition-camera-animation", {
        fromSceneId: fromScene,
        toSceneId: sceneId,
        cameraAnimation: effectiveOptions.cameraAnimation,
      });
    }

    if (effectiveOptions.audioFade) {
      this.emitTransitionEvent("audio-crossfade-start", {
        fromSceneId: fromScene,
        toSceneId: sceneId,
        duration: effectiveOptions.duration,
      });
    }

    let completed = false;

    try {
      await transition(fromScene, sceneId, effectiveOptions, controller.signal);
      if (controller.signal.aborted) return;

      this.previousScene = fromScene;
      this.currentScene = sceneId;
      this.options.setState({
        currentScene: sceneId,
        theme: targetScene.theme ?? this.options.getState().theme,
      });

      this.syncSystemActivation(targetScene.systems);
      this.emitSceneCallbacks(this.enterCallbacks.get(sceneId));
      completed = true;

      if (effectiveOptions.audioFade) {
        this.emitTransitionEvent("audio-crossfade-complete", {
          fromSceneId: fromScene,
          toSceneId: sceneId,
          duration: effectiveOptions.duration,
        });
      }
    } catch (error) {
      if (!controller.signal.aborted && !isAbortError(error)) {
        throw error;
      }
    } finally {
      if (this.activeTransitionController === controller) {
        this.activeTransitionController = null;
        this.activeTransitionMeta = null;
        this.options.setState({ transitioning: false });
      }

      const result: TransitionResult = {
        fromSceneId: fromScene,
        toSceneId: sceneId,
        type: effectiveOptions.type,
        duration: effectiveOptions.duration,
        startedAt,
        completedAt: Date.now(),
        interrupted: !completed,
        reversed,
      };

      if (completed) {
        this.notifyTransitionComplete(result);
      }

      this.emitTransitionEvent("transition-end", result);
    }
  }

  update(deltaTime: number): void {
    const state = this.options.getState();
    const systems = Array.from(this.systems.values()).sort(
      (a, b) => a.priority - b.priority,
    );

    systems.forEach((system) => {
      if (!system.enabled) return;
      system.update(deltaTime, state);
    });
  }

  private syncSystemActivation(activeSystemIds: string[]): void {
    const activeSet = new Set(activeSystemIds);
    this.systems.forEach((system) => {
      system.enabled = activeSet.has(system.id);
    });
  }

  private emitSceneCallbacks(callbacks?: Set<() => void>): void {
    if (!callbacks) return;
    callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("[SceneOrchestrator] scene callback failed", error);
      }
    });
  }

  private notifyTransitionComplete(result: TransitionResult): void {
    this.transitionCallbacks.forEach((callback) => {
      try {
        callback(result);
      } catch (error) {
        console.error("[SceneOrchestrator] transition callback failed", error);
      }
    });

    this.emitTransitionEvent("transition-complete", result);
  }

  private async preloadSceneForTransition(
    sceneId: string,
    signal: AbortSignal,
  ): Promise<void> {
    if (!this.options.preloadSceneAssets) return;
    this.emitTransitionEvent("scene-preload-start", {
      sceneId,
    });

    try {
      await this.preloadScene(sceneId);
      if (signal.aborted) return;
      this.emitTransitionEvent("scene-preload-complete", {
        sceneId,
      });
    } catch (error) {
      this.emitTransitionEvent("scene-preload-failed", {
        sceneId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private emitTransitionEvent(
    type: string,
    payload: Record<string, unknown> | TransitionResult,
  ): void {
    this.options.emitEvent({
      type,
      source: "scene-orchestrator",
      timestamp: Date.now(),
      payload,
    });
  }
}
