import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { ParticleEngineSystem } from '@/lib/visual-shock/systems/ParticleEngine';
import type { GlobalState, SystemContext } from '@/lib/visual-shock/types';

const baseState: GlobalState = {
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

function createContext(): SystemContext {
    return {
        getState: () => baseState,
        setState: () => undefined,
        emitEvent: () => undefined,
    };
}

describe('visual-shock ParticleEngine', () => {
    it('forces should move particles over time', () => {
        fc.assert(
            fc.property(
                fc.float({
                    min: Math.fround(0.12),
                    max: Math.fround(0.8),
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                (deltaTime) => {
                const engine = new ParticleEngineSystem();
                engine.setMaxParticles(200);
                engine.onEvent({
                    type: 'viewport-resize',
                    source: 'test',
                    timestamp: Date.now(),
                    payload: { width: 300, height: 300 },
                });

                const emitter = engine.createEmitter({
                    type: 'energy',
                    rate: 0,
                    lifetime: [3, 3],
                    velocity: {
                        min: { x: 0, y: 0 },
                        max: { x: 0, y: 0 },
                    },
                    size: [2, 2],
                    color: { from: '#ffffff' },
                    blendMode: 'alpha',
                    physics: true,
                });

                engine.addForce({
                    type: 'gravity',
                    vector: { x: 0, y: 120 },
                    strength: 1,
                });

                engine.emit(emitter, 1, { x: 150, y: 100 });
                engine.update(deltaTime, baseState);
                const mid = engine.getActiveParticles();
                expect(mid.length).toBeGreaterThan(0);
                const midY = mid[0].y;

                engine.update(deltaTime, baseState);
                const end = engine.getActiveParticles();
                expect(end.length).toBeGreaterThan(0);
                expect(end[0].y).toBeGreaterThan(midY);
                },
            ),
            { numRuns: 100 },
        );
    });

    it('particles should bounce when touching viewport boundaries', () => {
        const engine = new ParticleEngineSystem();
        engine.onEvent({
            type: 'viewport-resize',
            source: 'test',
            timestamp: Date.now(),
            payload: { width: 100, height: 100 },
        });

        const emitter = engine.createEmitter({
            type: 'sparks',
            rate: 0,
            lifetime: [2, 2],
            velocity: {
                min: { x: 140, y: 0 },
                max: { x: 140, y: 0 },
            },
            size: [2, 2],
            color: { from: '#ffffff' },
            blendMode: 'alpha',
            physics: true,
        });

        engine.emit(emitter, 1, { x: 98, y: 50 });
        engine.update(0.2, baseState);
        engine.update(0.12, baseState);

        const particle = engine.getActiveParticles()[0];
        expect(particle.x).toBeLessThan(100);
    });

    it('hover interactions should trigger particle emissions', async () => {
        const engine = new ParticleEngineSystem();
        await engine.initialize(createContext());
        const before = engine.getActiveParticleCount();

        engine.onEvent({
            type: 'hover-interactive',
            source: 'test',
            timestamp: Date.now(),
            payload: { x: 200, y: 120 },
        });

        expect(engine.getActiveParticleCount()).toBeGreaterThan(before);
    });

    it('scroll interactions should generate trailing particles', async () => {
        const engine = new ParticleEngineSystem();
        await engine.initialize(createContext());
        const before = engine.getActiveParticleCount();

        engine.onEvent({
            type: 'scroll-motion',
            source: 'test',
            timestamp: Date.now(),
            payload: { x: 280, y: 220, deltaY: 240 },
        });

        expect(engine.getActiveParticleCount()).toBeGreaterThan(before);
    });

    it('cursor movement should create persistent particle trails', async () => {
        const engine = new ParticleEngineSystem();
        await engine.initialize(createContext());

        engine.onEvent({
            type: 'cursor-move',
            source: 'test',
            timestamp: Date.now(),
            payload: {
                x: 320,
                y: 180,
                viewportWidth: 1280,
                viewportHeight: 720,
            },
        });

        expect(engine.getActiveParticleCount()).toBeGreaterThan(0);
    });
});
