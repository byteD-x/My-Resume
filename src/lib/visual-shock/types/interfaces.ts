export type QualityLevel = "low" | "medium" | "high";

export interface UserPreferences {
  reducedMotion: boolean;
  theme: string | "auto";
  audioEnabled: boolean;
  quality: "auto" | QualityLevel;
}

export interface GlobalState {
  currentScene: string;
  transitioning: boolean;
  theme: string;
  effectsEnabled: boolean;
  qualityLevel: QualityLevel;
  cursorPosition: { x: number; y: number };
  scrollPosition: number;
  activeGestures: string[];
  fps: number;
  frameTime: number;
  particleCount: number;
  drawCalls: number;
  audioEnabled: boolean;
  masterVolume: number;
  preferences: UserPreferences;
}

export interface SystemEvent<TPayload = unknown> {
  type: string;
  source: string;
  timestamp: number;
  payload?: TPayload;
}

export type EventHandler<TPayload = unknown> = (
  event: SystemEvent<TPayload>,
) => void | Promise<void>;

export type Unsubscribe = () => void;

export interface SystemContext {
  getState: () => GlobalState;
  setState: (partial: Partial<GlobalState>) => void;
  emitEvent: (event: SystemEvent) => void;
}

export interface IVisualSystem<TState extends object = object> {
  id: string;
  priority: number;
  enabled: boolean;
  initialize(context: SystemContext): Promise<void>;
  update(deltaTime: number, state: GlobalState): void;
  dispose(): void;
  getState(): TState;
  setState(state: Partial<TState>): void;
  onEvent(event: SystemEvent): void;
}

export interface IEventManager {
  subscribe(eventType: string, handler: EventHandler): Unsubscribe;
  publish(event: SystemEvent): void;
  publishAsync(event: SystemEvent): Promise<void>;
  clear(eventType?: string): void;
}

export interface CameraTransform {
  position: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
}

export interface TransitionOptions {
  type: string;
  duration: number;
  easing: string;
  cameraAnimation?: CameraTransform;
  audioFade?: boolean;
}

export interface TransitionResult {
  fromSceneId: string;
  toSceneId: string;
  type: string;
  duration: number;
  startedAt: number;
  completedAt: number;
  interrupted: boolean;
  reversed: boolean;
}

export type TransitionCompleteCallback = (result: TransitionResult) => void;

export interface SceneDefinition {
  id: string;
  systems: string[];
  theme?: string;
}

export type TransitionFunction = (
  fromSceneId: string,
  toSceneId: string,
  options: TransitionOptions,
  signal: AbortSignal,
) => Promise<void>;

export interface CoordinatedEffect {
  id: string;
  systemIds: string[];
  duration: number;
  payload?: Record<string, unknown>;
}

export interface ISceneOrchestrator {
  registerSystem(system: IVisualSystem): void;
  unregisterSystem(systemId: string): void;
  getSystemById(systemId: string): IVisualSystem | null;
  registerScene(scene: SceneDefinition): void;
  getCurrentScene(): string;
  transitionTo(sceneId: string, options: TransitionOptions): Promise<void>;
  registerTransition(name: string, transition: TransitionFunction): void;
  preloadScene(sceneId: string): Promise<void>;
  coordinateEffect(effect: CoordinatedEffect): Promise<void>;
  onSceneEnter(sceneId: string, callback: () => void): Unsubscribe;
  onSceneExit(sceneId: string, callback: () => void): Unsubscribe;
  onTransitionComplete(callback: TransitionCompleteCallback): Unsubscribe;
  update(deltaTime: number): void;
}

export interface ShaderProgram {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: string[];
  compiled: boolean;
  errors: string[];
}

export interface IShaderPipeline extends IVisualSystem {
  loadShader(
    name: string,
    vertexSrc: string,
    fragmentSrc: string,
  ): Promise<ShaderProgram>;
  getShader(name: string): ShaderProgram | null;
  reloadShader(name: string): Promise<void>;
  setUniform(shaderName: string, uniformName: string, value: unknown): void;
  enableHotReload(): void;
  disableHotReload(): void;
}

export type ParticleKind = "sparks" | "smoke" | "energy" | "custom";

export interface ParticleForce {
  type: "gravity" | "wind" | "turbulence" | "custom";
  vector: {
    x: number;
    y: number;
  };
  strength: number;
}

export interface EmitterConfig {
  type: ParticleKind;
  rate: number;
  lifetime: [number, number];
  velocity: {
    min: { x: number; y: number };
    max: { x: number; y: number };
  };
  size: [number, number];
  color: {
    from: string;
    to?: string;
  };
  blendMode: "alpha" | "additive";
  physics: boolean;
}

export interface ParticleConfig {
  type: ParticleKind;
  lifetime: [number, number];
  velocity: {
    min: { x: number; y: number };
    max: { x: number; y: number };
  };
  size: [number, number];
  color: {
    from: string;
    to?: string;
  };
  alpha: number;
  blendMode: "alpha" | "additive";
}

export interface RenderParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  kind: ParticleKind;
  blendMode: "alpha" | "additive";
}

export interface ParticleEngineState {
  activeParticleCount: number;
  maxParticles: number;
  emitterCount: number;
  forceCount: number;
}

export interface IParticleEngine extends IVisualSystem<ParticleEngineState> {
  createEmitter(config: EmitterConfig): string;
  removeEmitter(emitterId: string): void;
  updateEmitter(emitterId: string, config: Partial<EmitterConfig>): void;
  emit(
    emitterId: string,
    count: number,
    position: { x: number; y: number },
  ): void;
  burst(
    position: { x: number; y: number },
    count: number,
    config: ParticleConfig,
  ): void;
  addForce(force: ParticleForce): string;
  removeForce(forceId: string): void;
  registerParticleType(type: string, config: Partial<ParticleConfig>): void;
  setMaxParticles(max: number): void;
  getActiveParticleCount(): number;
}

export interface FluidColor {
  r: number;
  g: number;
  b: number;
}

export type FluidRenderMode = "velocity" | "pressure" | "dye";

export interface FluidPoint {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  age: number;
  lifetime: number;
  color: FluidColor;
  intensity: number;
}

export interface FluidSimulatorState {
  viscosity: number;
  density: number;
  resolution: { width: number; height: number };
  renderMode: FluidRenderMode;
  activeDisturbances: number;
  iterations: number;
}

export interface IFluidSimulator extends IVisualSystem<FluidSimulatorState> {
  setViscosity(value: number): void;
  setDensity(value: number): void;
  setResolution(width: number, height: number): void;
  addForce(x: number, y: number, dx: number, dy: number, radius: number): void;
  addDye(x: number, y: number, color: FluidColor, radius: number): void;
  getRenderTarget(): unknown;
  setRenderMode(mode: FluidRenderMode): void;
  setIterations(count: number): void;
  reset(): void;
}

export interface Point {
  x: number;
  y: number;
}

export interface TouchPoint extends Point {
  id: number;
}

export type SwipeDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

export interface GestureControllerState {
  swipeThreshold: number;
  pinchThreshold: number;
  longPressDuration: number;
  activeTouches: TouchPoint[];
}

export interface IGestureController extends IVisualSystem<GestureControllerState> {
  onSwipe(
    callback: (direction: SwipeDirection, velocity: number) => void,
  ): Unsubscribe;
  onPinch(callback: (scale: number, center: Point) => void): Unsubscribe;
  onRotate(callback: (angle: number, center: Point) => void): Unsubscribe;
  onLongPress(
    callback: (position: Point, duration: number) => void,
  ): Unsubscribe;
  setSwipeThreshold(pixels: number): void;
  setPinchThreshold(scale: number): void;
  setLongPressDuration(ms: number): void;
  getActiveTouches(): TouchPoint[];
  getTouchCount(): number;
}

export interface ScrollControllerState {
  scrollY: number;
  scrollX: number;
  scrollJackingEnabled: boolean;
  parallaxLayerCount: number;
}

export interface IScrollController extends IVisualSystem<ScrollControllerState> {
  addParallaxLayer(
    element: HTMLElement,
    speed: number,
    depth: number,
    axis?: "vertical" | "horizontal" | "both",
  ): string;
  removeParallaxLayer(layerId: string): void;
  onScrollTrigger(position: number, callback: () => void): Unsubscribe;
  enableScrollJacking(enabled: boolean): void;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    glow: string;
  };
  shaderParams: {
    holographicIntensity: number;
    glowStrength: number;
    chromaticAberration: number;
    scanlineSpeed: number;
  };
  particleColors: string[];
  lightingIntensity: number;
}

export interface ThemeEngineState {
  currentTheme: string;
  autoTheme: boolean;
  transitioning: boolean;
  transitionProgress: number;
  transitionDuration: number;
}

export interface IThemeEngine extends IVisualSystem<ThemeEngineState> {
  registerTheme(theme: ThemeDefinition): void;
  setTheme(themeId: string, transition: boolean): Promise<void>;
  getCurrentTheme(): string;
  setAutoTheme(enabled: boolean): void;
}

export type PhysicsBodyType = "dynamic" | "static" | "kinematic";

export interface PhysicsVector2 {
  x: number;
  y: number;
}

export interface RigidBodyConfig {
  type: PhysicsBodyType;
  position: PhysicsVector2;
  velocity?: PhysicsVector2;
  mass?: number;
  radius?: number;
  friction?: number;
  restitution?: number;
}

export interface MagneticFieldConfig {
  position: PhysicsVector2;
  radius: number;
  strength: number;
  mode?: "attract" | "repel";
}

export interface PhysicsEngineState {
  bodyCount: number;
  magneticFieldCount: number;
  gravity: PhysicsVector2;
  errorCount: number;
}

export interface PhysicsBodySnapshot {
  id: string;
  type: PhysicsBodyType;
  position: PhysicsVector2;
  velocity: PhysicsVector2;
  mass: number;
  radius: number;
}

export interface IPhysicsEngine extends IVisualSystem<PhysicsEngineState> {
  createRigidBody(config: RigidBodyConfig): string;
  removeRigidBody(bodyId: string): void;
  applyForce(bodyId: string, force: PhysicsVector2): void;
  createMagneticField(config: MagneticFieldConfig): string;
  updateMagneticField(
    fieldId: string,
    partial: Partial<MagneticFieldConfig>,
  ): void;
  removeMagneticField(fieldId: string): void;
  getBodySnapshot(bodyId: string): PhysicsBodySnapshot | null;
}

export type AudioCueType =
  | "hover"
  | "scroll"
  | "gesture"
  | "transition-start"
  | "transition-end"
  | "particle"
  | "quality-change"
  | "error";

export interface AudioManagerState {
  enabled: boolean;
  supported: boolean;
  autoplayBlocked: boolean;
  masterVolume: number;
  cueCount: number;
  errorCount: number;
}

export interface IAudioManager extends IVisualSystem<AudioManagerState> {
  setEnabled(enabled: boolean): void;
  setMasterVolume(volume: number): void;
  requestResumeFromUserGesture(): Promise<boolean>;
}
