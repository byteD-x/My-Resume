import type {
  GlobalState,
  IPhysicsEngine,
  MagneticFieldConfig,
  PhysicsBodySnapshot,
  PhysicsEngineState,
  PhysicsVector2,
  RigidBodyConfig,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

interface PhysicsBodyInternal extends PhysicsBodySnapshot {
  friction: number;
  restitution: number;
  lastValidPosition: PhysicsVector2;
  lastValidVelocity: PhysicsVector2;
}

interface MagneticFieldInternal {
  id: string;
  position: PhysicsVector2;
  radius: number;
  strength: number;
  mode: "attract" | "repel";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && !Number.isNaN(value);
}

function isFiniteVector(vector: PhysicsVector2): boolean {
  return isFiniteNumber(vector.x) && isFiniteNumber(vector.y);
}

function createBodyId(): string {
  return `body-${Math.random().toString(36).slice(2, 10)}`;
}

function createFieldId(): string {
  return `field-${Math.random().toString(36).slice(2, 10)}`;
}

export class PhysicsEngineSystem implements IPhysicsEngine {
  readonly id = "physics-engine";

  readonly priority = 35;

  enabled = true;

  private context: SystemContext | null = null;

  private bodies = new Map<string, PhysicsBodyInternal>();

  private magneticFields = new Map<string, MagneticFieldInternal>();

  private viewport = {
    width: 1920,
    height: 1080,
  };

  private defaultCursorFieldId: string | null = null;

  private warningAt = 0;

  private state: PhysicsEngineState = {
    bodyCount: 0,
    magneticFieldCount: 0,
    gravity: {
      x: 0,
      y: 180,
    },
    errorCount: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    if (typeof window !== "undefined") {
      this.viewport.width = Math.max(320, Math.round(window.innerWidth));
      this.viewport.height = Math.max(320, Math.round(window.innerHeight));
    }

    // Default cursor-following magnetic field for interaction wiring.
    this.defaultCursorFieldId = this.createMagneticField({
      position: {
        x: this.viewport.width * 0.5,
        y: this.viewport.height * 0.45,
      },
      radius: 220,
      strength: 62_000,
      mode: "attract",
    });

    // Seed bodies so magnetic interactions work without extra setup.
    for (let i = 0; i < 6; i += 1) {
      this.createRigidBody({
        type: "dynamic",
        position: {
          x: 220 + i * 140,
          y: 220 + (i % 2) * 80,
        },
        velocity: {
          x: (i % 2 === 0 ? 1 : -1) * 30,
          y: 10,
        },
        mass: 1.2 + (i % 3) * 0.25,
        radius: 20 + (i % 3) * 5,
        friction: 0.15,
        restitution: 0.68,
      });
    }

    this.syncState();
  }

  update(deltaTime: number, state: GlobalState): void {
    void state;
    if (deltaTime <= 0 || this.bodies.size === 0) return;

    const dt = clamp(deltaTime, 0.001, 0.033);
    this.bodies.forEach((body) => {
      if (body.type !== "dynamic") return;

      let forceX = this.state.gravity.x * body.mass;
      let forceY = this.state.gravity.y * body.mass;

      this.magneticFields.forEach((field) => {
        const dx = field.position.x - body.position.x;
        const dy = field.position.y - body.position.y;
        const distSq = Math.max(dx * dx + dy * dy, 64);
        const dist = Math.sqrt(distSq);
        if (dist > field.radius) return;

        const strength = clamp(field.strength / distSq, -1800, 1800);
        const dirX = dx / Math.max(dist, 0.0001);
        const dirY = dy / Math.max(dist, 0.0001);
        const sign = field.mode === "attract" ? 1 : -1;
        forceX += dirX * strength * sign;
        forceY += dirY * strength * sign;
      });

      body.velocity.x += (forceX / Math.max(body.mass, 0.001)) * dt;
      body.velocity.y += (forceY / Math.max(body.mass, 0.001)) * dt;

      const damping = clamp(1 - body.friction * dt * 6, 0.82, 0.999);
      body.velocity.x *= damping;
      body.velocity.y *= damping;

      body.velocity.x = clamp(body.velocity.x, -2800, 2800);
      body.velocity.y = clamp(body.velocity.y, -2800, 2800);

      body.position.x += body.velocity.x * dt;
      body.position.y += body.velocity.y * dt;

      this.applyBoundaryCollision(body);
      this.recoverInvalidStateIfNeeded(body);
    });
  }

  dispose(): void {
    this.bodies.clear();
    this.magneticFields.clear();
    this.defaultCursorFieldId = null;
    this.context = null;
  }

  getState(): PhysicsEngineState {
    return this.state;
  }

  setState(state: Partial<PhysicsEngineState>): void {
    this.state = {
      ...this.state,
      ...state,
      gravity: {
        ...this.state.gravity,
        ...state.gravity,
      },
      errorCount: Math.max(
        0,
        Math.round(state.errorCount ?? this.state.errorCount),
      ),
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "viewport-resize") {
      const payload = event.payload as
        | { width?: number; height?: number }
        | undefined;
      if (!payload) return;
      this.viewport.width = clamp(
        Math.round(payload.width ?? this.viewport.width),
        320,
        10_240,
      );
      this.viewport.height = clamp(
        Math.round(payload.height ?? this.viewport.height),
        320,
        10_240,
      );
      return;
    }

    if (event.type === "cursor-move") {
      if (!this.defaultCursorFieldId) return;
      const payload = event.payload as { x?: number; y?: number } | undefined;
      if (
        !payload ||
        typeof payload.x !== "number" ||
        typeof payload.y !== "number"
      )
        return;
      this.updateMagneticField(this.defaultCursorFieldId, {
        position: {
          x: clamp(payload.x, 0, this.viewport.width),
          y: clamp(payload.y, 0, this.viewport.height),
        },
      });
      return;
    }

    if (event.type === "gesture-feedback") {
      const payload = event.payload as
        | {
            center?: { x?: number; y?: number };
            x?: number;
            y?: number;
            velocity?: number;
            type?: string;
          }
        | undefined;
      if (!payload) return;

      const cx = payload.center?.x ?? payload.x;
      const cy = payload.center?.y ?? payload.y;
      if (!isFiniteNumber(cx ?? NaN) || !isFiniteNumber(cy ?? NaN)) return;

      const intensity = clamp(payload.velocity ?? 1, 0.4, 3.5);
      const impulseScale = payload.type === "longpress" ? 220 : 140;
      const nearest = this.findNearestDynamicBody({
        x: cx as number,
        y: cy as number,
      });
      if (!nearest) return;
      this.applyForce(nearest.id, {
        x: (nearest.position.x - (cx as number)) * 0.15 * intensity,
        y:
          (nearest.position.y - (cy as number)) * 0.15 * intensity -
          impulseScale * 0.03,
      });
      return;
    }

    if (event.type === "quality-level-changed") {
      const payload = event.payload as
        | { level?: "low" | "medium" | "high" }
        | undefined;
      if (!payload?.level) return;
      if (payload.level === "low") {
        this.state.gravity = { x: 0, y: 120 };
      } else if (payload.level === "medium") {
        this.state.gravity = { x: 0, y: 160 };
      } else {
        this.state.gravity = { x: 0, y: 180 };
      }
    }
  }

  createRigidBody(config: RigidBodyConfig): string {
    const id = createBodyId();
    const body: PhysicsBodyInternal = {
      id,
      type: config.type,
      position: {
        x: config.position.x,
        y: config.position.y,
      },
      velocity: {
        x: config.velocity?.x ?? 0,
        y: config.velocity?.y ?? 0,
      },
      mass: clamp(config.mass ?? 1, 0.1, 100),
      radius: clamp(config.radius ?? 18, 4, 300),
      friction: clamp(config.friction ?? 0.14, 0, 1),
      restitution: clamp(config.restitution ?? 0.62, 0, 1),
      lastValidPosition: {
        x: config.position.x,
        y: config.position.y,
      },
      lastValidVelocity: {
        x: config.velocity?.x ?? 0,
        y: config.velocity?.y ?? 0,
      },
    };
    this.bodies.set(id, body);
    this.syncState();
    return id;
  }

  removeRigidBody(bodyId: string): void {
    this.bodies.delete(bodyId);
    this.syncState();
  }

  applyForce(bodyId: string, force: PhysicsVector2): void {
    const body = this.bodies.get(bodyId);
    if (!body || body.type === "static") return;
    body.velocity.x += clamp(force.x / Math.max(body.mass, 0.01), -420, 420);
    body.velocity.y += clamp(force.y / Math.max(body.mass, 0.01), -420, 420);
  }

  createMagneticField(config: MagneticFieldConfig): string {
    const id = createFieldId();
    this.magneticFields.set(id, {
      id,
      position: {
        x: config.position.x,
        y: config.position.y,
      },
      radius: clamp(config.radius, 20, 2400),
      strength: clamp(config.strength, -400_000, 400_000),
      mode: config.mode ?? "attract",
    });
    this.syncState();
    return id;
  }

  updateMagneticField(
    fieldId: string,
    partial: Partial<MagneticFieldConfig>,
  ): void {
    const field = this.magneticFields.get(fieldId);
    if (!field) return;
    this.magneticFields.set(fieldId, {
      ...field,
      position: partial.position
        ? {
            x: partial.position.x,
            y: partial.position.y,
          }
        : field.position,
      radius:
        partial.radius !== undefined
          ? clamp(partial.radius, 20, 2400)
          : field.radius,
      strength:
        partial.strength !== undefined
          ? clamp(partial.strength, -400_000, 400_000)
          : field.strength,
      mode: partial.mode ?? field.mode,
    });
  }

  removeMagneticField(fieldId: string): void {
    this.magneticFields.delete(fieldId);
    if (this.defaultCursorFieldId === fieldId) {
      this.defaultCursorFieldId = null;
    }
    this.syncState();
  }

  getBodySnapshot(bodyId: string): PhysicsBodySnapshot | null {
    const body = this.bodies.get(bodyId);
    if (!body) return null;
    return {
      id: body.id,
      type: body.type,
      position: {
        x: body.position.x,
        y: body.position.y,
      },
      velocity: {
        x: body.velocity.x,
        y: body.velocity.y,
      },
      mass: body.mass,
      radius: body.radius,
    };
  }

  private syncState(): void {
    this.state.bodyCount = this.bodies.size;
    this.state.magneticFieldCount = this.magneticFields.size;
  }

  private findNearestDynamicBody(
    point: PhysicsVector2,
  ): PhysicsBodyInternal | null {
    let nearest: PhysicsBodyInternal | null = null;
    let minDistSq = Number.POSITIVE_INFINITY;
    this.bodies.forEach((body) => {
      if (body.type !== "dynamic") return;
      const dx = body.position.x - point.x;
      const dy = body.position.y - point.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        nearest = body;
      }
    });
    return nearest;
  }

  private applyBoundaryCollision(body: PhysicsBodyInternal): void {
    const minX = body.radius;
    const maxX = this.viewport.width - body.radius;
    const minY = body.radius;
    const maxY = this.viewport.height - body.radius;

    if (body.position.x < minX) {
      body.position.x = minX;
      body.velocity.x = Math.abs(body.velocity.x) * body.restitution;
    } else if (body.position.x > maxX) {
      body.position.x = maxX;
      body.velocity.x = -Math.abs(body.velocity.x) * body.restitution;
    }

    if (body.position.y < minY) {
      body.position.y = minY;
      body.velocity.y = Math.abs(body.velocity.y) * body.restitution;
    } else if (body.position.y > maxY) {
      body.position.y = maxY;
      body.velocity.y = -Math.abs(body.velocity.y) * body.restitution;
    }
  }

  private recoverInvalidStateIfNeeded(body: PhysicsBodyInternal): void {
    const validPosition = isFiniteVector(body.position);
    const validVelocity = isFiniteVector(body.velocity);
    const tooFar =
      Math.abs(body.position.x) > 1_000_000 ||
      Math.abs(body.position.y) > 1_000_000 ||
      Math.abs(body.velocity.x) > 1_000_000 ||
      Math.abs(body.velocity.y) > 1_000_000;

    if (validPosition && validVelocity && !tooFar) {
      body.lastValidPosition = {
        x: body.position.x,
        y: body.position.y,
      };
      body.lastValidVelocity = {
        x: body.velocity.x,
        y: body.velocity.y,
      };
      return;
    }

    body.position = {
      x: clamp(
        body.lastValidPosition.x,
        body.radius,
        this.viewport.width - body.radius,
      ),
      y: clamp(
        body.lastValidPosition.y,
        body.radius,
        this.viewport.height - body.radius,
      ),
    };
    body.velocity = {
      x: clamp(body.lastValidVelocity.x, -800, 800),
      y: clamp(body.lastValidVelocity.y, -800, 800),
    };
    this.state.errorCount += 1;

    const now = Date.now();
    if (now - this.warningAt > 1000) {
      this.warningAt = now;
      console.warn(
        `[visual-shock] physics recovery: body=${body.id} reset to last valid state`,
      );
    }

    if (this.context) {
      this.context.emitEvent({
        type: "physics-warning",
        source: this.id,
        timestamp: now,
        payload: {
          bodyId: body.id,
          message: "Recovered from invalid physics state",
          errorCount: this.state.errorCount,
        },
      });
    }
  }
}
