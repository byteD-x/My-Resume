import type {
  GlobalState,
  IShaderPipeline,
  ShaderProgram,
  SystemContext,
  SystemEvent,
} from "@/lib/visual-shock/types";

interface ShaderState {
  shaderCount: number;
  hotReloadEnabled: boolean;
}

interface StoredShaderProgram extends ShaderProgram {
  rawSource: {
    vertex: string;
    fragment: string;
  };
  uniformValues: Record<string, unknown>;
}

const uniformPattern = /uniform\s+\w+\s+(\w+)\s*;/g;
const lineNumberPattern = /ERROR:\s*\d+:(\d+):\s*(.+)$/i;
const MAX_HOT_RELOAD_RETRIES = 2;

const DEFAULT_UNLIT_VERTEX = `
attribute vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}`;

const DEFAULT_UNLIT_FRAGMENT = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

function parseUniforms(source: string): string[] {
  const uniforms = new Set<string>();
  let match = uniformPattern.exec(source);

  while (match) {
    uniforms.add(match[1]);
    match = uniformPattern.exec(source);
  }

  uniformPattern.lastIndex = 0;
  return Array.from(uniforms);
}

function validateSimpleSyntax(shaderName: string, source: string): string[] {
  const errors: string[] = [];
  const openingBraces = (source.match(/{/g) ?? []).length;
  const closingBraces = (source.match(/}/g) ?? []).length;

  if (openingBraces !== closingBraces) {
    errors.push(
      `[${shaderName}] Brace mismatch: ${openingBraces} opening vs ${closingBraces} closing`,
    );
  }

  if (!source.includes("void main")) {
    errors.push(`[${shaderName}] Missing main function`);
  }

  return errors;
}

function compileGLSL(
  type: number,
  source: string,
  gl: WebGLRenderingContext,
): string[] {
  const shader = gl.createShader(type);
  if (!shader) {
    return ["Failed to create WebGL shader object"];
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (compiled) {
    gl.deleteShader(shader);
    return [];
  }

  const info =
    gl.getShaderInfoLog(shader) ?? "Unknown shader compilation error";
  gl.deleteShader(shader);
  const lines = info
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const matched = line.match(lineNumberPattern);
      if (!matched) return line;
      const lineNo = Number(matched[1]);
      const message = matched[2];
      return `Line ${lineNo}: ${message}`;
    });

  return lines.length > 0 ? lines : [info];
}

function compileShaderProgram(
  name: string,
  vertexSource: string,
  fragmentSource: string,
): string[] {
  if (typeof window === "undefined") {
    return [`[${name}] WebGL compile is only available in browser runtime`];
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!context) {
    return [`[${name}] WebGL context unavailable`];
  }

  const gl = context as WebGLRenderingContext;
  const vertexErrors = compileGLSL(gl.VERTEX_SHADER, vertexSource, gl);
  const fragmentErrors = compileGLSL(gl.FRAGMENT_SHADER, fragmentSource, gl);
  return [...vertexErrors, ...fragmentErrors].map(
    (error) => `[${name}] ${error}`,
  );
}

function hexToRgb(input: string): [number, number, number] {
  const normalized = input.startsWith("#") ? input.slice(1) : input;
  if (normalized.length === 3) {
    const r = Number.parseInt(normalized[0] + normalized[0], 16);
    const g = Number.parseInt(normalized[1] + normalized[1], 16);
    const b = Number.parseInt(normalized[2] + normalized[2], 16);
    return [r / 255, g / 255, b / 255];
  }

  if (normalized.length === 6) {
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return [r / 255, g / 255, b / 255];
  }

  return [1, 1, 1];
}

export class ShaderPipeline implements IShaderPipeline {
  readonly id = "shader-pipeline";

  readonly priority = 30;

  enabled = true;

  private readonly programs = new Map<string, StoredShaderProgram>();

  private context: SystemContext | null = null;

  private hotReloadEnabled = false;

  private readonly retryTimers = new Map<string, number>();

  private readonly retryCounts = new Map<string, number>();

  private state: ShaderState = {
    shaderCount: 0,
    hotReloadEnabled: false,
  };

  async initialize(context: SystemContext): Promise<void> {
    this.context = context;
  }

  update(deltaTime: number, state: GlobalState): void {
    void deltaTime;
    void state;
    this.state = {
      shaderCount: this.programs.size,
      hotReloadEnabled: this.hotReloadEnabled,
    };
  }

  dispose(): void {
    this.retryTimers.forEach((timer) => window.clearTimeout(timer));
    this.retryTimers.clear();
    this.retryCounts.clear();
    this.programs.clear();
    this.context = null;
  }

  getState(): ShaderState {
    return this.state;
  }

  setState(state: Partial<ShaderState>): void {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  onEvent(event: SystemEvent): void {
    if (event.type === "theme-changed") {
      const payload = event.payload as
        | {
            theme?: {
              colors: {
                primary: string;
                secondary: string;
                accent: string;
                glow: string;
              };
              shaderParams: {
                holographicIntensity: number;
                glowStrength: number;
                chromaticAberration: number;
                scanlineSpeed: number;
              };
            };
          }
        | undefined;
      if (!payload?.theme) return;

      this.applyThemeUniforms(payload.theme);
      return;
    }

    if (event.type === "webgl-context-restored") {
      const names = Array.from(this.programs.keys());
      void Promise.all(
        names.map(async (name) => {
          const source = this.programs.get(name)?.rawSource;
          if (!source) return;
          await this.loadShader(name, source.vertex, source.fragment);
        }),
      );
      return;
    }

    if (!this.hotReloadEnabled) return;
    if (event.type !== "shader-source-updated") return;

    const payload = event.payload as
      | {
          name: string;
          vertexSource: string;
          fragmentSource: string;
        }
      | undefined;
    if (!payload?.name || !payload.vertexSource || !payload.fragmentSource)
      return;

    void this.loadShader(
      payload.name,
      payload.vertexSource,
      payload.fragmentSource,
    );
  }

  async loadShader(
    name: string,
    vertexSrc: string,
    fragmentSrc: string,
  ): Promise<ShaderProgram> {
    const uniforms = Array.from(
      new Set([...parseUniforms(vertexSrc), ...parseUniforms(fragmentSrc)]),
    );
    const syntaxErrors = [
      ...validateSimpleSyntax(`${name}:vertex`, vertexSrc),
      ...validateSimpleSyntax(`${name}:fragment`, fragmentSrc),
    ];
    const compileErrors =
      syntaxErrors.length > 0
        ? []
        : compileShaderProgram(name, vertexSrc, fragmentSrc);
    const errors = [...syntaxErrors, ...compileErrors];

    let vertexShader = vertexSrc;
    let fragmentShader = fragmentSrc;
    let compiled = errors.length === 0;

    if (errors.length > 0) {
      if (process.env.NODE_ENV === "production") {
        vertexShader = DEFAULT_UNLIT_VERTEX;
        fragmentShader = DEFAULT_UNLIT_FRAGMENT;
        compiled = true;
      } else {
        this.emitCompilationError(name, errors);
        if (this.hotReloadEnabled) {
          this.scheduleHotReloadRetry(name, vertexSrc, fragmentSrc);
        }
      }
    } else {
      const pendingRetry = this.retryTimers.get(name);
      if (pendingRetry) {
        window.clearTimeout(pendingRetry);
        this.retryTimers.delete(name);
      }
      this.retryCounts.delete(name);
    }

    const shader: StoredShaderProgram = {
      name,
      vertexShader,
      fragmentShader,
      uniforms,
      compiled,
      errors,
      rawSource: {
        vertex: vertexSrc,
        fragment: fragmentSrc,
      },
      uniformValues: {},
    };

    this.programs.set(name, shader);
    this.state.shaderCount = this.programs.size;
    return shader;
  }

  getShader(name: string): ShaderProgram | null {
    return this.programs.get(name) ?? null;
  }

  async reloadShader(name: string): Promise<void> {
    const existing = this.programs.get(name);
    if (!existing) {
      throw new Error(`Shader "${name}" is not loaded`);
    }
    await this.loadShader(
      name,
      existing.rawSource.vertex,
      existing.rawSource.fragment,
    );
  }

  setUniform(shaderName: string, uniformName: string, value: unknown): void {
    const shader = this.programs.get(shaderName);
    if (!shader) {
      throw new Error(`Shader "${shaderName}" is not loaded`);
    }

    if (!shader.uniforms.includes(uniformName)) {
      throw new Error(
        `Uniform "${uniformName}" not declared in shader "${shaderName}"`,
      );
    }

    shader.uniformValues[uniformName] = value;
  }

  enableHotReload(): void {
    this.hotReloadEnabled = true;
    this.state.hotReloadEnabled = true;
  }

  disableHotReload(): void {
    this.hotReloadEnabled = false;
    this.state.hotReloadEnabled = false;
  }

  private applyThemeUniforms(theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      glow: string;
    };
    shaderParams: {
      holographicIntensity: number;
      glowStrength: number;
      chromaticAberration: number;
      scanlineSpeed: number;
    };
  }): void {
    const primary = hexToRgb(theme.colors.primary);
    const secondary = hexToRgb(theme.colors.secondary);
    const accent = hexToRgb(theme.colors.accent);
    const glow = hexToRgb(theme.colors.glow);

    this.programs.forEach((program) => {
      const uniformValues = program.uniformValues;
      const has = (name: string) => program.uniforms.includes(name);

      if (has("uThemePrimary")) uniformValues.uThemePrimary = primary;
      if (has("uThemeSecondary")) uniformValues.uThemeSecondary = secondary;
      if (has("uThemeAccent")) uniformValues.uThemeAccent = accent;
      if (has("uThemeGlow")) uniformValues.uThemeGlow = glow;

      if (has("uGlowStrength"))
        uniformValues.uGlowStrength = theme.shaderParams.glowStrength;
      if (has("uHolographicIntensity")) {
        uniformValues.uHolographicIntensity =
          theme.shaderParams.holographicIntensity;
      }
      if (has("uChromaticAberration")) {
        uniformValues.uChromaticAberration =
          theme.shaderParams.chromaticAberration;
      }
      if (has("uScanlineSpeed"))
        uniformValues.uScanlineSpeed = theme.shaderParams.scanlineSpeed;
    });
  }

  private emitCompilationError(name: string, errors: string[]): void {
    if (!this.context) return;
    this.context.emitEvent({
      type: "shader-compilation-error",
      source: this.id,
      timestamp: Date.now(),
      payload: {
        name,
        errors: errors.slice(0, 8),
      },
    });
  }

  private scheduleHotReloadRetry(
    name: string,
    vertexSource: string,
    fragmentSource: string,
  ): void {
    if (typeof window === "undefined") return;
    if (this.retryTimers.has(name)) return;

    const retryCount = this.retryCounts.get(name) ?? 0;
    if (retryCount >= MAX_HOT_RELOAD_RETRIES) return;

    const timer = window.setTimeout(
      () => {
        this.retryTimers.delete(name);
        this.retryCounts.set(name, retryCount + 1);
        void this.loadShader(name, vertexSource, fragmentSource);
      },
      480 * (retryCount + 1),
    );
    this.retryTimers.set(name, timer);
  }
}
