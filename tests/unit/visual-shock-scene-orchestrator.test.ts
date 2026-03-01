import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { SceneOrchestrator } from '@/lib/visual-shock/core/SceneOrchestrator';
import type { GlobalState, SystemEvent, TransitionFunction } from '@/lib/visual-shock/types';

function createBaseState(): GlobalState {
    return {
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
}

function createOrchestrator(
    events: SystemEvent[],
    preloadSceneAssets?: (sceneId: string) => Promise<void>,
): SceneOrchestrator {
    let state = createBaseState();
    const orchestrator = new SceneOrchestrator({
        getState: () => state,
        setState: (partial) => {
            state = {
                ...state,
                ...partial,
            };
        },
        emitEvent: (event) => {
            events.push(event);
        },
        preloadSceneAssets,
    });

    orchestrator.registerScene({
        id: 'hero',
        systems: [],
        theme: 'aurora',
    });
    orchestrator.registerScene({
        id: 'projects',
        systems: [],
        theme: 'neo-sunset',
    });

    return orchestrator;
}

function waitWithAbort(durationMs: number): TransitionFunction {
    return async (_from, _to, _options, signal) => {
        await new Promise<void>((resolve, reject) => {
            const timer = window.setTimeout(resolve, durationMs);
            signal.addEventListener(
                'abort',
                () => {
                    window.clearTimeout(timer);
                    reject(new DOMException('Transition aborted', 'AbortError'));
                },
                { once: true },
            );
        });
    };
}

describe('visual-shock SceneOrchestrator', () => {
    it('should emit camera transition event when camera animation is provided', async () => {
        const events: SystemEvent[] = [];
        const orchestrator = createOrchestrator(events);
        orchestrator.registerTransition('instant', async () => undefined);

        await orchestrator.transitionTo('projects', {
            type: 'instant',
            duration: 300,
            easing: 'easeOutCubic',
            cameraAnimation: {
                position: [1, 2, 3],
                lookAt: [0, 0, 0],
                fov: 42,
            },
        });

        const cameraEvent = events.find((event) => event.type === 'transition-camera-animation');
        expect(cameraEvent).toBeDefined();
        expect((cameraEvent?.payload as { cameraAnimation?: { position?: [number, number, number] } }).cameraAnimation?.position).toEqual([1, 2, 3]);
    });

    it('should emit audio crossfade start/end with original duration for random transitions', async () => {
        await fc.assert(
            fc.asyncProperty(fc.integer({ min: 120, max: 1800 }), async (duration) => {
                const events: SystemEvent[] = [];
                const orchestrator = createOrchestrator(events);
                orchestrator.registerTransition('instant', async () => undefined);

                await orchestrator.transitionTo('projects', {
                    type: 'instant',
                    duration,
                    easing: 'linear',
                    audioFade: true,
                });

                const start = events.find((event) => event.type === 'audio-crossfade-start');
                const end = events.find((event) => event.type === 'audio-crossfade-complete');
                expect(start).toBeDefined();
                expect(end).toBeDefined();
                expect((start?.payload as { duration?: number }).duration).toBe(duration);
                expect((end?.payload as { duration?: number }).duration).toBe(duration);
            }),
            { numRuns: 100 },
        );
    });

    it('should preload target scene before transition executes', async () => {
        const events: SystemEvent[] = [];
        const sequence: string[] = [];
        const orchestrator = createOrchestrator(events, async () => {
            sequence.push('preload');
        });
        orchestrator.registerTransition('check-preload', async () => {
            sequence.push('transition');
        });

        await orchestrator.transitionTo('projects', {
            type: 'check-preload',
            duration: 260,
            easing: 'easeOut',
        });

        expect(sequence).toEqual(['preload', 'transition']);
        expect(events.some((event) => event.type === 'scene-preload-start')).toBe(true);
        expect(events.some((event) => event.type === 'scene-preload-complete')).toBe(true);
    });

    it('should support interruption and reversal, and invoke completion callbacks', async () => {
        const events: SystemEvent[] = [];
        const completionResults: Array<{ interrupted: boolean; reversed: boolean; toSceneId: string }> = [];
        const orchestrator = createOrchestrator(events);
        orchestrator.registerTransition('slow', waitWithAbort(35));
        orchestrator.onTransitionComplete((result) => {
            completionResults.push({
                interrupted: result.interrupted,
                reversed: result.reversed,
                toSceneId: result.toSceneId,
            });
        });

        const first = orchestrator.transitionTo('projects', {
            type: 'slow',
            duration: 420,
            easing: 'linear',
        });
        const second = orchestrator.transitionTo('hero', {
            type: 'slow',
            duration: 420,
            easing: 'linear',
        });

        await Promise.all([first, second]);

        expect(events.some((event) => event.type === 'transition-interrupted')).toBe(true);
        expect(completionResults.some((result) => result.interrupted)).toBe(true);
        expect(completionResults.some((result) => !result.interrupted && result.reversed)).toBe(true);
    });
});
