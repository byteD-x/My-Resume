import type {
  GlobalState,
  IVisualSystem,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";
import {
  detectWebGLSupport,
  type WebGLSupportLevel,
} from "@/lib/visual-shock/utils/webgl";

export type CameraMode = "perspective" | "orthographic";

interface LightState {
  id: string;
  type: "ambient" | "directional" | "point" | "spot";
  intensity: number;
  color: string;
}

interface WebGLRendererState {
  cameraMode: CameraMode;
  cameraPosition: [number, number, number];
  targetCameraPosition: [number, number, number];
  webglSupport: WebGLSupportLevel;
  lights: LightState[];
  postProcessPasses: string[];
  contextLost: boolean;
  contextRecoveries: number;
}

export class WebGLRendererSystem implements IVisualSystem<WebGLRendererState> {
  readonly id = "webgl-renderer";

  readonly priority = 10;

  enabled = true;

  private context: SystemContext | null = null;

  private state: WebGLRendererState = {
    cameraMode: "perspective",
    cameraPosition: [0, 0, 8],
    targetCameraPosition: [0, 0, 8],
    webglSupport: "none",
    lights: [],
    postProcessPasses: [],
    contextLost: false,
    contextRecoveries: 0,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
    this.state.webglSupport = detectWebGLSupport();
  }

  update(deltaTime: number, globalState: GlobalState): void {
    void globalState;
    const smoothing = Math.min(1, deltaTime * 5);
    this.state.cameraPosition = [
      this.state.cameraPosition[0] +
        (this.state.targetCameraPosition[0] - this.state.cameraPosition[0]) *
          smoothing,
      this.state.cameraPosition[1] +
        (this.state.targetCameraPosition[1] - this.state.cameraPosition[1]) *
          smoothing,
      this.state.cameraPosition[2] +
        (this.state.targetCameraPosition[2] - this.state.cameraPosition[2]) *
          smoothing,
    ];
  }

  dispose(): void {
    this.state.lights = [];
    this.state.postProcessPasses = [];
    this.context = null;
  }

  getState(): WebGLRendererState {
    return this.state;
  }

  setState(state: Partial<WebGLRendererState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "webgl-context-lost") {
      this.state.contextLost = true;
      return;
    }

    if (event.type === "webgl-context-restored") {
      this.state.contextLost = false;
      this.state.contextRecoveries += 1;
      this.state.webglSupport = detectWebGLSupport();
      return;
    }

    if (event.type === "webgl-context-restore-failed") {
      this.state.contextLost = true;
      this.state.webglSupport = "none";
      return;
    }

    if (event.type === "theme-changed") {
      const payload = event.payload as
        | {
            theme?: {
              colors?: {
                primary?: string;
                secondary?: string;
                accent?: string;
              };
            };
          }
        | undefined;
      const colors = payload?.theme?.colors;
      if (!colors) return;
      const nextPalette = [
        colors.primary,
        colors.secondary,
        colors.accent,
      ].filter(
        (color): color is string =>
          typeof color === "string" && color.length > 0,
      );
      if (nextPalette.length === 0) return;
      this.state.lights = this.state.lights.map((light, index) => ({
        ...light,
        color: nextPalette[index % nextPalette.length],
      }));
      return;
    }

    if (event.type !== "cursor-move") return;
    const payload = event.payload as
      | { x: number; y: number; viewportWidth: number; viewportHeight: number }
      | undefined;
    if (!payload) return;

    const normalizedX =
      (payload.x / Math.max(payload.viewportWidth, 1) - 0.5) * 2;
    const normalizedY =
      (payload.y / Math.max(payload.viewportHeight, 1) - 0.5) * 2;
    this.state.targetCameraPosition = [
      normalizedX * 0.7,
      -normalizedY * 0.5,
      this.state.cameraPosition[2],
    ];
  }

  setCameraMode(mode: CameraMode): void {
    this.state.cameraMode = mode;
  }

  setCameraTarget(position: [number, number, number]): void {
    this.state.targetCameraPosition = position;
  }

  addLight(light: Omit<LightState, "id">): string {
    const id = `light-${Math.random().toString(36).slice(2, 10)}`;
    this.state.lights.push({ ...light, id });
    return id;
  }

  removeLight(lightId: string): void {
    this.state.lights = this.state.lights.filter(
      (light) => light.id !== lightId,
    );
  }

  addPostProcessPass(passId: string): void {
    if (this.state.postProcessPasses.includes(passId)) return;
    this.state.postProcessPasses.push(passId);
  }

  removePostProcessPass(passId: string): void {
    this.state.postProcessPasses = this.state.postProcessPasses.filter(
      (entry) => entry !== passId,
    );
  }
}
