import type {
  GlobalState,
  IScrollController,
  ScrollControllerState,
  SystemContext,
  SystemEvent,
  Unsubscribe,
} from "@/lib/visual-shock/types";

interface ParallaxLayer {
  id: string;
  element: HTMLElement;
  speed: number;
  depth: number;
  axis: "vertical" | "horizontal" | "both";
}

interface ScrollTrigger {
  id: string;
  position: number;
  callback: () => void;
  fired: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export class ScrollControllerSystem implements IScrollController {
  readonly id = "scroll-controller";

  readonly priority = 45;

  enabled = true;

  private context: SystemContext | null = null;

  private layers = new Map<string, ParallaxLayer>();

  private triggers = new Map<string, ScrollTrigger>();

  private scrollTarget = {
    x: 0,
    y: 0,
  };

  private scrollCurrent = {
    x: 0,
    y: 0,
  };

  private revealObserver: IntersectionObserver | null = null;

  private wheelListenerBound = false;

  private wheelListener: ((event: WheelEvent) => void) | null = null;

  private wheelRafId = 0;

  private wheelDeltaY = 0;

  private cleanupFns: Array<() => void> = [];

  private state: ScrollControllerState = {
    scrollY: 0,
    scrollX: 0,
    scrollJackingEnabled: false,
    parallaxLayerCount: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    if (typeof window === "undefined") return;

    this.scrollTarget = {
      x: window.scrollX,
      y: window.scrollY,
    };
    this.scrollCurrent = {
      ...this.scrollTarget,
    };

    const onScroll = () => {
      this.scrollTarget.y = window.scrollY;
      this.scrollTarget.x = window.scrollX;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener("scroll", onScroll));

    this.setupRevealObserver();
  }

  update(deltaTime: number, state: GlobalState): void {
    void state;
    const easing = clamp(deltaTime * 7.2, 0, 1);
    const eased = easeOutCubic(easing);
    this.scrollCurrent.x +=
      (this.scrollTarget.x - this.scrollCurrent.x) * eased;
    this.scrollCurrent.y +=
      (this.scrollTarget.y - this.scrollCurrent.y) * eased;

    this.state.scrollX = this.scrollCurrent.x;
    this.state.scrollY = this.scrollCurrent.y;

    this.layers.forEach((layer) => {
      const tx =
        layer.axis === "horizontal" || layer.axis === "both"
          ? -this.scrollCurrent.x * layer.speed
          : 0;
      const ty =
        layer.axis === "vertical" || layer.axis === "both"
          ? -this.scrollCurrent.y * layer.speed
          : 0;
      const perspectiveScale = 1 + layer.depth * 0.012;
      layer.element.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${perspectiveScale.toFixed(4)})`;
      layer.element.style.transformStyle = "preserve-3d";
      layer.element.style.willChange = "transform";
    });

    this.triggers.forEach((trigger) => {
      if (trigger.fired && this.scrollCurrent.y >= trigger.position) return;
      if (this.scrollCurrent.y >= trigger.position) {
        trigger.fired = true;
        try {
          trigger.callback();
        } catch (error) {
          console.error(
            "[ScrollController] scroll trigger callback failed",
            error,
          );
        }
        return;
      }

      if (trigger.fired && this.scrollCurrent.y < trigger.position * 0.7) {
        trigger.fired = false;
      }
    });
  }

  dispose(): void {
    this.cleanupFns.forEach((cleanup) => cleanup());
    this.cleanupFns = [];
    this.layers.clear();
    this.triggers.clear();
    this.teardownRevealObserver();
    this.detachWheelListener();
    this.context = null;
  }

  getState(): ScrollControllerState {
    return this.state;
  }

  setState(state: Partial<ScrollControllerState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "viewport-resize") {
      this.setupRevealObserver();
    }
  }

  addParallaxLayer(
    element: HTMLElement,
    speed: number,
    depth: number,
    axis: "vertical" | "horizontal" | "both" = "vertical",
  ): string {
    const id = `parallax-${Math.random().toString(36).slice(2, 10)}`;
    this.layers.set(id, {
      id,
      element,
      speed: clamp(speed, -1, 1),
      depth: clamp(depth, -10, 10),
      axis,
    });
    this.state.parallaxLayerCount = this.layers.size;
    return id;
  }

  removeParallaxLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.element.style.transform = "";
    }
    this.layers.delete(layerId);
    this.state.parallaxLayerCount = this.layers.size;
  }

  onScrollTrigger(position: number, callback: () => void): Unsubscribe {
    const id = `trigger-${Math.random().toString(36).slice(2, 10)}`;
    this.triggers.set(id, {
      id,
      position: Math.max(0, position),
      callback,
      fired: false,
    });

    return () => {
      this.triggers.delete(id);
    };
  }

  enableScrollJacking(enabled: boolean): void {
    this.state.scrollJackingEnabled = enabled;
    if (enabled) {
      this.attachWheelListener();
      return;
    }
    this.detachWheelListener();
  }

  private setupRevealObserver(): void {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    this.teardownRevealObserver();
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("vs-reveal-visible");
          } else {
            target.classList.remove("vs-reveal-visible");
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    const revealTargets =
      document.querySelectorAll<HTMLElement>("[data-vs-reveal]");
    revealTargets.forEach((target) => {
      const order = Number(target.dataset.vsRevealOrder ?? "0");
      target.style.transitionDelay = `${Math.max(0, order) * 80}ms`;
      target.classList.add("vs-reveal-base");
      this.revealObserver?.observe(target);
    });
  }

  private teardownRevealObserver(): void {
    if (!this.revealObserver) return;
    this.revealObserver.disconnect();
    this.revealObserver = null;
  }

  private attachWheelListener(): void {
    if (typeof window === "undefined" || this.wheelListenerBound) return;
    const onWheel = (event: WheelEvent) => {
      if (!this.state.scrollJackingEnabled) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

      event.preventDefault();
      this.wheelDeltaY += event.deltaY * 0.9;
      if (this.wheelRafId !== 0) return;
      this.wheelRafId = window.requestAnimationFrame(() => {
        this.wheelRafId = 0;
        const maxScrollY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const nextY = clamp(
          this.scrollTarget.y + this.wheelDeltaY,
          0,
          maxScrollY,
        );
        this.wheelDeltaY = 0;
        this.scrollTarget.y = nextY;
        window.scrollTo({
          top: nextY,
          behavior: "auto",
        });
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    this.wheelListener = onWheel;
    this.wheelListenerBound = true;
  }

  private detachWheelListener(): void {
    if (!this.wheelListenerBound || typeof window === "undefined") return;
    if (this.wheelListener) {
      window.removeEventListener("wheel", this.wheelListener);
    }
    if (this.wheelRafId !== 0) {
      window.cancelAnimationFrame(this.wheelRafId);
    }
    this.wheelListener = null;
    this.wheelRafId = 0;
    this.wheelDeltaY = 0;
    this.wheelListenerBound = false;
  }
}
