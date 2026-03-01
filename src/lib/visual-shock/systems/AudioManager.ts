import type {
  AudioCueType,
  AudioManagerState,
  GlobalState,
  IAudioManager,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

interface AudioCueConfig {
  frequency: number;
  duration: number;
  gain: number;
  waveform: OscillatorType;
  minIntervalMs: number;
}

const CUE_CONFIG: Record<AudioCueType, AudioCueConfig> = {
  hover: {
    frequency: 520,
    duration: 0.06,
    gain: 0.06,
    waveform: "sine",
    minIntervalMs: 100,
  },
  scroll: {
    frequency: 180,
    duration: 0.05,
    gain: 0.05,
    waveform: "triangle",
    minIntervalMs: 120,
  },
  gesture: {
    frequency: 320,
    duration: 0.11,
    gain: 0.085,
    waveform: "sawtooth",
    minIntervalMs: 90,
  },
  "transition-start": {
    frequency: 280,
    duration: 0.16,
    gain: 0.08,
    waveform: "triangle",
    minIntervalMs: 200,
  },
  "transition-end": {
    frequency: 420,
    duration: 0.15,
    gain: 0.075,
    waveform: "sine",
    minIntervalMs: 200,
  },
  particle: {
    frequency: 240,
    duration: 0.045,
    gain: 0.045,
    waveform: "square",
    minIntervalMs: 80,
  },
  "quality-change": {
    frequency: 260,
    duration: 0.1,
    gain: 0.06,
    waveform: "triangle",
    minIntervalMs: 250,
  },
  error: {
    frequency: 160,
    duration: 0.18,
    gain: 0.065,
    waveform: "square",
    minIntervalMs: 250,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isAutoplayError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.name.toLowerCase();
  const message = error.message.toLowerCase();
  return (
    name.includes("notallowed") ||
    message.includes("gesture") ||
    message.includes("user")
  );
}

export class AudioManagerSystem implements IAudioManager {
  readonly id = "audio-manager";

  readonly priority = 55;

  enabled = true;

  private context: SystemContext | null = null;

  private audioContext: AudioContext | null = null;

  private masterGain: GainNode | null = null;

  private lastCueAt = new Map<AudioCueType, number>();

  private latencyEmitAt = 0;

  private cueCounter = 0;

  private errorCounter = 0;

  private state: AudioManagerState = {
    enabled: true,
    supported: false,
    autoplayBlocked: false,
    masterVolume: 0.75,
    cueCount: 0,
    errorCount: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    const global = context.getState();
    this.state.enabled = global.audioEnabled;
    this.state.masterVolume = clamp(global.masterVolume, 0, 1);
    this.state.supported = this.resolveAudioSupport();

    if (!this.state.supported) {
      this.emitCueEvent("error", true, { reason: "web-audio-unsupported" });
      return;
    }
  }

  update(_deltaTime: number, globalState: GlobalState): void {
    this.enabled = globalState.audioEnabled;
    this.state.enabled = globalState.audioEnabled;

    const volume = clamp(globalState.masterVolume, 0, 1);
    if (volume !== this.state.masterVolume) {
      this.state.masterVolume = volume;
      this.syncMasterGain();
    }

    const now = Date.now();
    if (this.audioContext && now - this.latencyEmitAt >= 1200) {
      this.latencyEmitAt = now;
      const latency =
        (this.audioContext.baseLatency ?? 0) +
        ((this.audioContext as AudioContext).outputLatency ?? 0);
      this.context?.emitEvent({
        type: "audio-latency",
        source: this.id,
        timestamp: now,
        payload: {
          latency: Number.isFinite(latency) ? Math.max(0, latency * 1000) : 0,
        },
      });
    }
  }

  dispose(): void {
    this.lastCueAt.clear();
    if (this.audioContext && this.audioContext.state !== "closed") {
      void this.audioContext.close();
    }
    this.audioContext = null;
    this.masterGain = null;
    this.context = null;
  }

  getState(): AudioManagerState {
    return this.state;
  }

  setState(state: Partial<AudioManagerState>): void {
    this.state = {
      ...this.state,
      ...state,
      masterVolume: clamp(state.masterVolume ?? this.state.masterVolume, 0, 1),
      cueCount: Math.max(0, Math.round(state.cueCount ?? this.state.cueCount)),
      errorCount: Math.max(
        0,
        Math.round(state.errorCount ?? this.state.errorCount),
      ),
    };
    this.syncMasterGain();
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "audio-toggle") {
      const payload = event.payload as { enabled?: boolean } | undefined;
      if (typeof payload?.enabled === "boolean") {
        this.setEnabled(payload.enabled);
      }
      return;
    }

    if (event.type === "audio-master-volume") {
      const payload = event.payload as { volume?: number } | undefined;
      if (typeof payload?.volume === "number") {
        this.setMasterVolume(payload.volume);
      }
      return;
    }

    if (event.type === "audio-user-enable") {
      void this.requestResumeFromUserGesture();
      return;
    }

    if (event.type === "hover-interactive") {
      void this.triggerCue("hover", 1, event.payload);
      return;
    }

    if (event.type === "scroll-motion") {
      const payload = event.payload as { deltaY?: number } | undefined;
      const intensity = clamp(Math.abs(payload?.deltaY ?? 0) / 140, 0.3, 2.2);
      void this.triggerCue("scroll", intensity, event.payload);
      return;
    }

    if (event.type === "gesture-feedback") {
      const payload = event.payload as
        | { velocity?: number; scale?: number }
        | undefined;
      const intensity = clamp(payload?.velocity ?? payload?.scale ?? 1, 0.5, 3);
      void this.triggerCue("gesture", intensity, event.payload);
      return;
    }

    if (
      event.type === "transition-start" ||
      event.type === "audio-crossfade-start"
    ) {
      void this.triggerCue("transition-start", 1, event.payload);
      return;
    }

    if (
      event.type === "transition-end" ||
      event.type === "audio-crossfade-complete"
    ) {
      void this.triggerCue("transition-end", 1, event.payload);
      return;
    }

    if (event.type === "fluid-velocity-spike") {
      const payload = event.payload as { intensity?: number } | undefined;
      void this.triggerCue(
        "particle",
        clamp(payload?.intensity ?? 1, 0.5, 2.5),
        payload,
      );
      return;
    }

    if (event.type === "quality-level-changed") {
      void this.triggerCue("quality-change", 1, event.payload);
      return;
    }

    if (event.type === "physics-warning" || event.type === "asset-load-error") {
      void this.triggerCue("error", 1, event.payload);
    }
  }

  setEnabled(enabled: boolean): void {
    this.state.enabled = enabled;
    this.enabled = enabled;
    this.context?.setState({ audioEnabled: enabled });
    this.syncMasterGain();
  }

  setMasterVolume(volume: number): void {
    this.state.masterVolume = clamp(volume, 0, 1);
    this.context?.setState({ masterVolume: this.state.masterVolume });
    this.syncMasterGain();
  }

  async requestResumeFromUserGesture(): Promise<boolean> {
    const ready = await this.ensureContext(true);
    if (!ready || !this.audioContext) return false;

    try {
      await this.audioContext.resume();
      this.state.autoplayBlocked = this.audioContext.state !== "running";
      if (!this.state.autoplayBlocked) {
        this.context?.emitEvent({
          type: "audio-autoplay-resolved",
          source: this.id,
          timestamp: Date.now(),
          payload: {
            running: true,
          },
        });
      }
      return !this.state.autoplayBlocked;
    } catch (error) {
      this.handleAudioError(error);
      this.state.autoplayBlocked = true;
      return false;
    }
  }

  private resolveAudioSupport(): boolean {
    if (typeof window === "undefined") return false;
    return (
      typeof window.AudioContext !== "undefined" ||
      typeof (window as typeof window & { webkitAudioContext?: AudioContext })
        .webkitAudioContext !== "undefined"
    );
  }

  private createAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;

    try {
      return new Ctor();
    } catch (error) {
      this.handleAudioError(error);
      return null;
    }
  }

  private async ensureContext(fromUserGesture: boolean): Promise<boolean> {
    if (!this.state.supported) return false;

    if (!this.audioContext) {
      this.audioContext = this.createAudioContext();
      if (!this.audioContext) return false;
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.syncMasterGain();
    }

    if (this.isAudioContextRunning()) {
      this.state.autoplayBlocked = false;
      return true;
    }

    if (!fromUserGesture) {
      this.state.autoplayBlocked = true;
      this.context?.emitEvent({
        type: "audio-autoplay-blocked",
        source: this.id,
        timestamp: Date.now(),
        payload: {
          reason: "user-gesture-required",
        },
      });
      return false;
    }

    try {
      await this.audioContext.resume();
      const running = this.isAudioContextRunning();
      this.state.autoplayBlocked = !running;
      return running;
    } catch (error) {
      this.handleAudioError(error);
      this.state.autoplayBlocked = true;
      return false;
    }
  }

  private syncMasterGain(): void {
    if (!this.masterGain) return;
    const targetGain = this.state.enabled ? this.state.masterVolume : 0;
    this.masterGain.gain.value = clamp(targetGain, 0, 1);
  }

  private isAudioContextRunning(): boolean {
    return this.audioContext?.state === "running";
  }

  private async triggerCue(
    type: AudioCueType,
    intensity: number,
    payload?: unknown,
  ): Promise<void> {
    const now = Date.now();
    const config = CUE_CONFIG[type];
    const previousAt = this.lastCueAt.get(type) ?? 0;
    if (now - previousAt < config.minIntervalMs) return;
    this.lastCueAt.set(type, now);

    this.cueCounter += 1;
    this.state.cueCount = this.cueCounter;

    if (!this.state.enabled || !this.state.supported) {
      this.emitCueEvent(type, true, payload);
      return;
    }

    const ready = await this.ensureContext(false);
    if (
      !ready ||
      !this.audioContext ||
      !this.masterGain ||
      this.audioContext.state !== "running"
    ) {
      this.emitCueEvent(type, true, payload);
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      let tailNode: AudioNode = gain;
      if (typeof this.audioContext.createStereoPanner === "function") {
        const panner = this.audioContext.createStereoPanner();
        const pan = this.deriveStereoPan(payload);
        panner.pan.value = pan;
        gain.connect(panner);
        panner.connect(this.masterGain);
        tailNode = panner;
      } else {
        gain.connect(this.masterGain);
      }

      const currentTime = this.audioContext.currentTime;
      const duration = config.duration * clamp(intensity, 0.6, 2.4);
      const peakGain = clamp(
        config.gain * clamp(intensity, 0.4, 2.2),
        0.01,
        0.24,
      );

      oscillator.type = config.waveform;
      oscillator.frequency.setValueAtTime(
        config.frequency * clamp(intensity, 0.7, 1.8),
        currentTime,
      );
      gain.gain.setValueAtTime(0.0001, currentTime);
      gain.gain.linearRampToValueAtTime(peakGain, currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration);

      oscillator.connect(gain);
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration + 0.01);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        tailNode.disconnect?.();
      };

      this.emitCueEvent(type, false, payload);
    } catch (error) {
      this.handleAudioError(error);
      this.emitCueEvent(type, true, payload);
    }
  }

  private deriveStereoPan(payload: unknown): number {
    if (!payload || typeof payload !== "object") return 0;
    const candidate = payload as { x?: number; viewportWidth?: number };
    if (typeof candidate.x !== "number") return 0;
    const width =
      typeof candidate.viewportWidth === "number" && candidate.viewportWidth > 0
        ? candidate.viewportWidth
        : typeof window !== "undefined"
          ? window.innerWidth
          : 1920;
    return clamp((candidate.x / Math.max(width, 1) - 0.5) * 2, -1, 1);
  }

  private emitCueEvent(
    type: AudioCueType,
    silent: boolean,
    payload?: unknown,
  ): void {
    this.context?.emitEvent({
      type: "audio-cue-triggered",
      source: this.id,
      timestamp: Date.now(),
      payload: {
        cue: type,
        silent,
        detail: payload,
      },
    });
  }

  private handleAudioError(error: unknown): void {
    this.errorCounter += 1;
    this.state.errorCount = this.errorCounter;

    const message = error instanceof Error ? error.message : String(error);
    if (isAutoplayError(error)) {
      this.state.autoplayBlocked = true;
      this.context?.emitEvent({
        type: "audio-autoplay-blocked",
        source: this.id,
        timestamp: Date.now(),
        payload: {
          reason: message,
        },
      });
      return;
    }

    this.context?.emitEvent({
      type: "audio-error",
      source: this.id,
      timestamp: Date.now(),
      payload: {
        message,
        errorCount: this.errorCounter,
      },
    });
  }
}
