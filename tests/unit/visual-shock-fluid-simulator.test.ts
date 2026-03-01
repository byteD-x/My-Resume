import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { FluidSimulatorSystem } from '@/lib/visual-shock/systems/FluidSimulator';
import type { GlobalState, SystemContext, SystemEvent } from '@/lib/visual-shock/types';

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

function createContext(events: SystemEvent[] = []): SystemContext {
    return {
        getState: () => baseState,
        setState: () => undefined,
        emitEvent: (event) => {
            events.push(event);
        },
    };
}

describe('visual-shock FluidSimulator', () => {
    it('fluid interaction should create disturbances', async () => {
        const simulator = new FluidSimulatorSystem();
        await simulator.initialize(createContext());

        simulator.onEvent({
            type: 'fluid-interaction',
            source: 'test',
            timestamp: Date.now(),
            payload: {
                x: 120,
                y: 180,
                dx: 80,
                dy: 30,
                radius: 44,
            },
        });

        expect(simulator.getRenderPoints().length).toBeGreaterThan(0);
    });

    it('dye should support color mixing', async () => {
        const simulator = new FluidSimulatorSystem();
        await simulator.initialize(createContext());

        simulator.addDye(200, 150, { r: 1, g: 0, b: 0 }, 50);
        simulator.addDye(200, 150, { r: 0, g: 0, b: 1 }, 50);

        const point = simulator.getRenderPoints()[0];
        expect(point.color.r).toBeGreaterThan(0);
        expect(point.color.b).toBeGreaterThan(0);
    });

    it('disturbance should advect along velocity field', async () => {
        const simulator = new FluidSimulatorSystem();
        await simulator.initialize(createContext());
        simulator.setResolution(640, 360);
        simulator.addForce(100, 80, 220, 0, 32);
        simulator.addDye(100, 80, { r: 0.3, g: 0.7, b: 1 }, 32);

        const before = simulator.getRenderPoints()[0];
        simulator.update(0.2, baseState);
        const after = simulator.getRenderPoints()[0];

        expect(after.x).toBeGreaterThan(before.x);
    });

    it('high velocity fluid should emit particle linkage events', async () => {
        const emitted: SystemEvent[] = [];
        const simulator = new FluidSimulatorSystem();
        await simulator.initialize(createContext(emitted));
        simulator.setResolution(640, 360);
        simulator.addForce(180, 120, 420, 0, 56);
        simulator.addDye(180, 120, { r: 0.2, g: 0.9, b: 1 }, 56);

        simulator.update(0.1, baseState);
        const hasVelocitySpike = emitted.some((event) => event.type === 'fluid-velocity-spike');
        expect(hasVelocitySpike).toBe(true);
    });

    it('viscosity and density configuration should be applied', () => {
        fc.assert(
            fc.property(
                fc.float({
                    min: Math.fround(0),
                    max: Math.fround(2.5),
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                fc.float({
                    min: Math.fround(0.1),
                    max: Math.fround(2.2),
                    noNaN: true,
                    noDefaultInfinity: true,
                }),
                (viscosity, density) => {
                    const simulator = new FluidSimulatorSystem();
                    simulator.setViscosity(viscosity);
                    simulator.setDensity(density);
                    const state = simulator.getState();
                    expect(state.viscosity).toBeCloseTo(viscosity, 5);
                    expect(state.density).toBeCloseTo(density, 5);
                },
            ),
            { numRuns: 100 },
        );
    });
});
