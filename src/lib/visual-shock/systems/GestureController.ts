import type {
  GestureControllerState,
  GlobalState,
  IGestureController,
  Point,
  SwipeDirection,
  SystemContext,
  SystemEvent,
  TouchPoint,
  Unsubscribe,
} from "@/lib/visual-shock/types";
import {
  angleToEightDirection,
  isIntentionalSwipe,
} from "@/lib/visual-shock/utils/gesture";

type HammerModule = HammerStatic;

interface GestureControllerOptions {
  getRootElement?: () => HTMLElement | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export class GestureControllerSystem implements IGestureController {
  readonly id = "gesture-controller";

  readonly priority = 40;

  enabled = true;

  private context: SystemContext | null = null;

  private options: GestureControllerOptions;

  private manager: HammerManager | null = null;

  private hammerModule: HammerModule | null = null;

  private rootElement: HTMLElement | null = null;

  private activeTouches = new Map<number, TouchPoint>();

  private lastGestureAt = new Map<string, number>();

  private cleanupFns: Array<() => void> = [];

  private swipeCallbacks = new Set<
    (direction: SwipeDirection, velocity: number) => void
  >();

  private pinchCallbacks = new Set<(scale: number, center: Point) => void>();

  private rotateCallbacks = new Set<(angle: number, center: Point) => void>();

  private longPressCallbacks = new Set<
    (position: Point, duration: number) => void
  >();

  private state: GestureControllerState = {
    swipeThreshold: 48,
    pinchThreshold: 0.06,
    longPressDuration: 500,
    activeTouches: [],
  };

  constructor(options: GestureControllerOptions = {}) {
    this.options = options;
  }

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    if (typeof window === "undefined") return;

    this.rootElement = this.options.getRootElement?.() ?? document.body;
    if (!this.rootElement) return;

    const moduleRef = await import("hammerjs");
    const Hammer = (moduleRef.default ?? moduleRef) as unknown as HammerModule;
    this.hammerModule = Hammer;

    const manager = new Hammer.Manager(this.rootElement);
    this.manager = manager;

    const pan = new Hammer.Pan({
      direction: Hammer.DIRECTION_ALL,
      threshold: 8,
      pointers: 1,
    });
    const swipe = new Hammer.Swipe({
      direction: Hammer.DIRECTION_ALL,
      threshold: this.state.swipeThreshold,
      velocity: 0.15,
      pointers: 1,
    });
    const pinch = new Hammer.Pinch({
      threshold: this.state.pinchThreshold,
      pointers: 2,
    });
    const rotate = new Hammer.Rotate({
      threshold: 0,
      pointers: 2,
    });
    const press = new Hammer.Press({
      time: this.state.longPressDuration,
      threshold: 9,
      pointers: 1,
    });

    pinch.recognizeWith(rotate);
    manager.add([pan, swipe, pinch, rotate, press]);

    const onSwipe = (event: HammerInput) => {
      const distance = Math.hypot(event.deltaX, event.deltaY);
      const velocity = Math.max(
        Math.abs(event.velocityX),
        Math.abs(event.velocityY),
      );
      if (!isIntentionalSwipe(distance, velocity, this.state.swipeThreshold))
        return;
      if (!this.canEmit("swipe", 40)) return;

      const direction = angleToEightDirection(event.angle);
      this.swipeCallbacks.forEach((callback) => callback(direction, velocity));
      this.emitFeedback("swipe", {
        direction,
        velocity,
        x: event.center.x,
        y: event.center.y,
      });
    };

    const onPinch = (event: HammerInput) => {
      const scaleDelta = Math.abs(1 - event.scale);
      if (scaleDelta < this.state.pinchThreshold) return;
      if (!this.canEmit("pinch", 25)) return;

      const center = {
        x: event.center.x,
        y: event.center.y,
      };
      this.pinchCallbacks.forEach((callback) => callback(event.scale, center));
      this.emitFeedback("pinch", {
        scale: event.scale,
        center,
      });
    };

    const onRotate = (event: HammerInput) => {
      if (Math.abs(event.rotation) < 2) return;
      if (!this.canEmit("rotate", 25)) return;

      const center = {
        x: event.center.x,
        y: event.center.y,
      };
      this.rotateCallbacks.forEach((callback) =>
        callback(event.rotation, center),
      );
      this.emitFeedback("rotate", {
        angle: event.rotation,
        center,
      });
    };

    const onPress = (event: HammerInput) => {
      if (!this.canEmit("longpress", 120)) return;

      const position = {
        x: event.center.x,
        y: event.center.y,
      };
      this.longPressCallbacks.forEach((callback) =>
        callback(position, this.state.longPressDuration),
      );
      this.emitFeedback("longpress", {
        duration: this.state.longPressDuration,
        position,
      });
    };

    manager.on("swipe", onSwipe);
    manager.on("pinchmove pinchin pinchout", onPinch);
    manager.on("rotatemove rotate", onRotate);
    manager.on("press", onPress);

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary && this.activeTouches.size >= 5) return;
      this.activeTouches.set(event.pointerId, {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      });
      this.syncTouchState();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!this.activeTouches.has(event.pointerId)) return;
      this.activeTouches.set(event.pointerId, {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      });
      this.syncTouchState();
    };

    const onPointerEnd = (event: PointerEvent) => {
      this.activeTouches.delete(event.pointerId);
      this.syncTouchState();
    };

    this.rootElement.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });
    this.rootElement.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    this.rootElement.addEventListener("pointerup", onPointerEnd, {
      passive: true,
    });
    this.rootElement.addEventListener("pointercancel", onPointerEnd, {
      passive: true,
    });
    this.rootElement.addEventListener("pointerleave", onPointerEnd, {
      passive: true,
    });

    this.cleanupFns.push(() => {
      manager.off("swipe", onSwipe);
      manager.off("pinchmove pinchin pinchout", onPinch);
      manager.off("rotatemove rotate", onRotate);
      manager.off("press", onPress);
      manager.destroy();
      this.manager = null;
    });

    this.cleanupFns.push(() => {
      if (!this.rootElement) return;
      this.rootElement.removeEventListener("pointerdown", onPointerDown);
      this.rootElement.removeEventListener("pointermove", onPointerMove);
      this.rootElement.removeEventListener("pointerup", onPointerEnd);
      this.rootElement.removeEventListener("pointercancel", onPointerEnd);
      this.rootElement.removeEventListener("pointerleave", onPointerEnd);
    });
  }

  update(deltaTime: number, state: GlobalState): void {
    void deltaTime;
    void state;
  }

  dispose(): void {
    this.cleanupFns.forEach((cleanup) => cleanup());
    this.cleanupFns = [];
    this.activeTouches.clear();
    this.state.activeTouches = [];
    this.context = null;
    this.manager = null;
    this.rootElement = null;
    this.lastGestureAt.clear();
  }

  getState(): GestureControllerState {
    return this.state;
  }

  setState(state: Partial<GestureControllerState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "gesture-config-update") {
      const payload = event.payload as
        | {
            swipeThreshold?: number;
            pinchThreshold?: number;
            longPressDuration?: number;
          }
        | undefined;
      if (!payload) return;

      if (typeof payload.swipeThreshold === "number") {
        this.setSwipeThreshold(payload.swipeThreshold);
      }
      if (typeof payload.pinchThreshold === "number") {
        this.setPinchThreshold(payload.pinchThreshold);
      }
      if (typeof payload.longPressDuration === "number") {
        this.setLongPressDuration(payload.longPressDuration);
      }
    }
  }

  onSwipe(
    callback: (direction: SwipeDirection, velocity: number) => void,
  ): Unsubscribe {
    this.swipeCallbacks.add(callback);
    return () => this.swipeCallbacks.delete(callback);
  }

  onPinch(callback: (scale: number, center: Point) => void): Unsubscribe {
    this.pinchCallbacks.add(callback);
    return () => this.pinchCallbacks.delete(callback);
  }

  onRotate(callback: (angle: number, center: Point) => void): Unsubscribe {
    this.rotateCallbacks.add(callback);
    return () => this.rotateCallbacks.delete(callback);
  }

  onLongPress(
    callback: (position: Point, duration: number) => void,
  ): Unsubscribe {
    this.longPressCallbacks.add(callback);
    return () => this.longPressCallbacks.delete(callback);
  }

  setSwipeThreshold(pixels: number): void {
    this.state.swipeThreshold = clamp(pixels, 16, 240);
  }

  setPinchThreshold(scale: number): void {
    this.state.pinchThreshold = clamp(scale, 0.01, 0.6);
  }

  setLongPressDuration(ms: number): void {
    this.state.longPressDuration = clamp(ms, 200, 2000);
  }

  getActiveTouches(): TouchPoint[] {
    return this.state.activeTouches;
  }

  getTouchCount(): number {
    return this.state.activeTouches.length;
  }

  private canEmit(type: string, debounceMs: number): boolean {
    const now = Date.now();
    const previous = this.lastGestureAt.get(type) ?? 0;
    if (now - previous < debounceMs) return false;
    this.lastGestureAt.set(type, now);
    return true;
  }

  private syncTouchState(): void {
    const touches = Array.from(this.activeTouches.values()).slice(0, 5);
    this.state.activeTouches = touches;
  }

  private emitFeedback(type: string, payload: Record<string, unknown>): void {
    if (!this.context) return;
    this.context.emitEvent({
      type: "gesture-feedback",
      source: this.id,
      timestamp: Date.now(),
      payload: {
        type,
        ...payload,
      },
    });
  }
}
