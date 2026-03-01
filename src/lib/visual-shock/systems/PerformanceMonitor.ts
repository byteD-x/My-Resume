import type {
  GlobalState,
  IVisualSystem,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

interface FrameMetric {
  timestamp: number;
  fps: number;
  frameTime: number;
  drawCalls: number;
  particleCount: number;
}

interface PerformanceMonitorState {
  visible: boolean;
  fps: number;
  frameTime: number;
  drawCalls: number;
  particleCount: number;
  audioLatency: number;
  degradationStage: number;
  assetErrorCount: number;
}

export class PerformanceMonitorSystem implements IVisualSystem<PerformanceMonitorState> {
  readonly id = "performance-monitor";

  readonly priority = 100;

  enabled = true;

  private context: SystemContext | null = null;

  private readonly metricsHistory: FrameMetric[] = [];

  private lastWarningAt = 0;

  private state: PerformanceMonitorState = {
    visible: false,
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    particleCount: 0,
    audioLatency: 0,
    degradationStage: 0,
    assetErrorCount: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
  }

  update(deltaTime: number, state: GlobalState): void {
    const frameTime = Math.max(deltaTime * 1000, 0);
    const fps = frameTime === 0 ? 60 : Math.min(240, 1000 / frameTime);
    const metric: FrameMetric = {
      timestamp: Date.now(),
      fps,
      frameTime,
      drawCalls: state.drawCalls,
      particleCount: state.particleCount,
    };

    this.metricsHistory.push(metric);
    if (this.metricsHistory.length > 300) {
      this.metricsHistory.shift();
    }

    this.state.fps = fps;
    this.state.frameTime = frameTime;
    this.state.drawCalls = state.drawCalls;
    this.state.particleCount = state.particleCount;

    if (fps < 50) {
      this.warnLowPerformance(fps);
    }
  }

  dispose(): void {
    this.metricsHistory.length = 0;
    this.context = null;
  }

  getState(): PerformanceMonitorState {
    return this.state;
  }

  setState(state: Partial<PerformanceMonitorState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "keyboard-shortcut") {
      const payload = event.payload as { key: string } | undefined;
      if (payload?.key.toLowerCase() === "p") {
        this.state.visible = !this.state.visible;
      }
      return;
    }

    if (event.type === "audio-latency") {
      const payload = event.payload as { latency: number } | undefined;
      if (!payload) return;
      this.state.audioLatency = Number.isFinite(payload.latency)
        ? Math.max(0, payload.latency)
        : 0;
      return;
    }

    if (event.type === "performance-degradation-stage") {
      const payload = event.payload as { stage?: number } | undefined;
      if (typeof payload?.stage !== "number") return;
      this.state.degradationStage = Math.max(0, Math.round(payload.stage));
      return;
    }

    if (event.type === "asset-load-error") {
      this.state.assetErrorCount += 1;
    }
  }

  exportMetrics(): string {
    return JSON.stringify(
      {
        summary: this.state,
        recentFrames: this.metricsHistory,
      },
      null,
      2,
    );
  }

  private warnLowPerformance(fps: number): void {
    const now = Date.now();
    if (now - this.lastWarningAt < 5000) return;
    this.lastWarningAt = now;
    console.warn(
      `[visual-shock] performance warning: FPS dropped below 50 (current=${fps.toFixed(1)})`,
    );
  }
}
