import { describe, expect, it } from 'vitest';
import { EventManager } from '@/lib/visual-shock/core/EventManager';
import { PhysicsEngineSystem } from '@/lib/visual-shock/systems/PhysicsEngine';
import type { GlobalState, SystemContext } from '@/lib/visual-shock/types';

const state: GlobalState = {
    currentScene: 'hero',
    transitioning: false,
    theme: 'aurora',
    effectsEnabled: true,
    qualityLevel: 'high',
    cursorPosition: { x: 0, y: 0 },
    scrollPosition: 0,
    activeGestures: [],
    fps: 60,
    frameTime: 16.67,
    particleCount: 0,
    drawCalls: 0,
    audioEnabled: true,
    masterVolume: 0.8,
    preferences: {
        reducedMotion: false,
        theme: 'auto',
        audioEnabled: true,
        quality: 'auto',
    },
};

function createContext(eventManager: EventManager): SystemContext {
    return {
        getState: () => state,
        setState: () => undefined,
        emitEvent: (event) => eventManager.publish(event),
    };
}

describe('visual-shock physics engine', () => {
    it('should recover invalid numeric state to last valid snapshot', async () => {
        const eventManager = new EventManager();
        const physicsEngine = new PhysicsEngineSystem();
        await physicsEngine.initialize(createContext(eventManager));

        const bodyId = physicsEngine.createRigidBody({
            type: 'dynamic',
            position: { x: 200, y: 200 },
            velocity: { x: 20, y: 0 },
            mass: 1,
            radius: 14,
        });

        const internals = physicsEngine as unknown as {
            bodies: Map<string, { velocity: { x: number; y: number } }>;
        };
        const body = internals.bodies.get(bodyId);
        expect(body).toBeDefined();
        if (!body) return;

        body.velocity.x = Number.NaN;
        physicsEngine.update(0.016, state);

        const snapshot = physicsEngine.getBodySnapshot(bodyId);
        expect(snapshot).not.toBeNull();
        expect(Number.isFinite(snapshot?.velocity.x ?? Number.NaN)).toBe(true);
        expect(physicsEngine.getState().errorCount).toBeGreaterThan(0);
    });
});
