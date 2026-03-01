import type {
  EmitterConfig,
  GlobalState,
  IParticleEngine,
  ParticleConfig,
  ParticleEngineState,
  ParticleForce,
  ParticleKind,
  RenderParticle,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

const PARTICLE_KIND_ORDER: ParticleKind[] = [
  "sparks",
  "smoke",
  "energy",
  "custom",
];

const DEFAULT_CURSOR_EMITTER: EmitterConfig = {
  type: "energy",
  rate: 0,
  lifetime: [0.24, 0.6],
  velocity: {
    min: { x: -60, y: -50 },
    max: { x: 60, y: 50 },
  },
  size: [1.5, 3.2],
  color: {
    from: "#7dd3fc",
    to: "#22d3ee",
  },
  blendMode: "additive",
  physics: true,
};

const DEFAULT_HOVER_EMITTER: EmitterConfig = {
  type: "sparks",
  rate: 0,
  lifetime: [0.3, 0.9],
  velocity: {
    min: { x: -140, y: -120 },
    max: { x: 140, y: 120 },
  },
  size: [1.4, 4.5],
  color: {
    from: "#93c5fd",
    to: "#67e8f9",
  },
  blendMode: "additive",
  physics: true,
};

const DEFAULT_SCROLL_EMITTER: EmitterConfig = {
  type: "smoke",
  rate: 0,
  lifetime: [0.5, 1.4],
  velocity: {
    min: { x: -20, y: -50 },
    max: { x: 20, y: 20 },
  },
  size: [2.4, 6.8],
  color: {
    from: "#c7d2fe",
    to: "#93c5fd",
  },
  blendMode: "alpha",
  physics: true,
};

const DEFAULT_GRAVITY_FORCE: ParticleForce = {
  type: "gravity",
  vector: { x: 0, y: 120 },
  strength: 1,
};

const DEFAULT_WIND_FORCE: ParticleForce = {
  type: "wind",
  vector: { x: 20, y: 0 },
  strength: 1,
};

const DEFAULT_THEME_PARTICLE_COLORS = [
  "#7dd3fc",
  "#22d3ee",
  "#60a5fa",
  "#38bdf8",
];

interface ParsedColor {
  r: number;
  g: number;
  b: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

function parseHexColor(input: string): ParsedColor {
  const raw = input.trim();
  const normalized = raw.startsWith("#") ? raw.slice(1) : raw;

  if (normalized.length === 3) {
    const r = Number.parseInt(normalized[0] + normalized[0], 16);
    const g = Number.parseInt(normalized[1] + normalized[1], 16);
    const b = Number.parseInt(normalized[2] + normalized[2], 16);
    return { r, g, b };
  }

  if (normalized.length === 6) {
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return { r, g, b };
  }

  return { r: 255, g: 255, b: 255 };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function colorToCss(color: ParsedColor, alpha: number): string {
  return `rgba(${Math.round(color.r)},${Math.round(color.g)},${Math.round(color.b)},${clamp(alpha, 0, 1).toFixed(3)})`;
}

export class ParticleEngineSystem implements IParticleEngine {
  readonly id = "particle-engine";

  readonly priority = 20;

  enabled = true;

  private context: SystemContext | null = null;

  private maxParticles = 6000;

  private active = new Uint8Array(this.maxParticles);

  private x = new Float32Array(this.maxParticles);

  private y = new Float32Array(this.maxParticles);

  private vx = new Float32Array(this.maxParticles);

  private vy = new Float32Array(this.maxParticles);

  private age = new Float32Array(this.maxParticles);

  private lifetime = new Float32Array(this.maxParticles);

  private size = new Float32Array(this.maxParticles);

  private alpha = new Float32Array(this.maxParticles);

  private kindIndex = new Uint8Array(this.maxParticles);

  private blendMode = new Uint8Array(this.maxParticles);

  private colorR = new Float32Array(this.maxParticles);

  private colorG = new Float32Array(this.maxParticles);

  private colorB = new Float32Array(this.maxParticles);

  private emitCursor = 0;

  private emitHover = 0;

  private emitScroll = 0;

  private viewport = {
    width: 1920,
    height: 1080,
  };

  private emitters = new Map<string, EmitterConfig>();

  private forces = new Map<string, ParticleForce>();

  private particleTypeRegistry = new Map<string, Partial<ParticleConfig>>();

  private cursorPosition = {
    x: this.viewport.width * 0.5,
    y: this.viewport.height * 0.5,
  };

  private nextCursorTrailAt = 0;

  private activeCount = 0;

  private cursorEmitterId: string | null = null;

  private hoverEmitterId: string | null = null;

  private scrollEmitterId: string | null = null;

  private themeParticlePalette = [...DEFAULT_THEME_PARTICLE_COLORS];

  private stateSyncAt = 0;

  private state: ParticleEngineState = {
    activeParticleCount: 0,
    maxParticles: this.maxParticles,
    emitterCount: 0,
    forceCount: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    this.activeCount = 0;

    this.cursorEmitterId = this.createEmitter(DEFAULT_CURSOR_EMITTER);
    this.hoverEmitterId = this.createEmitter(DEFAULT_HOVER_EMITTER);
    this.scrollEmitterId = this.createEmitter(DEFAULT_SCROLL_EMITTER);

    this.addForce(DEFAULT_GRAVITY_FORCE);
    this.addForce(DEFAULT_WIND_FORCE);
  }

  update(deltaTime: number, state: GlobalState): void {
    void state;
    if (deltaTime <= 0) return;

    let count = 0;

    for (let i = 0; i < this.maxParticles; i += 1) {
      if (this.active[i] === 0) continue;

      const age = this.age[i] + deltaTime;
      const life = this.lifetime[i];
      if (age >= life) {
        this.deactivateParticle(i);
        continue;
      }

      this.age[i] = age;
      const lifeT = age / Math.max(life, 0.0001);

      let forceX = 0;
      let forceY = 0;

      this.forces.forEach((force) => {
        forceX += force.vector.x * force.strength;
        forceY += force.vector.y * force.strength;
        if (force.type === "turbulence") {
          forceX += randomRange(-8, 8);
          forceY += randomRange(-8, 8);
        }
      });

      this.vx[i] += forceX * deltaTime;
      this.vy[i] += forceY * deltaTime;

      this.x[i] += this.vx[i] * deltaTime;
      this.y[i] += this.vy[i] * deltaTime;

      const damping =
        this.kindIndex[i] === this.kindToIndex("smoke") ? 0.97 : 0.985;
      this.vx[i] *= damping;
      this.vy[i] *= damping;

      if (this.x[i] < 0) {
        this.x[i] = 0;
        this.vx[i] = Math.abs(this.vx[i]) * 0.65;
      } else if (this.x[i] > this.viewport.width) {
        this.x[i] = this.viewport.width;
        this.vx[i] = -Math.abs(this.vx[i]) * 0.65;
      }

      if (this.y[i] < 0) {
        this.y[i] = 0;
        this.vy[i] = Math.abs(this.vy[i]) * 0.65;
      } else if (this.y[i] > this.viewport.height) {
        this.y[i] = this.viewport.height;
        this.vy[i] = -Math.abs(this.vy[i]) * 0.62;
      }

      this.alpha[i] = clamp(1 - lifeT, 0, 1);
      count += 1;
    }

    this.activeCount = count;
    this.state.activeParticleCount = this.activeCount;
    this.state.maxParticles = this.maxParticles;
    this.state.emitterCount = this.emitters.size;
    this.state.forceCount = this.forces.size;

    const now =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    if (this.context && now - this.stateSyncAt >= 120) {
      this.stateSyncAt = now;
      this.context.setState({
        particleCount: this.activeCount,
      });
    }
  }

  dispose(): void {
    this.emitters.clear();
    this.forces.clear();
    this.particleTypeRegistry.clear();
    this.context = null;
    this.active.fill(0);
    this.activeCount = 0;
  }

  getState(): ParticleEngineState {
    return this.state;
  }

  setState(state: Partial<ParticleEngineState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "cursor-move") {
      const payload = event.payload as
        | {
            x: number;
            y: number;
            viewportWidth?: number;
            viewportHeight?: number;
          }
        | undefined;

      if (!payload) return;
      this.cursorPosition = {
        x: payload.x,
        y: payload.y,
      };

      if (payload.viewportWidth && payload.viewportHeight) {
        this.viewport = {
          width: Math.max(payload.viewportWidth, 1),
          height: Math.max(payload.viewportHeight, 1),
        };
      }

      const now = Date.now();
      if (now >= this.nextCursorTrailAt) {
        this.nextCursorTrailAt = now + 24;
        if (this.cursorEmitterId) {
          this.emit(this.cursorEmitterId, 4, this.cursorPosition);
        }
      }
      return;
    }

    if (event.type === "hover-interactive") {
      const payload = event.payload as { x: number; y: number } | undefined;
      if (!payload || !this.hoverEmitterId) return;
      this.emit(this.hoverEmitterId, 24, payload);
      return;
    }

    if (event.type === "scroll-motion") {
      const payload = event.payload as
        | { x: number; y: number; deltaY: number }
        | undefined;
      if (!payload || !this.scrollEmitterId) return;
      const intensity = clamp(Math.abs(payload.deltaY) / 120, 0.4, 3.5);
      const count = randomInt(6, 10) * intensity;
      this.emit(this.scrollEmitterId, Math.round(count), {
        x: payload.x,
        y: payload.y,
      });
      return;
    }

    if (event.type === "fluid-velocity-spike") {
      const payload = event.payload as
        | { x: number; y: number; intensity: number }
        | undefined;
      if (!payload || !this.cursorEmitterId) return;
      const count = Math.round(
        clamp(payload.intensity, 0.4, 4.2) * randomInt(5, 8),
      );
      this.emit(this.cursorEmitterId, count, { x: payload.x, y: payload.y });
      return;
    }

    if (event.type === "gesture-feedback") {
      const payload = event.payload as
        | {
            type?: string;
            x?: number;
            y?: number;
            center?: { x?: number; y?: number };
            velocity?: number;
            scale?: number;
            angle?: number;
          }
        | undefined;
      if (!payload) return;

      const center = this.resolveGestureCenter(payload);
      if (!center) return;

      const intensity =
        typeof payload.velocity === "number"
          ? clamp(payload.velocity, 0.2, 4.5)
          : typeof payload.scale === "number"
            ? clamp(Math.abs(payload.scale - 1) * 6, 0.2, 4.2)
            : typeof payload.angle === "number"
              ? clamp(Math.abs(payload.angle) / 60, 0.2, 3.4)
              : 1.1;

      const type = payload.type ?? "swipe";
      const countByType: Record<string, number> = {
        swipe: 20,
        pinch: 26,
        rotate: 22,
        longpress: 28,
      };
      const baseCount = countByType[type] ?? 20;
      const count = Math.round(baseCount * intensity);
      const fromColor = this.pickThemeColor();
      const toColor = this.pickThemeColor();

      this.burst(center, count, {
        type: type === "longpress" ? "smoke" : "energy",
        lifetime: [0.25, 0.9],
        velocity: {
          min: { x: -170, y: -170 },
          max: { x: 170, y: 170 },
        },
        size: [1.4, 4.8],
        color: {
          from: fromColor,
          to: toColor,
        },
        alpha: 1,
        blendMode: "additive",
      });
      return;
    }

    if (event.type === "theme-changed") {
      const payload = event.payload as
        | {
            theme?: {
              colors?: {
                primary?: string;
                secondary?: string;
                accent?: string;
              };
              particleColors?: string[];
            };
          }
        | undefined;

      if (!payload?.theme) return;
      const palette = payload.theme.particleColors?.filter(
        (color) => typeof color === "string" && color.length > 0,
      );
      if (palette && palette.length > 0) {
        this.applyThemePalette(palette);
        return;
      }

      const fallback = [
        payload.theme.colors?.primary,
        payload.theme.colors?.secondary,
        payload.theme.colors?.accent,
      ].filter(
        (color): color is string =>
          typeof color === "string" && color.length > 0,
      );
      if (fallback.length > 0) {
        this.applyThemePalette(fallback);
      }
      return;
    }

    if (event.type === "viewport-resize") {
      const payload = event.payload as
        | { width: number; height: number }
        | undefined;
      if (!payload) return;
      this.viewport = {
        width: Math.max(payload.width, 1),
        height: Math.max(payload.height, 1),
      };
    }
  }

  createEmitter(config: EmitterConfig): string {
    const emitterId = `emitter-${Math.random().toString(36).slice(2, 10)}`;
    this.emitters.set(emitterId, {
      ...config,
    });
    this.state.emitterCount = this.emitters.size;
    return emitterId;
  }

  removeEmitter(emitterId: string): void {
    this.emitters.delete(emitterId);
    this.state.emitterCount = this.emitters.size;
  }

  updateEmitter(emitterId: string, config: Partial<EmitterConfig>): void {
    const current = this.emitters.get(emitterId);
    if (!current) return;
    this.emitters.set(emitterId, {
      ...current,
      ...config,
      velocity: {
        ...current.velocity,
        ...config.velocity,
        min: {
          ...current.velocity.min,
          ...config.velocity?.min,
        },
        max: {
          ...current.velocity.max,
          ...config.velocity?.max,
        },
      },
      color: {
        ...current.color,
        ...config.color,
      },
    });
  }

  emit(
    emitterId: string,
    count: number,
    position: { x: number; y: number },
  ): void {
    const emitter = this.emitters.get(emitterId);
    if (!emitter) return;

    const payload: ParticleConfig = {
      type: emitter.type,
      lifetime: emitter.lifetime,
      velocity: emitter.velocity,
      size: emitter.size,
      color: emitter.color,
      alpha: 1,
      blendMode: emitter.blendMode,
    };
    this.emitParticles(position, count, payload);
  }

  burst(
    position: { x: number; y: number },
    count: number,
    config: ParticleConfig,
  ): void {
    this.emitParticles(position, count, config);
  }

  addForce(force: ParticleForce): string {
    const forceId = `force-${Math.random().toString(36).slice(2, 10)}`;
    this.forces.set(forceId, force);
    this.state.forceCount = this.forces.size;
    return forceId;
  }

  removeForce(forceId: string): void {
    this.forces.delete(forceId);
    this.state.forceCount = this.forces.size;
  }

  registerParticleType(type: string, config: Partial<ParticleConfig>): void {
    this.particleTypeRegistry.set(type, config);
  }

  setMaxParticles(max: number): void {
    const next = clamp(Math.round(max), 100, 20000);
    if (next === this.maxParticles) return;
    this.maxParticles = next;

    this.active = new Uint8Array(this.maxParticles);
    this.x = new Float32Array(this.maxParticles);
    this.y = new Float32Array(this.maxParticles);
    this.vx = new Float32Array(this.maxParticles);
    this.vy = new Float32Array(this.maxParticles);
    this.age = new Float32Array(this.maxParticles);
    this.lifetime = new Float32Array(this.maxParticles);
    this.size = new Float32Array(this.maxParticles);
    this.alpha = new Float32Array(this.maxParticles);
    this.kindIndex = new Uint8Array(this.maxParticles);
    this.blendMode = new Uint8Array(this.maxParticles);
    this.colorR = new Float32Array(this.maxParticles);
    this.colorG = new Float32Array(this.maxParticles);
    this.colorB = new Float32Array(this.maxParticles);

    this.activeCount = 0;
    this.state.maxParticles = this.maxParticles;
  }

  getActiveParticleCount(): number {
    return this.activeCount;
  }

  getActiveParticles(limit = this.activeCount): RenderParticle[] {
    const particles: RenderParticle[] = [];
    let emitted = 0;

    for (let i = 0; i < this.maxParticles; i += 1) {
      if (this.active[i] === 0) continue;

      particles.push({
        id: i,
        x: this.x[i],
        y: this.y[i],
        size: this.size[i],
        alpha: this.alpha[i],
        color: colorToCss(
          {
            r: this.colorR[i],
            g: this.colorG[i],
            b: this.colorB[i],
          },
          this.alpha[i],
        ),
        kind: PARTICLE_KIND_ORDER[this.kindIndex[i]] ?? "custom",
        blendMode: this.blendMode[i] === 1 ? "additive" : "alpha",
      });

      emitted += 1;
      if (emitted >= limit) break;
    }

    return particles;
  }

  private emitParticles(
    position: { x: number; y: number },
    count: number,
    config: ParticleConfig,
  ): void {
    if (count <= 0) return;

    const fromColor = parseHexColor(config.color.from);
    const toColor = parseHexColor(config.color.to ?? config.color.from);
    const kind = this.kindToIndex(config.type);
    const blendMode = config.blendMode === "additive" ? 1 : 0;

    for (let emitted = 0; emitted < count; emitted += 1) {
      const slot = this.findInactiveSlot();
      if (slot === -1) break;

      const lerpT = Math.random();
      this.active[slot] = 1;
      this.x[slot] = clamp(
        position.x + randomRange(-4, 4),
        0,
        this.viewport.width,
      );
      this.y[slot] = clamp(
        position.y + randomRange(-4, 4),
        0,
        this.viewport.height,
      );
      this.vx[slot] = randomRange(config.velocity.min.x, config.velocity.max.x);
      this.vy[slot] = randomRange(config.velocity.min.y, config.velocity.max.y);
      this.age[slot] = 0;
      this.lifetime[slot] = randomRange(config.lifetime[0], config.lifetime[1]);
      this.size[slot] = randomRange(config.size[0], config.size[1]);
      this.alpha[slot] = clamp(config.alpha, 0, 1);
      this.kindIndex[slot] = kind;
      this.blendMode[slot] = blendMode;
      this.colorR[slot] = lerp(fromColor.r, toColor.r, lerpT);
      this.colorG[slot] = lerp(fromColor.g, toColor.g, lerpT);
      this.colorB[slot] = lerp(fromColor.b, toColor.b, lerpT);
      this.activeCount += 1;
    }
  }

  private findInactiveSlot(): number {
    for (let i = 0; i < this.maxParticles; i += 1) {
      if (this.active[i] === 0) return i;
    }
    return -1;
  }

  private deactivateParticle(index: number): void {
    if (this.active[index] === 0) return;
    this.active[index] = 0;
    this.alpha[index] = 0;
    this.age[index] = 0;
    this.lifetime[index] = 0;
    this.activeCount = Math.max(0, this.activeCount - 1);
  }

  private kindToIndex(kind: ParticleKind): number {
    const index = PARTICLE_KIND_ORDER.indexOf(kind);
    if (index >= 0) return index;
    return PARTICLE_KIND_ORDER.indexOf("custom");
  }

  private pickThemeColor(): string {
    if (this.themeParticlePalette.length === 0) {
      return DEFAULT_THEME_PARTICLE_COLORS[
        randomInt(0, DEFAULT_THEME_PARTICLE_COLORS.length - 1)
      ];
    }
    return this.themeParticlePalette[
      randomInt(0, this.themeParticlePalette.length - 1)
    ];
  }

  private applyThemePalette(colors: string[]): void {
    this.themeParticlePalette = colors.slice(0, 8);

    const primary =
      this.themeParticlePalette[0] ?? DEFAULT_THEME_PARTICLE_COLORS[0];
    const secondary =
      this.themeParticlePalette[1] ??
      this.themeParticlePalette[0] ??
      DEFAULT_THEME_PARTICLE_COLORS[1];
    const tertiary = this.themeParticlePalette[2] ?? secondary;

    if (this.cursorEmitterId) {
      this.updateEmitter(this.cursorEmitterId, {
        color: {
          from: primary,
          to: secondary,
        },
      });
    }
    if (this.hoverEmitterId) {
      this.updateEmitter(this.hoverEmitterId, {
        color: {
          from: secondary,
          to: tertiary,
        },
      });
    }
    if (this.scrollEmitterId) {
      this.updateEmitter(this.scrollEmitterId, {
        color: {
          from: tertiary,
          to: primary,
        },
      });
    }
  }

  private resolveGestureCenter(payload: {
    x?: number;
    y?: number;
    center?: { x?: number; y?: number };
  }): { x: number; y: number } | null {
    const x = payload.center?.x ?? payload.x;
    const y = payload.center?.y ?? payload.y;
    if (typeof x !== "number" || typeof y !== "number") return null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

    return {
      x: clamp(x, 0, this.viewport.width),
      y: clamp(y, 0, this.viewport.height),
    };
  }
}
