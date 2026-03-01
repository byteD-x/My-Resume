import type {
  GlobalState,
  IThemeEngine,
  SystemContext,
  SystemEvent,
  ThemeDefinition,
  ThemeEngineState,
} from "@/lib/visual-shock/types";

interface ThemeEngineOptions {
  storageKey?: string;
  getCurrentDate?: () => Date;
  autoCheckIntervalMs?: number;
}

interface ThemeTransition {
  fromTheme: string;
  toTheme: string;
  elapsedMs: number;
  resolve: () => void;
}

interface PersistedThemeSelection {
  themeId: string;
  autoTheme: boolean;
}

const DEFAULT_STORAGE_KEY = "visual-shock-theme-engine";
const DEFAULT_TRANSITION_DURATION_MS = 2000;
const DEFAULT_AUTO_CHECK_INTERVAL_MS = 60_000;

const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    id: "aurora",
    name: "Aurora",
    colors: {
      primary: "#38bdf8",
      secondary: "#22d3ee",
      accent: "#60a5fa",
      background: "#020617",
      text: "#e2e8f0",
      glow: "#67e8f9",
    },
    shaderParams: {
      holographicIntensity: 0.72,
      glowStrength: 0.66,
      chromaticAberration: 0.16,
      scanlineSpeed: 0.42,
    },
    particleColors: ["#38bdf8", "#22d3ee", "#7dd3fc", "#60a5fa"],
    lightingIntensity: 1.08,
  },
  {
    id: "daybreak",
    name: "Daybreak",
    colors: {
      primary: "#0ea5e9",
      secondary: "#10b981",
      accent: "#22d3ee",
      background: "#f8fafc",
      text: "#0f172a",
      glow: "#67e8f9",
    },
    shaderParams: {
      holographicIntensity: 0.44,
      glowStrength: 0.5,
      chromaticAberration: 0.08,
      scanlineSpeed: 0.32,
    },
    particleColors: ["#0ea5e9", "#14b8a6", "#22d3ee", "#38bdf8"],
    lightingIntensity: 0.94,
  },
  {
    id: "neo-sunset",
    name: "Neo Sunset",
    colors: {
      primary: "#f97316",
      secondary: "#fb7185",
      accent: "#facc15",
      background: "#111827",
      text: "#fde68a",
      glow: "#fb7185",
    },
    shaderParams: {
      holographicIntensity: 0.68,
      glowStrength: 0.78,
      chromaticAberration: 0.2,
      scanlineSpeed: 0.38,
    },
    particleColors: ["#f97316", "#fb7185", "#facc15", "#fdba74"],
    lightingIntensity: 1.12,
  },
  {
    id: "midnight-grid",
    name: "Midnight Grid",
    colors: {
      primary: "#6366f1",
      secondary: "#a855f7",
      accent: "#22d3ee",
      background: "#020617",
      text: "#cbd5e1",
      glow: "#818cf8",
    },
    shaderParams: {
      holographicIntensity: 0.84,
      glowStrength: 0.86,
      chromaticAberration: 0.24,
      scanlineSpeed: 0.5,
    },
    particleColors: ["#818cf8", "#a78bfa", "#22d3ee", "#c4b5fd"],
    lightingIntensity: 1.2,
  },
  {
    id: "cyber-ember",
    name: "Cyber Ember",
    colors: {
      primary: "#ef4444",
      secondary: "#f97316",
      accent: "#f59e0b",
      background: "#111827",
      text: "#fee2e2",
      glow: "#fb7185",
    },
    shaderParams: {
      holographicIntensity: 0.74,
      glowStrength: 0.82,
      chromaticAberration: 0.22,
      scanlineSpeed: 0.46,
    },
    particleColors: ["#ef4444", "#f97316", "#f59e0b", "#fb7185"],
    lightingIntensity: 1.16,
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parsePersistedSelection(
  raw: string | null,
): PersistedThemeSelection | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedThemeSelection>;
    if (typeof parsed.themeId !== "string") return null;
    if (typeof parsed.autoTheme !== "boolean") return null;
    return {
      themeId: parsed.themeId,
      autoTheme: parsed.autoTheme,
    };
  } catch {
    return null;
  }
}

export class ThemeEngineSystem implements IThemeEngine {
  readonly id = "theme-engine";

  readonly priority = 15;

  enabled = true;

  private context: SystemContext | null = null;

  private readonly themes = new Map<string, ThemeDefinition>();

  private readonly options: Required<ThemeEngineOptions>;

  private transition: ThemeTransition | null = null;

  private lastAutoCheckAt = 0;

  private state: ThemeEngineState = {
    currentTheme: "aurora",
    autoTheme: true,
    transitioning: false,
    transitionProgress: 1,
    transitionDuration: DEFAULT_TRANSITION_DURATION_MS,
  };

  constructor(options: ThemeEngineOptions = {}) {
    this.options = {
      storageKey: options.storageKey ?? DEFAULT_STORAGE_KEY,
      getCurrentDate: options.getCurrentDate ?? (() => new Date()),
      autoCheckIntervalMs:
        options.autoCheckIntervalMs ?? DEFAULT_AUTO_CHECK_INTERVAL_MS,
    };

    BUILT_IN_THEMES.forEach((theme) => this.registerTheme(theme));
    if (BUILT_IN_THEMES.length > 0) {
      this.state.currentTheme = BUILT_IN_THEMES[0].id;
    }
  }

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;

    const persisted = this.readPersistedSelection();
    if (persisted) {
      this.state.autoTheme = persisted.autoTheme;
      if (this.themes.has(persisted.themeId)) {
        this.state.currentTheme = persisted.themeId;
      }
    }

    if (this.state.autoTheme) {
      const autoThemeId = this.resolveAutoThemeId();
      if (this.themes.has(autoThemeId)) {
        this.state.currentTheme = autoThemeId;
      }
    }

    this.applyTheme(this.state.currentTheme, 1);
    this.persistSelection();
  }

  update(deltaTime: number, state: GlobalState): void {
    void state;

    if (deltaTime <= 0) return;

    if (this.transition) {
      this.transition.elapsedMs += deltaTime * 1000;
      const progress = clamp(
        this.transition.elapsedMs / this.state.transitionDuration,
        0,
        1,
      );
      this.state.transitionProgress = progress;
      this.emitThemeChanged(this.transition.toTheme, progress);

      if (progress >= 1) {
        this.completeTransition();
      }
    }

    if (!this.state.autoTheme || this.state.transitioning) return;

    const now = Date.now();
    if (now - this.lastAutoCheckAt < this.options.autoCheckIntervalMs) return;
    this.lastAutoCheckAt = now;

    const autoTheme = this.resolveAutoThemeId();
    if (!this.themes.has(autoTheme) || autoTheme === this.state.currentTheme)
      return;
    void this.applyThemeSelection(autoTheme, true, true);
  }

  dispose(): void {
    this.transition?.resolve();
    this.transition = null;
    this.state.transitioning = false;
    this.state.transitionProgress = 1;
    this.toggleDocumentTransitionClass(false);
    this.context = null;
  }

  getState(): ThemeEngineState {
    return this.state;
  }

  setState(state: Partial<ThemeEngineState>): void {
    this.state = {
      ...this.state,
      ...state,
      transitionDuration:
        typeof state.transitionDuration === "number"
          ? clamp(Math.round(state.transitionDuration), 200, 12_000)
          : this.state.transitionDuration,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "theme-select") {
      const payload = event.payload as
        | { themeId?: string; transition?: boolean }
        | undefined;
      if (!payload?.themeId) return;
      void this.setTheme(payload.themeId, payload.transition ?? true);
      return;
    }

    if (event.type === "theme-auto") {
      const payload = event.payload as { enabled?: boolean } | undefined;
      if (typeof payload?.enabled !== "boolean") return;
      this.setAutoTheme(payload.enabled);
      return;
    }

    if (event.type === "theme-transition-duration") {
      const payload = event.payload as { durationMs?: number } | undefined;
      if (typeof payload?.durationMs !== "number") return;
      this.state.transitionDuration = clamp(
        Math.round(payload.durationMs),
        200,
        12_000,
      );
    }
  }

  registerTheme(theme: ThemeDefinition): void {
    if (!theme.id || theme.id.trim().length === 0) {
      throw new Error("Theme id is required");
    }
    this.themes.set(theme.id, theme);
  }

  async setTheme(themeId: string, transition: boolean): Promise<void> {
    await this.applyThemeSelection(themeId, transition, false);
  }

  getCurrentTheme(): string {
    return this.state.currentTheme;
  }

  setAutoTheme(enabled: boolean): void {
    this.state.autoTheme = enabled;
    this.persistSelection();
    if (!enabled) return;

    const autoTheme = this.resolveAutoThemeId();
    if (!this.themes.has(autoTheme)) return;
    void this.applyThemeSelection(autoTheme, true, true);
  }

  getThemeCount(): number {
    return this.themes.size;
  }

  private async applyThemeSelection(
    themeId: string,
    transition: boolean,
    fromAuto: boolean,
  ): Promise<void> {
    if (!this.themes.has(themeId)) {
      throw new Error(`Theme "${themeId}" is not registered`);
    }

    if (!fromAuto) {
      this.state.autoTheme = false;
    }

    if (this.transition) {
      this.transition.resolve();
      this.transition = null;
    }

    this.persistSelection(themeId);

    if (!transition) {
      this.state.currentTheme = themeId;
      this.state.transitioning = false;
      this.state.transitionProgress = 1;
      this.toggleDocumentTransitionClass(false);
      this.applyTheme(themeId, 1);
      return;
    }

    const previousTheme = this.state.currentTheme;
    this.state.currentTheme = themeId;
    this.state.transitioning = true;
    this.state.transitionProgress = 0;
    this.toggleDocumentTransitionClass(true);
    this.applyThemeVariables(themeId);
    this.emitThemeChanged(themeId, 0);

    await new Promise<void>((resolve) => {
      this.transition = {
        fromTheme: previousTheme,
        toTheme: themeId,
        elapsedMs: 0,
        resolve,
      };
    });
  }

  private completeTransition(): void {
    if (!this.transition) return;
    const transition = this.transition;
    this.transition = null;
    this.state.transitioning = false;
    this.state.transitionProgress = 1;
    this.toggleDocumentTransitionClass(false);
    this.applyTheme(transition.toTheme, 1);
    transition.resolve();
  }

  private applyTheme(themeId: string, progress: number): void {
    this.applyThemeVariables(themeId);
    if (this.context) {
      this.context.setState({
        theme: themeId,
      });
    }
    this.emitThemeChanged(themeId, progress);
  }

  private emitThemeChanged(themeId: string, progress: number): void {
    if (!this.context) return;
    const theme = this.themes.get(themeId);
    if (!theme) return;

    this.context.emitEvent({
      type: "theme-changed",
      source: this.id,
      timestamp: Date.now(),
      payload: {
        themeId,
        theme,
        autoTheme: this.state.autoTheme,
        transitionProgress: clamp(progress, 0, 1),
        fromTheme: this.transition?.fromTheme ?? themeId,
      },
    });
  }

  private applyThemeVariables(themeId: string): void {
    if (typeof document === "undefined") return;
    const theme = this.themes.get(themeId);
    if (!theme) return;

    const root = document.documentElement;
    root.dataset.vsTheme = themeId;
    root.style.setProperty("--vs-color-primary", theme.colors.primary);
    root.style.setProperty("--vs-color-secondary", theme.colors.secondary);
    root.style.setProperty("--vs-color-accent", theme.colors.accent);
    root.style.setProperty("--vs-color-background", theme.colors.background);
    root.style.setProperty("--vs-color-text", theme.colors.text);
    root.style.setProperty("--vs-color-glow", theme.colors.glow);
    root.style.setProperty(
      "--vs-glow-strength",
      String(theme.shaderParams.glowStrength),
    );
    root.style.setProperty(
      "--vs-holographic-intensity",
      String(theme.shaderParams.holographicIntensity),
    );
    root.style.setProperty(
      "--vs-chromatic-aberration",
      String(theme.shaderParams.chromaticAberration),
    );
    root.style.setProperty(
      "--vs-scanline-speed",
      String(theme.shaderParams.scanlineSpeed),
    );
    root.style.setProperty(
      "--vs-lighting-intensity",
      String(theme.lightingIntensity),
    );
  }

  private toggleDocumentTransitionClass(enabled: boolean): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("theme-transitioning");
      return;
    }
    root.classList.remove("theme-transitioning");
  }

  private resolveAutoThemeId(): string {
    const hour = this.options.getCurrentDate().getHours();
    if (hour >= 6 && hour < 11) return "daybreak";
    if (hour >= 11 && hour < 17) return "aurora";
    if (hour >= 17 && hour < 20) return "neo-sunset";
    if (hour >= 20 || hour < 2) return "midnight-grid";
    return "cyber-ember";
  }

  private readPersistedSelection(): PersistedThemeSelection | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(this.options.storageKey);
    return parsePersistedSelection(raw);
  }

  private persistSelection(themeId = this.state.currentTheme): void {
    if (typeof window === "undefined") return;
    const payload: PersistedThemeSelection = {
      themeId,
      autoTheme: this.state.autoTheme,
    };
    window.localStorage.setItem(
      this.options.storageKey,
      JSON.stringify(payload),
    );
  }
}
