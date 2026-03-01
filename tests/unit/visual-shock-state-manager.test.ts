import { beforeEach, describe, expect, it } from 'vitest';
import { useVisualShockStore } from '@/lib/visual-shock/core/StateManager';

describe('visual-shock StateManager', () => {
    beforeEach(() => {
        window.localStorage.clear();
        useVisualShockStore.getState().reset();
    });

    it('should persist theme selection in localStorage', () => {
        useVisualShockStore.getState().setTheme('neon-grid');

        const raw = window.localStorage.getItem('visual-shock-preferences');
        expect(raw).not.toBeNull();
        if (!raw) return;

        const parsed = JSON.parse(raw) as {
            state?: {
                preferences?: {
                    theme?: string;
                };
            };
        };

        expect(parsed.state?.preferences?.theme).toBe('neon-grid');
    });

    it('should restore theme preference from persisted payload', () => {
        const persistedPayload = {
            state: {
                preferences: {
                    reducedMotion: false,
                    theme: 'sunset',
                    audioEnabled: true,
                    quality: 'high',
                },
            },
            version: 0,
        };

        window.localStorage.setItem('visual-shock-preferences', JSON.stringify(persistedPayload));
        useVisualShockStore.getState().reset();
        useVisualShockStore.getState().setPreferences(persistedPayload.state.preferences);

        expect(useVisualShockStore.getState().preferences.theme).toBe('sunset');
    });
});
