import { describe, expect, it } from 'vitest';
import { EventManager } from '@/lib/visual-shock/core/EventManager';
import { AudioManagerSystem } from '@/lib/visual-shock/systems/AudioManager';
import { ParticleEngineSystem } from '@/lib/visual-shock/systems/ParticleEngine';
import { PhysicsEngineSystem } from '@/lib/visual-shock/systems/PhysicsEngine';
import { ShaderPipeline } from '@/lib/visual-shock/systems/ShaderPipeline';
import { evaluateQualityAdjustment } from '@/lib/visual-shock/utils/performance';
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

function createContext(eventManager: EventManager): SystemContext {
    return {
        getState: () => baseState,
        setState: () => undefined,
        emitEvent: (event) => eventManager.publish(event),
    };
}

describe('visual-shock Integration', () => {
    it('should deliver interaction events to particle visual response', async () => {
        const eventManager = new EventManager();
        const particleEngine = new ParticleEngineSystem();
        await particleEngine.initialize(createContext(eventManager));

        const unsubscribe = eventManager.subscribe('*', (event) => {
            particleEngine.onEvent(event);
        });

        const before = particleEngine.getActiveParticleCount();
        eventManager.publish({
            type: 'hover-interactive',
            source: 'integration-test',
            timestamp: Date.now(),
            payload: {
                x: 320,
                y: 180,
            },
        });
        const after = particleEngine.getActiveParticleCount();

        unsubscribe();
        expect(after).toBeGreaterThan(before);
    });

    it('should coordinate gesture feedback to particle burst and audio cue', async () => {
        const eventManager = new EventManager();
        const particleEngine = new ParticleEngineSystem();
        const audioManager = new AudioManagerSystem();
        await particleEngine.initialize(createContext(eventManager));
        await audioManager.initialize(createContext(eventManager));

        let cueCount = 0;

        const unsubscribe = eventManager.subscribe('*', (event) => {
            particleEngine.onEvent(event);
            audioManager.onEvent(event);
            if (event.type === 'audio-cue-triggered') {
                cueCount += 1;
            }
        });

        const before = particleEngine.getActiveParticleCount();
        eventManager.publish({
            type: 'gesture-feedback',
            source: 'integration-test',
            timestamp: Date.now(),
            payload: {
                type: 'swipe',
                x: 240,
                y: 140,
                velocity: 2.2,
            },
        });
        const after = particleEngine.getActiveParticleCount();

        unsubscribe();
        expect(after).toBeGreaterThan(before);
        expect(cueCount).toBeGreaterThan(0);
    });

    it('should link magnetic field forces to physics body updates', async () => {
        const eventManager = new EventManager();
        const physicsEngine = new PhysicsEngineSystem();
        await physicsEngine.initialize(createContext(eventManager));

        const bodyId = physicsEngine.createRigidBody({
            type: 'dynamic',
            position: { x: 160, y: 180 },
            velocity: { x: 0, y: 0 },
            mass: 1,
            radius: 16,
        });

        physicsEngine.createMagneticField({
            position: { x: 580, y: 180 },
            radius: 720,
            strength: 320_000,
            mode: 'attract',
        });

        const before = physicsEngine.getBodySnapshot(bodyId);
        expect(before).not.toBeNull();

        physicsEngine.update(0.016, baseState);
        physicsEngine.update(0.016, baseState);
        physicsEngine.update(0.016, baseState);

        const after = physicsEngine.getBodySnapshot(bodyId);
        expect(after).not.toBeNull();
        expect((after?.velocity.x ?? 0)).toBeGreaterThan(before?.velocity.x ?? 0);
    });

    it('should propagate theme updates to shader uniforms and particle palette', async () => {
        const eventManager = new EventManager();
        const particleEngine = new ParticleEngineSystem();
        const shaderPipeline = new ShaderPipeline();
        await particleEngine.initialize(createContext(eventManager));
        await shaderPipeline.initialize(createContext(eventManager));
        await shaderPipeline.loadShader(
            'theme-probe',
            `
            uniform vec3 uThemePrimary;
            uniform float uGlowStrength;
            attribute vec3 position;
            void main() {
              gl_Position = vec4(position, 1.0);
            }`,
            `
            uniform vec3 uThemePrimary;
            uniform float uGlowStrength;
            void main() {
              gl_FragColor = vec4(uThemePrimary * uGlowStrength, 1.0);
            }`,
        );

        const unsubscribe = eventManager.subscribe('*', (event) => {
            particleEngine.onEvent(event);
            shaderPipeline.onEvent(event);
        });

        eventManager.publish({
            type: 'theme-changed',
            source: 'integration-test',
            timestamp: Date.now(),
            payload: {
                themeId: 'integration-red',
                theme: {
                    colors: {
                        primary: '#ff0000',
                        secondary: '#00ff00',
                        accent: '#0000ff',
                        background: '#000000',
                        text: '#ffffff',
                        glow: '#ff00ff',
                    },
                    shaderParams: {
                        holographicIntensity: 0.6,
                        glowStrength: 0.9,
                        chromaticAberration: 0.2,
                        scanlineSpeed: 0.5,
                    },
                    particleColors: ['#ff0000'],
                    lightingIntensity: 1.1,
                },
            },
        });

        eventManager.publish({
            type: 'gesture-feedback',
            source: 'integration-test',
            timestamp: Date.now(),
            payload: {
                type: 'swipe',
                x: 220,
                y: 120,
                velocity: 2,
            },
        });

        const emitted = particleEngine.getActiveParticles(60);
        const hasRedParticle = emitted.some((particle) => particle.color.includes('255,0,0'));
        expect(hasRedParticle).toBe(true);

        const shaderPrograms = (shaderPipeline as unknown as { programs: Map<string, { uniformValues: Record<string, unknown> }> }).programs;
        const program = shaderPrograms.get('theme-probe');
        expect(program?.uniformValues.uThemePrimary).toEqual([1, 0, 0]);
        expect(program?.uniformValues.uGlowStrength).toBe(0.9);

        unsubscribe();
    });

    it('should compute quality degradation and recovery decisions from fps stream', () => {
        let lowFpsSince: number | null = null;
        let highFpsSince: number | null = null;

        const step1 = evaluateQualityAdjustment({
            currentLevel: 'high',
            fps: 40,
            now: 1000,
            lowFpsSince,
            highFpsSince,
        });
        lowFpsSince = step1.lowFpsSince;
        highFpsSince = step1.highFpsSince;
        expect(step1.nextLevel).toBeNull();

        const step2 = evaluateQualityAdjustment({
            currentLevel: 'high',
            fps: 40,
            now: 3601,
            lowFpsSince,
            highFpsSince,
        });
        expect(step2.nextLevel).toBe('medium');

        const step3 = evaluateQualityAdjustment({
            currentLevel: 'medium',
            fps: 30,
            now: 6202,
            lowFpsSince: step2.lowFpsSince,
            highFpsSince: step2.highFpsSince,
        });
        expect(step3.nextLevel).toBe('low');
    });
});
