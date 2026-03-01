import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type {
  GlobalState,
  QualityLevel,
  UserPreferences,
} from "@/lib/visual-shock/types";

interface VisualShockActions {
  setScene(sceneId: string): void;
  setTransitioning(transitioning: boolean): void;
  setTheme(theme: string): void;
  setEffectsEnabled(enabled: boolean): void;
  setQualityLevel(level: QualityLevel): void;
  setCursorPosition(x: number, y: number): void;
  setScrollPosition(scrollPosition: number): void;
  setActiveGestures(gestures: string[]): void;
  setPerformanceMetrics(metrics: {
    fps?: number;
    frameTime?: number;
    particleCount?: number;
    drawCalls?: number;
  }): void;
  setAudioEnabled(enabled: boolean): void;
  setMasterVolume(volume: number): void;
  setPreferences(preferences: Partial<UserPreferences>): void;
  reset(): void;
}

export type VisualShockStore = GlobalState & VisualShockActions;

const DEFAULT_PREFERENCES: UserPreferences = {
  reducedMotion: false,
  theme: "auto",
  audioEnabled: true,
  quality: "auto",
};

const DEFAULT_STATE: GlobalState = {
  currentScene: "hero",
  transitioning: false,
  theme: "aurora",
  effectsEnabled: true,
  qualityLevel: "high",
  cursorPosition: { x: 0, y: 0 },
  scrollPosition: 0,
  activeGestures: [],
  fps: 60,
  frameTime: 16.67,
  particleCount: 0,
  drawCalls: 0,
  audioEnabled: true,
  masterVolume: 0.8,
  preferences: DEFAULT_PREFERENCES,
};

const fallbackStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sanitizeQuality(
  quality: UserPreferences["quality"],
): UserPreferences["quality"] {
  if (
    quality === "auto" ||
    quality === "low" ||
    quality === "medium" ||
    quality === "high"
  ) {
    return quality;
  }
  return "auto";
}

function createInitialState(): GlobalState {
  return {
    ...DEFAULT_STATE,
    preferences: {
      ...DEFAULT_PREFERENCES,
    },
  };
}

export const useVisualShockStore = create<VisualShockStore>()(
  persist(
    (set) => ({
      ...createInitialState(),
      setScene: (sceneId) => set({ currentScene: sceneId }),
      setTransitioning: (transitioning) => set({ transitioning }),
      setTheme: (theme) =>
        set((state) => ({
          theme,
          preferences: {
            ...state.preferences,
            theme,
          },
        })),
      setEffectsEnabled: (enabled) => set({ effectsEnabled: enabled }),
      setQualityLevel: (level) => set({ qualityLevel: level }),
      setCursorPosition: (x, y) =>
        set({
          cursorPosition: {
            x: Number.isFinite(x) ? x : 0,
            y: Number.isFinite(y) ? y : 0,
          },
        }),
      setScrollPosition: (scrollPosition) =>
        set({
          scrollPosition: Number.isFinite(scrollPosition)
            ? Math.max(0, scrollPosition)
            : 0,
        }),
      setActiveGestures: (gestures) =>
        set({ activeGestures: Array.from(new Set(gestures)) }),
      setPerformanceMetrics: (metrics) =>
        set((state) => ({
          fps: metrics.fps ?? state.fps,
          frameTime: metrics.frameTime ?? state.frameTime,
          particleCount: metrics.particleCount ?? state.particleCount,
          drawCalls: metrics.drawCalls ?? state.drawCalls,
        })),
      setAudioEnabled: (enabled) =>
        set((state) => ({
          audioEnabled: enabled,
          preferences: {
            ...state.preferences,
            audioEnabled: enabled,
          },
        })),
      setMasterVolume: (volume) => set({ masterVolume: clamp(volume, 0, 1) }),
      setPreferences: (preferences) =>
        set((state) => {
          const merged: UserPreferences = {
            ...state.preferences,
            ...preferences,
            quality: sanitizeQuality(
              preferences.quality ?? state.preferences.quality,
            ),
          };

          return {
            preferences: merged,
            audioEnabled: merged.audioEnabled,
            theme: merged.theme === "auto" ? state.theme : merged.theme,
          };
        }),
      reset: () => set(createInitialState()),
    }),
    {
      name: "visual-shock-preferences",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? fallbackStorage : window.localStorage,
      ),
    },
  ),
);

export const visualShockStore = useVisualShockStore;
