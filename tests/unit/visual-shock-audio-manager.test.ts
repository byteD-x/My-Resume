import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventManager } from '@/lib/visual-shock/core/EventManager';
import { AudioManagerSystem } from '@/lib/visual-shock/systems/AudioManager';
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

describe('visual-shock audio manager', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should emit silent cue when Web Audio API is unavailable', async () => {
        vi.stubGlobal('AudioContext', undefined);
        vi.stubGlobal('webkitAudioContext', undefined);

        const eventManager = new EventManager();
        const audioManager = new AudioManagerSystem();
        await audioManager.initialize(createContext(eventManager));

        const cues: Array<{ silent?: boolean }> = [];
        const unsubscribe = eventManager.subscribe('audio-cue-triggered', (event) => {
            cues.push((event.payload as { silent?: boolean } | undefined) ?? {});
        });

        audioManager.onEvent({
            type: 'hover-interactive',
            source: 'test',
            timestamp: Date.now(),
            payload: {
                x: 300,
                y: 180,
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        unsubscribe();
        expect(cues.length).toBeGreaterThan(0);
        expect(cues[0]?.silent).toBe(true);
    });
});
