import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeEngineSystem } from '@/lib/visual-shock/systems/ThemeEngine';
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

describe('visual-shock ThemeEngine', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('should provide at least 5 built-in themes and apply transition in 2s', async () => {
        const emitted: SystemEvent[] = [];
        const engine = new ThemeEngineSystem({
            storageKey: 'theme-engine-test-1',
        });
        await engine.initialize(createContext(emitted));

        expect(engine.getThemeCount()).toBeGreaterThanOrEqual(5);

        const transitionPromise = engine.setTheme('neo-sunset', true);
        engine.update(1, baseState);
        expect(engine.getState().transitioning).toBe(true);
        expect(engine.getState().transitionProgress).toBeGreaterThan(0.45);
        expect(engine.getState().transitionProgress).toBeLessThan(0.55);

        engine.update(1.1, baseState);
        await transitionPromise;
        expect(engine.getState().transitioning).toBe(false);
        expect(engine.getState().transitionProgress).toBe(1);
        expect(engine.getCurrentTheme()).toBe('neo-sunset');
        expect(emitted.some((event) => event.type === 'theme-changed')).toBe(true);
    });

    it('should auto-adapt theme based on time when auto mode is enabled', async () => {
        let hour = 22;
        const engine = new ThemeEngineSystem({
            storageKey: 'theme-engine-test-2',
            autoCheckIntervalMs: 0,
            getCurrentDate: () => new Date(2026, 0, 1, hour, 0, 0),
        });
        await engine.initialize(createContext());
        expect(engine.getCurrentTheme()).toBe('midnight-grid');

        hour = 9;
        engine.setAutoTheme(true);
        engine.update(2.2, baseState);
        expect(engine.getCurrentTheme()).toBe('daybreak');
    });

    it('user-selected theme should override auto mode and persist', async () => {
        let hour = 11;
        const storageKey = 'theme-engine-test-3';
        const engine = new ThemeEngineSystem({
            storageKey,
            autoCheckIntervalMs: 0,
            getCurrentDate: () => new Date(2026, 0, 1, hour, 0, 0),
        });
        await engine.initialize(createContext());

        await engine.setTheme('cyber-ember', false);
        expect(engine.getCurrentTheme()).toBe('cyber-ember');
        expect(engine.getState().autoTheme).toBe(false);

        hour = 23;
        engine.update(1, baseState);
        expect(engine.getCurrentTheme()).toBe('cyber-ember');

        const raw = window.localStorage.getItem(storageKey);
        expect(raw).not.toBeNull();
        if (!raw) return;

        const payload = JSON.parse(raw) as { themeId?: string; autoTheme?: boolean };
        expect(payload.themeId).toBe('cyber-ember');
        expect(payload.autoTheme).toBe(false);
    });

    it('should restore theme from persisted localStorage selection', async () => {
        const storageKey = 'theme-engine-test-4';
        const first = new ThemeEngineSystem({ storageKey });
        await first.initialize(createContext());
        await first.setTheme('neo-sunset', false);

        const second = new ThemeEngineSystem({ storageKey });
        await second.initialize(createContext());
        expect(second.getCurrentTheme()).toBe('neo-sunset');
    });
});
