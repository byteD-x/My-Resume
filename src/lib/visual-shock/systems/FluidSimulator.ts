import type {
  FluidColor,
  FluidPoint,
  FluidRenderMode,
  FluidSimulatorState,
  GlobalState,
  IFluidSimulator,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

interface FluidInteractionPayload {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius?: number;
  color?: FluidColor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function normalizeColor(color: FluidColor): FluidColor {
  return {
    r: clamp(color.r, 0, 1),
    g: clamp(color.g, 0, 1),
    b: clamp(color.b, 0, 1),
  };
}

function mixColor(a: FluidColor, b: FluidColor, ratio: number): FluidColor {
  const t = clamp(ratio, 0, 1);
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

const DEFAULT_DYE_COLOR: FluidColor = {
  r: 0.35,
  g: 0.78,
  b: 1,
};

function hexToFluidColor(color: string): FluidColor {
  const value = color.startsWith("#") ? color.slice(1) : color;
  if (value.length === 3) {
    return normalizeColor({
      r: Number.parseInt(value[0] + value[0], 16) / 255,
      g: Number.parseInt(value[1] + value[1], 16) / 255,
      b: Number.parseInt(value[2] + value[2], 16) / 255,
    });
  }
  if (value.length === 6) {
    return normalizeColor({
      r: Number.parseInt(value.slice(0, 2), 16) / 255,
      g: Number.parseInt(value.slice(2, 4), 16) / 255,
      b: Number.parseInt(value.slice(4, 6), 16) / 255,
    });
  }
  return DEFAULT_DYE_COLOR;
}

export class FluidSimulatorSystem implements IFluidSimulator {
  readonly id = "fluid-simulator";

  readonly priority = 25;

  enabled = true;

  private context: SystemContext | null = null;

  private disturbances: FluidPoint[] = [];

  private emitCounter = 0;

  private lastVelocityEmitAt = 0;

  private themeDyeColor: FluidColor = {
    ...DEFAULT_DYE_COLOR,
  };

  private state: FluidSimulatorState = {
    viscosity: 0.6,
    density: 0.75,
    resolution: {
      width: 512,
      height: 512,
    },
    renderMode: "dye",
    activeDisturbances: 0,
    iterations: 18,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
  }

  update(deltaTime: number, globalState: GlobalState): void {
    void globalState;
    if (deltaTime <= 0 || this.disturbances.length === 0) {
      this.state.activeDisturbances = this.disturbances.length;
      return;
    }

    const damping = clamp(
      1 - this.state.viscosity * deltaTime * 0.9,
      0.84,
      0.995,
    );
    const fade = clamp(
      1 - deltaTime * (0.45 + (1 - this.state.density) * 0.35),
      0.72,
      0.995,
    );
    const width = this.state.resolution.width;
    const height = this.state.resolution.height;
    const now = Date.now();

    const next: FluidPoint[] = [];
    for (let i = 0; i < this.disturbances.length; i += 1) {
      const point = this.disturbances[i];
      const age = point.age + deltaTime;
      if (age >= point.lifetime) continue;

      let vx = point.vx * damping;
      let vy = point.vy * damping;
      let x = point.x + vx * deltaTime;
      let y = point.y + vy * deltaTime;

      if (x < 0) {
        x = 0;
        vx = Math.abs(vx) * 0.72;
      } else if (x > width) {
        x = width;
        vx = -Math.abs(vx) * 0.72;
      }

      if (y < 0) {
        y = 0;
        vy = Math.abs(vy) * 0.72;
      } else if (y > height) {
        y = height;
        vy = -Math.abs(vy) * 0.72;
      }

      const intensity = clamp(point.intensity * fade, 0, 1.5);
      const radius = clamp(
        point.radius * (0.997 + this.state.density * 0.003),
        10,
        280,
      );
      const updated: FluidPoint = {
        ...point,
        x,
        y,
        vx,
        vy,
        radius,
        age,
        intensity,
      };

      const velocity = Math.hypot(vx, vy);
      if (
        velocity >= 220 &&
        now - this.lastVelocityEmitAt >= 42 &&
        this.context
      ) {
        this.lastVelocityEmitAt = now;
        this.context.emitEvent({
          type: "fluid-velocity-spike",
          source: this.id,
          timestamp: now,
          payload: {
            x: updated.x,
            y: updated.y,
            intensity: clamp(velocity / 280, 0.2, 3.2),
          },
        });
      }

      if (updated.intensity > 0.02) {
        next.push(updated);
      }
    }

    this.disturbances = this.mergeNearbyDisturbances(next);
    this.state.activeDisturbances = this.disturbances.length;
  }

  dispose(): void {
    this.context = null;
    this.disturbances = [];
  }

  getState(): FluidSimulatorState {
    return this.state;
  }

  setState(state: Partial<FluidSimulatorState>): void {
    this.state = {
      ...this.state,
      ...state,
      resolution: {
        ...this.state.resolution,
        ...state.resolution,
      },
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "fluid-interaction") {
      const payload = event.payload as FluidInteractionPayload | undefined;
      if (!payload) return;

      const radius = clamp(payload.radius ?? 42, 12, 220);
      this.addForce(payload.x, payload.y, payload.dx, payload.dy, radius);
      this.addDye(
        payload.x,
        payload.y,
        payload.color ?? this.themeDyeColor,
        radius,
      );
      return;
    }

    if (event.type === "viewport-resize") {
      const payload = event.payload as
        | { width: number; height: number }
        | undefined;
      if (!payload) return;
      this.setResolution(payload.width, payload.height);
      return;
    }

    if (event.type === "theme-changed") {
      const payload = event.payload as
        | {
            theme?: {
              colors?: {
                primary?: string;
              };
            };
          }
        | undefined;
      const primary = payload?.theme?.colors?.primary;
      if (!primary) return;
      this.themeDyeColor = hexToFluidColor(primary);
    }
  }

  setViscosity(value: number): void {
    this.state.viscosity = clamp(value, 0, 2.5);
  }

  setDensity(value: number): void {
    this.state.density = clamp(value, 0.1, 2.2);
  }

  setResolution(width: number, height: number): void {
    this.state.resolution = {
      width: clamp(Math.round(width), 64, 4096),
      height: clamp(Math.round(height), 64, 4096),
    };
  }

  addForce(x: number, y: number, dx: number, dy: number, radius: number): void {
    const point = this.findNearbyPoint(x, y, radius * 0.7);
    if (point) {
      point.vx = clamp(point.vx + dx, -560, 560);
      point.vy = clamp(point.vy + dy, -560, 560);
      point.radius = clamp((point.radius + radius) * 0.5, 10, 260);
      point.intensity = clamp(
        point.intensity + Math.hypot(dx, dy) / 260,
        0,
        1.6,
      );
      return;
    }

    const now = Date.now();
    this.disturbances.push({
      id: `force-${this.emitCounter++}`,
      x: clamp(x, 0, this.state.resolution.width),
      y: clamp(y, 0, this.state.resolution.height),
      vx: clamp(dx, -600, 600),
      vy: clamp(dy, -600, 600),
      radius: clamp(radius, 10, 260),
      age: 0,
      lifetime: clamp(1.2 + this.state.density * 0.8, 0.6, 4),
      color: DEFAULT_DYE_COLOR,
      intensity: clamp(Math.hypot(dx, dy) / 220, 0.2, 1.4),
    });

    if (this.context) {
      this.context.emitEvent({
        type: "fluid-force-added",
        source: this.id,
        timestamp: now,
        payload: { x, y, dx, dy, radius },
      });
    }
  }

  addDye(x: number, y: number, color: FluidColor, radius: number): void {
    const normalized = normalizeColor(color);
    const point = this.findNearbyPoint(x, y, radius * 0.6);
    if (point) {
      point.color = mixColor(point.color, normalized, 0.45);
      point.radius = clamp((point.radius + radius) * 0.5, 10, 260);
      point.intensity = clamp(point.intensity + 0.22, 0, 1.6);
      return;
    }

    this.disturbances.push({
      id: `dye-${this.emitCounter++}`,
      x: clamp(x, 0, this.state.resolution.width),
      y: clamp(y, 0, this.state.resolution.height),
      vx: 0,
      vy: 0,
      radius: clamp(radius, 10, 260),
      age: 0,
      lifetime: clamp(1.4 + this.state.density * 1.1, 0.6, 4.4),
      color: normalized,
      intensity: 0.95,
    });
  }

  getRenderTarget(): unknown {
    return null;
  }

  setRenderMode(mode: FluidRenderMode): void {
    this.state.renderMode = mode;
  }

  setIterations(count: number): void {
    this.state.iterations = clamp(Math.round(count), 4, 60);
  }

  reset(): void {
    this.disturbances = [];
    this.state.activeDisturbances = 0;
  }

  getRenderPoints(limit = 120): FluidPoint[] {
    return this.disturbances.slice(0, limit).map((point) => ({
      ...point,
      color: {
        ...point.color,
      },
    }));
  }

  private findNearbyPoint(
    x: number,
    y: number,
    radius: number,
  ): FluidPoint | null {
    const threshold = radius * radius;
    for (let i = 0; i < this.disturbances.length; i += 1) {
      const point = this.disturbances[i];
      if (distanceSq(point.x, point.y, x, y) <= threshold) {
        return point;
      }
    }
    return null;
  }

  private mergeNearbyDisturbances(points: FluidPoint[]): FluidPoint[] {
    if (points.length < 2) return points;

    const merged: FluidPoint[] = [];
    const consumed = new Uint8Array(points.length);

    for (let i = 0; i < points.length; i += 1) {
      if (consumed[i] === 1) continue;
      let base = points[i];

      for (let j = i + 1; j < points.length; j += 1) {
        if (consumed[j] === 1) continue;
        const target = points[j];
        const threshold = Math.min(base.radius, target.radius) * 0.45;
        if (
          distanceSq(base.x, base.y, target.x, target.y) >
          threshold * threshold
        )
          continue;

        consumed[j] = 1;
        base = {
          ...base,
          x: (base.x + target.x) * 0.5,
          y: (base.y + target.y) * 0.5,
          vx: (base.vx + target.vx) * 0.5,
          vy: (base.vy + target.vy) * 0.5,
          radius: clamp((base.radius + target.radius) * 0.55, 10, 280),
          color: mixColor(base.color, target.color, 0.5),
          intensity: clamp(base.intensity + target.intensity * 0.4, 0, 1.6),
        };
      }

      merged.push(base);
    }

    return merged;
  }
}
