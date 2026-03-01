"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AudioManagerSystem,
  EventManager,
  evaluateQualityAdjustment,
  FluidSimulatorSystem,
  GestureControllerSystem,
  loadAssetWithRetry,
  ParticleEngineSystem,
  PerformanceMonitorSystem,
  PhysicsEngineSystem,
  SceneOrchestrator,
  ScrollControllerSystem,
  ShaderPipeline,
  SHADER_LIBRARY,
  ThemeEngineSystem,
  WebGLRendererSystem,
  detectWebGLSupport,
  registerBuiltInTransitions,
  visualShockStore,
} from "@/lib/visual-shock";
import { FluidOverlay } from "@/components/visual-shock/FluidOverlay";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ParticleOverlay } from "@/components/visual-shock/ParticleOverlay";
import { PerformanceHUD } from "@/components/visual-shock/PerformanceHUD";
import { WebGLFallback } from "@/components/visual-shock/WebGLFallback";
import type { CameraMode } from "@/lib/visual-shock/systems/WebGLRenderer";
import type { QualityLevel, SystemContext } from "@/lib/visual-shock/types";
import type { WebGLSupportLevel } from "@/lib/visual-shock/utils/webgl";

const HeroScene = dynamic(() => import("@/components/visual-shock/HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface FrameMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
}

interface ParallaxLayerConfig {
  key: string;
  speed: number;
  depth: number;
  axis: "vertical" | "horizontal" | "both";
  className: string;
  style?: CSSProperties;
}

const PARALLAX_LAYER_CONFIG: ParallaxLayerConfig[] = [
  {
    key: "layer-a",
    speed: 0.02,
    depth: -7.2,
    axis: "vertical",
    className:
      "absolute -top-[24%] left-[5%] h-[32rem] w-[32rem] rounded-full bg-cyan-300/16 blur-[140px]",
  },
  {
    key: "layer-b",
    speed: 0.035,
    depth: -5.6,
    axis: "both",
    className:
      "absolute top-[8%] right-[7%] h-[28rem] w-[28rem] rounded-full bg-blue-300/14 blur-[130px]",
  },
  {
    key: "layer-c",
    speed: 0.05,
    depth: -4.1,
    axis: "horizontal",
    className:
      "absolute bottom-[8%] left-[18%] h-[26rem] w-[26rem] rounded-full bg-sky-200/16 blur-[120px]",
  },
  {
    key: "layer-d",
    speed: 0.065,
    depth: -2.8,
    axis: "vertical",
    className:
      "absolute top-[44%] left-[50%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-cyan-200/14 blur-[95px]",
  },
  {
    key: "layer-e",
    speed: 0.08,
    depth: -1.6,
    axis: "both",
    className:
      "absolute -bottom-[12%] right-[12%] h-[20rem] w-[20rem] rounded-full bg-blue-200/16 blur-[100px]",
  },
  {
    key: "layer-f",
    speed: 0.1,
    depth: -0.5,
    axis: "horizontal",
    className:
      "absolute inset-x-0 top-[15%] h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent opacity-90",
    style: { transformOrigin: "center center" },
  },
  {
    key: "layer-g",
    speed: 0.12,
    depth: 0.3,
    axis: "vertical",
    className:
      "absolute inset-x-0 bottom-[24%] h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent opacity-80",
    style: { transformOrigin: "center center" },
  },
  {
    key: "layer-h",
    speed: 0.14,
    depth: 1.1,
    axis: "both",
    className:
      "absolute -left-[8%] top-[66%] h-28 w-28 rounded-full border border-sky-300/45 bg-white/20 blur-sm",
  },
];

const THEME_SHORTCUT_MAP: Record<string, string> = {
  "1": "aurora",
  "2": "daybreak",
  "3": "neo-sunset",
  "4": "midnight-grid",
  "5": "cyber-ember",
};

type PerformanceDegradationStage = 0 | 1 | 2 | 3 | 4 | 5;

export default function VisualShock() {
  const prefersReducedMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const isAutomatedBrowser =
    typeof navigator !== "undefined" && navigator.webdriver;
  const pointerRef = useRef({ x: 0, y: 0 });
  const warningAtRef = useRef(0);
  const lastMetricsCommitRef = useRef(0);
  const lastHoverElementRef = useRef<Element | null>(null);
  const lastScrollYRef = useRef(0);
  const pointerDownRef = useRef(false);
  const lastFluidPointRef = useRef({ x: 0, y: 0 });
  const nextFluidEmitAtRef = useRef(0);
  const parallaxLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const parallaxLayerIdsRef = useRef<string[]>([]);
  const scrollTriggerUnsubscribersRef = useRef<Array<() => void>>([]);
  const gestureUnsubscribersRef = useRef<Array<() => void>>([]);
  const lowFpsSinceRef = useRef<number | null>(null);
  const highFpsSinceRef = useRef<number | null>(null);
  const criticalLowFpsSinceRef = useRef<number | null>(null);
  const stableHighFpsSinceRef = useRef<number | null>(null);
  const degradationStageRef = useRef<PerformanceDegradationStage>(0);

  const [systemsReady, setSystemsReady] = useState(false);
  const [webglSupport] = useState<WebGLSupportLevel>(() =>
    detectWebGLSupport(),
  );
  const [cameraMode, setCameraMode] = useState<CameraMode>("perspective");
  const [showPerformanceHUD, setShowPerformanceHUD] = useState(false);
  const [runtimeFallbackReason, setRuntimeFallbackReason] = useState<
    string | null
  >(null);
  const [runtimeNotice, setRuntimeNotice] = useState<string | null>(null);
  const [shaderErrors, setShaderErrors] = useState<string[]>([]);
  const [audioAutoplayBlocked, setAudioAutoplayBlocked] = useState(false);
  const [degradationStage, setDegradationStage] =
    useState<PerformanceDegradationStage>(0);
  const [manualQualityOverride, setManualQualityOverride] =
    useState<QualityLevel | null>(null);
  const [heroShadowsEnabled, setHeroShadowsEnabled] = useState(true);
  const [metrics, setMetrics] = useState<FrameMetrics>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
  });
  const shouldUseFallback =
    Boolean(runtimeFallbackReason) ||
    isAutomatedBrowser ||
    prefersReducedMotion ||
    isLowPerformanceMode ||
    webglSupport === "none";

  const eventManager = useMemo(() => new EventManager(), []);
  const webglRenderer = useMemo(() => new WebGLRendererSystem(), []);
  const fluidSimulator = useMemo(() => new FluidSimulatorSystem(), []);
  const particleEngine = useMemo(() => new ParticleEngineSystem(), []);
  const shaderPipeline = useMemo(() => new ShaderPipeline(), []);
  const performanceMonitor = useMemo(() => new PerformanceMonitorSystem(), []);
  const physicsEngine = useMemo(() => new PhysicsEngineSystem(), []);
  const audioManager = useMemo(() => new AudioManagerSystem(), []);
  const gestureController = useMemo(
    () =>
      new GestureControllerSystem({
        getRootElement: () =>
          typeof document === "undefined" ? null : document.body,
      }),
    [],
  );
  const scrollController = useMemo(() => new ScrollControllerSystem(), []);
  const themeEngine = useMemo(() => new ThemeEngineSystem(), []);

  const preloadSceneAssets = useCallback(
    async (sceneId: string) => {
      const preload = async (
        assetId: string,
        loader: () => Promise<unknown>,
        fallbackLoader?: () => Promise<unknown>,
      ) => {
        await loadAssetWithRetry({
          assetId,
          loader,
          fallbackLoader,
          maxAttempts: 3,
          baseDelayMs: 120,
          onAttemptError: (error, attempt) => {
            eventManager.publish({
              type: "asset-load-error",
              source: "visual-shock",
              timestamp: Date.now(),
              payload: {
                assetId,
                sceneId,
                attempt,
                message: error instanceof Error ? error.message : String(error),
              },
            });
          },
          onFallback: (error) => {
            eventManager.publish({
              type: "asset-load-fallback",
              source: "visual-shock",
              timestamp: Date.now(),
              payload: {
                assetId,
                sceneId,
                message: error instanceof Error ? error.message : String(error),
              },
            });
          },
        });
      };

      if (sceneId === "hero") {
        await preload(
          "hero-scene",
          () => import("@/components/visual-shock/HeroScene"),
          () => import("@/components/visual-shock/WebGLFallback"),
        );
        return;
      }

      if (sceneId === "impact") {
        await Promise.all([
          preload("highlight-deck", () => import("@/components/HighlightDeck")),
          preload(
            "timeline",
            () => import("@/components/Timeline/TimelineNew"),
            () => import("@/components/HighlightDeck"),
          ),
        ]);
        return;
      }

      if (sceneId === "projects") {
        await Promise.all([
          preload("project-list", () => import("@/components/ProjectList")),
          preload(
            "services",
            () => import("@/components/Services"),
            () => import("@/components/ProjectList"),
          ),
        ]);
        return;
      }

      if (sceneId === "contact") {
        await preload("contact", () => import("@/components/Contact"));
      }
    },
    [eventManager],
  );

  const orchestrator = useMemo(
    () =>
      new SceneOrchestrator({
        getState: () => visualShockStore.getState(),
        setState: (partial) => visualShockStore.setState(partial),
        emitEvent: (event) => eventManager.publish(event),
        preloadSceneAssets,
      }),
    [eventManager, preloadSceneAssets],
  );

  const applyQualityLevel = useCallback(
    (level: QualityLevel) => {
      const store = visualShockStore.getState();
      if (store.qualityLevel === level) return;
      store.setQualityLevel(level);

      if (level === "high") {
        particleEngine.setMaxParticles(6000);
        fluidSimulator.setIterations(18);
        fluidSimulator.setViscosity(0.6);
        fluidSimulator.setDensity(0.75);
        physicsEngine.enabled = true;
        setHeroShadowsEnabled(true);
        scrollController.enableScrollJacking(false);
      } else if (level === "medium") {
        particleEngine.setMaxParticles(4200);
        fluidSimulator.setIterations(14);
        fluidSimulator.setViscosity(0.72);
        fluidSimulator.setDensity(0.8);
        physicsEngine.enabled = true;
        scrollController.enableScrollJacking(false);
      } else {
        particleEngine.setMaxParticles(2600);
        fluidSimulator.setIterations(10);
        fluidSimulator.setViscosity(0.88);
        fluidSimulator.setDensity(0.92);
        audioManager.setMasterVolume(
          Math.min(audioManager.getState().masterVolume, 0.68),
        );
        scrollController.enableScrollJacking(false);
      }

      eventManager.publish({
        type: "quality-level-changed",
        source: "visual-shock",
        timestamp: Date.now(),
        payload: {
          level,
        },
      });
    },
    [
      audioManager,
      eventManager,
      fluidSimulator,
      particleEngine,
      physicsEngine,
      scrollController,
    ],
  );

  const applyDegradationStage = useCallback(
    (stage: PerformanceDegradationStage) => {
      degradationStageRef.current = stage;
      setDegradationStage(stage);

      const postProcessingEnabled = stage < 2;
      const shadowsEnabled = stage < 3;
      const fluidEnabled = stage < 4;
      const physicsEnabled = stage < 5;

      setHeroShadowsEnabled(shadowsEnabled);
      fluidSimulator.enabled = fluidEnabled;
      physicsEngine.enabled = physicsEnabled;

      if (stage >= 1) {
        particleEngine.setMaxParticles(1800);
      } else {
        const quality = visualShockStore.getState().qualityLevel;
        particleEngine.setMaxParticles(
          quality === "high" ? 6000 : quality === "medium" ? 4200 : 2600,
        );
      }

      webglRenderer.setState({
        postProcessPasses: postProcessingEnabled
          ? webglRenderer.getState().postProcessPasses
          : [],
      });

      eventManager.publish({
        type: "performance-degradation-stage",
        source: "visual-shock",
        timestamp: Date.now(),
        payload: {
          stage,
          postProcessingEnabled,
          shadowsEnabled,
          fluidEnabled,
          physicsEnabled,
        },
      });
    },
    [
      eventManager,
      fluidSimulator,
      particleEngine,
      physicsEngine,
      webglRenderer,
    ],
  );

  const handleWebGLContextEvent = useCallback(
    (
      eventType: "context-lost" | "context-restored" | "context-restore-failed",
    ) => {
      if (eventType === "context-lost") {
        setRuntimeNotice("检测到 WebGL 上下文丢失，正在尝试自动恢复...");
        eventManager.publish({
          type: "webgl-context-lost",
          source: "hero-scene",
          timestamp: Date.now(),
        });
        return;
      }

      if (eventType === "context-restored") {
        setRuntimeFallbackReason(null);
        setRuntimeNotice("WebGL 上下文已恢复，视觉系统已重新初始化。");
        eventManager.publish({
          type: "webgl-context-restored",
          source: "hero-scene",
          timestamp: Date.now(),
        });
        window.setTimeout(() => {
          setRuntimeNotice((current) =>
            current === "WebGL 上下文已恢复，视觉系统已重新初始化。"
              ? null
              : current,
          );
        }, 2800);
        return;
      }

      setRuntimeFallbackReason("webgl-context-restore-failed");
      setRuntimeNotice("WebGL 恢复失败，已自动降级到 CSS 视觉模式。");
      eventManager.publish({
        type: "webgl-context-restore-failed",
        source: "hero-scene",
        timestamp: Date.now(),
      });
    },
    [eventManager],
  );

  useEffect(() => {
    if (typeof window === "undefined" || shouldUseFallback) return;

    let disposed = false;

    const context: SystemContext = {
      getState: () => visualShockStore.getState(),
      setState: (partial) => visualShockStore.setState(partial),
      emitEvent: (event) => eventManager.publish(event),
    };

    const systems = [
      webglRenderer,
      fluidSimulator,
      particleEngine,
      shaderPipeline,
      performanceMonitor,
      physicsEngine,
      audioManager,
      gestureController,
      scrollController,
      themeEngine,
    ];

    const unsubscribe = eventManager.subscribe("*", (event) => {
      if (event.type === "audio-autoplay-blocked") {
        setAudioAutoplayBlocked(true);
      } else if (event.type === "audio-autoplay-resolved") {
        setAudioAutoplayBlocked(false);
      } else if (event.type === "webgl-context-restored") {
        setShaderErrors([]);
      } else if (event.type === "shader-compilation-error") {
        const payload = event.payload as { errors?: string[] } | undefined;
        if (payload?.errors && payload.errors.length > 0) {
          setShaderErrors(payload.errors.slice(0, 8));
        }
      } else if (event.type === "asset-load-error") {
        setRuntimeNotice("部分资源加载失败，系统正在自动重试并降级。");
      } else if (event.type === "asset-load-fallback") {
        setRuntimeNotice("已自动切换到低质量资源以保证可用性。");
      } else if (event.type === "audio-error") {
        setRuntimeNotice("音频系统出现异常，已切换到静默模式。");
      }

      systems.forEach((system) => {
        if (!system.enabled) return;
        system.onEvent(event);
      });
    });

    systems.forEach((system) => orchestrator.registerSystem(system));
    registerBuiltInTransitions(orchestrator);

    const sceneSystems = systems.map((system) => system.id);
    orchestrator.registerScene({
      id: "hero",
      systems: sceneSystems,
      theme: "aurora",
    });
    orchestrator.registerScene({
      id: "impact",
      systems: sceneSystems,
      theme: "daybreak",
    });
    orchestrator.registerScene({
      id: "projects",
      systems: sceneSystems,
      theme: "neo-sunset",
    });
    orchestrator.registerScene({
      id: "contact",
      systems: sceneSystems,
      theme: "midnight-grid",
    });

    void (async () => {
      try {
        await Promise.all(systems.map((system) => system.initialize(context)));
        await Promise.all(
          Object.entries(SHADER_LIBRARY).map(([name, source]) =>
            shaderPipeline.loadShader(
              name,
              source.vertexShader,
              source.fragmentShader,
            ),
          ),
        );

        if (disposed) return;

        const preferredTheme = visualShockStore.getState().preferences.theme;
        if (preferredTheme !== "auto") {
          try {
            await themeEngine.setTheme(preferredTheme, false);
          } catch {
            themeEngine.setAutoTheme(true);
          }
        } else {
          themeEngine.setAutoTheme(true);
        }

        scrollController.enableScrollJacking(false);

        await orchestrator.transitionTo("hero", {
          type: "fade",
          duration: 420,
          easing: "easeOutCubic",
        });

        if (disposed) return;
        setSystemsReady(true);
      } catch (error) {
        console.error("[visual-shock] initialization failed", error);
      }
    })();

    return () => {
      disposed = true;
      setSystemsReady(false);
      unsubscribe();
      systems.forEach((system) => system.dispose());
    };
  }, [
    audioManager,
    eventManager,
    fluidSimulator,
    gestureController,
    isLowPerformanceMode,
    orchestrator,
    particleEngine,
    performanceMonitor,
    physicsEngine,
    prefersReducedMotion,
    scrollController,
    shaderPipeline,
    shouldUseFallback,
    themeEngine,
    webglRenderer,
  ]);

  useEffect(() => {
    if (typeof window === "undefined" || shouldUseFallback) return;

    let rafId = 0;
    let previous = performance.now();

    const loop = (timestamp: number) => {
      const deltaSeconds = Math.max((timestamp - previous) / 1000, 0);
      previous = timestamp;
      orchestrator.update(deltaSeconds);
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [orchestrator, shouldUseFallback]);

  useEffect(() => {
    if (!runtimeNotice) return;
    const timer = window.setTimeout(() => {
      setRuntimeNotice((current) =>
        current === runtimeNotice ? null : current,
      );
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [runtimeNotice]);

  useEffect(() => {
    if (!systemsReady || typeof window === "undefined") return;

    const clearParallaxLayers = () => {
      parallaxLayerIdsRef.current.forEach((layerId) => {
        scrollController.removeParallaxLayer(layerId);
      });
      parallaxLayerIdsRef.current = [];
    };

    const clearScrollTriggers = () => {
      scrollTriggerUnsubscribersRef.current.forEach((unsubscribe) =>
        unsubscribe(),
      );
      scrollTriggerUnsubscribersRef.current = [];
    };

    const clearGestureBindings = () => {
      gestureUnsubscribersRef.current.forEach((unsubscribe) => unsubscribe());
      gestureUnsubscribersRef.current = [];
    };

    const registerParallaxLayers = () => {
      clearParallaxLayers();
      PARALLAX_LAYER_CONFIG.forEach((layer, index) => {
        const element = parallaxLayerRefs.current[index];
        if (!element) return;
        const layerId = scrollController.addParallaxLayer(
          element,
          layer.speed,
          layer.depth,
          layer.axis,
        );
        parallaxLayerIdsRef.current.push(layerId);
      });
    };

    const registerScrollSceneTriggers = () => {
      clearScrollTriggers();
      const sceneSectionMap = [
        { sectionId: "impact", sceneId: "impact" },
        { sectionId: "projects", sceneId: "projects" },
        { sectionId: "contact", sceneId: "contact" },
      ];

      sceneSectionMap.forEach(({ sectionId, sceneId }) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        const triggerPosition = Math.max(
          0,
          section.offsetTop - window.innerHeight * 0.45,
        );
        const unsubscribe = scrollController.onScrollTrigger(
          triggerPosition,
          () => {
            if (orchestrator.getCurrentScene() === sceneId) return;
            void orchestrator.transitionTo(sceneId, {
              type: "fade",
              duration: 600,
              easing: "easeOutCubic",
            });
          },
        );
        scrollTriggerUnsubscribersRef.current.push(unsubscribe);
      });
    };

    clearGestureBindings();
    gestureUnsubscribersRef.current.push(
      gestureController.onSwipe((direction, velocity) => {
        visualShockStore.getState().setActiveGestures([`swipe:${direction}`]);
        if (
          velocity > 1.8 &&
          (direction === "left" ||
            direction === "up-left" ||
            direction === "down-left")
        ) {
          void themeEngine.setTheme("midnight-grid", true);
        }
      }),
    );
    gestureUnsubscribersRef.current.push(
      gestureController.onPinch((scale) => {
        visualShockStore
          .getState()
          .setActiveGestures([`pinch:${scale.toFixed(2)}`]);
        if (scale > 1.08) {
          applyQualityLevel("high");
        }
      }),
    );
    gestureUnsubscribersRef.current.push(
      gestureController.onRotate((angle) => {
        visualShockStore
          .getState()
          .setActiveGestures([`rotate:${Math.round(angle)}`]);
        if (Math.abs(angle) > 35) {
          void themeEngine.setTheme("cyber-ember", true);
        }
      }),
    );
    gestureUnsubscribersRef.current.push(
      gestureController.onLongPress((_position, duration) => {
        visualShockStore
          .getState()
          .setActiveGestures([`longpress:${Math.round(duration)}`]);
        setShowPerformanceHUD((current) => !current);
      }),
    );

    registerParallaxLayers();
    registerScrollSceneTriggers();

    const onResize = () => {
      registerParallaxLayers();
      registerScrollSceneTriggers();
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      clearParallaxLayers();
      clearScrollTriggers();
      clearGestureBindings();
    };
  }, [
    applyQualityLevel,
    gestureController,
    orchestrator,
    scrollController,
    systemsReady,
    themeEngine,
  ]);

  useEffect(() => {
    if (typeof window === "undefined" || shouldUseFallback) return;

    const handleMouseMove = (event: MouseEvent) => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const normalizedX = (event.clientX / width - 0.5) * 2;
      const normalizedY = (event.clientY / height - 0.5) * 2;

      pointerRef.current.x = normalizedX;
      pointerRef.current.y = normalizedY;

      visualShockStore
        .getState()
        .setCursorPosition(event.clientX, event.clientY);
      eventManager.publish({
        type: "cursor-move",
        source: "window",
        timestamp: Date.now(),
        payload: {
          x: event.clientX,
          y: event.clientY,
          viewportWidth: width,
          viewportHeight: height,
        },
      });

      const interactiveTarget =
        event.target instanceof Element
          ? event.target.closest(
              'a,button,[role="button"],[data-interactive="true"],input,textarea,select',
            )
          : null;

      if (
        interactiveTarget &&
        interactiveTarget !== lastHoverElementRef.current
      ) {
        lastHoverElementRef.current = interactiveTarget;
        eventManager.publish({
          type: "hover-interactive",
          source: "window",
          timestamp: Date.now(),
          payload: {
            x: event.clientX,
            y: event.clientY,
          },
        });
      } else if (!interactiveTarget) {
        lastHoverElementRef.current = null;
      }
    };

    const handleScroll = () => {
      visualShockStore.getState().setScrollPosition(window.scrollY);

      const deltaY = window.scrollY - lastScrollYRef.current;
      lastScrollYRef.current = window.scrollY;
      if (Math.abs(deltaY) < 1) return;

      eventManager.publish({
        type: "scroll-motion",
        source: "window",
        timestamp: Date.now(),
        payload: {
          x: visualShockStore.getState().cursorPosition.x,
          y: visualShockStore.getState().cursorPosition.y,
          deltaY,
        },
      });
    };

    const publishFluidInteraction = (
      x: number,
      y: number,
      dx: number,
      dy: number,
    ) => {
      eventManager.publish({
        type: "fluid-interaction",
        source: "window",
        timestamp: Date.now(),
        payload: {
          x,
          y,
          dx,
          dy,
          radius: 52,
        },
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerDownRef.current = true;
      lastFluidPointRef.current = { x: event.clientX, y: event.clientY };
      publishFluidInteraction(event.clientX, event.clientY, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerDownRef.current) return;
      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now < nextFluidEmitAtRef.current) return;
      nextFluidEmitAtRef.current = now + 16;

      const previous = lastFluidPointRef.current;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      lastFluidPointRef.current = { x: event.clientX, y: event.clientY };

      publishFluidInteraction(event.clientX, event.clientY, dx * 20, dy * 20);
    };

    const handlePointerUp = () => {
      pointerDownRef.current = false;
    };

    const handleResize = () => {
      eventManager.publish({
        type: "viewport-resize",
        source: "window",
        timestamp: Date.now(),
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "p") {
        setShowPerformanceHUD((current) => !current);
        eventManager.publish({
          type: "keyboard-shortcut",
          source: "window",
          timestamp: Date.now(),
          payload: { key },
        });
        return;
      }

      if (key === "c") {
        setCameraMode((current) => {
          const nextMode: CameraMode =
            current === "perspective" ? "orthographic" : "perspective";
          webglRenderer.setCameraMode(nextMode);
          return nextMode;
        });
        return;
      }

      if (key === "t") {
        themeEngine.setAutoTheme(!themeEngine.getState().autoTheme);
        return;
      }

      if (key === "j") {
        scrollController.enableScrollJacking(
          !scrollController.getState().scrollJackingEnabled,
        );
        return;
      }

      if (key === "q") {
        const current = visualShockStore.getState().qualityLevel;
        const next: QualityLevel =
          current === "high" ? "medium" : current === "medium" ? "low" : "high";
        setManualQualityOverride(next);
        applyQualityLevel(next);
        setRuntimeNotice(
          `已手动切换画质到 ${next.toUpperCase()}。按 U 可恢复自动调节。`,
        );
        return;
      }

      if (key === "u") {
        setManualQualityOverride(null);
        setRuntimeNotice("已恢复自动画质调节。");
        return;
      }

      if (key === "m") {
        const enabled = !visualShockStore.getState().audioEnabled;
        visualShockStore.getState().setAudioEnabled(enabled);
        eventManager.publish({
          type: "audio-toggle",
          source: "window",
          timestamp: Date.now(),
          payload: { enabled },
        });
        return;
      }

      const shortcutTheme = THEME_SHORTCUT_MAP[key];
      if (shortcutTheme) {
        void themeEngine.setTheme(shortcutTheme, true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerUp, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    lastScrollYRef.current = window.scrollY;
    handleResize();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    applyQualityLevel,
    eventManager,
    scrollController,
    shouldUseFallback,
    themeEngine,
    webglRenderer,
  ]);

  const handleFrameMetrics = useCallback(
    (next: FrameMetrics) => {
      const nowPerf =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      if (nowPerf - lastMetricsCommitRef.current < 120) return;
      lastMetricsCommitRef.current = nowPerf;

      if (showPerformanceHUD) {
        setMetrics(next);
      }

      visualShockStore.getState().setPerformanceMetrics({
        fps: next.fps,
        frameTime: next.frameTime,
        drawCalls: next.drawCalls,
      });

      const now = Date.now();
      if (next.fps < 50 && now - warningAtRef.current >= 5000) {
        warningAtRef.current = now;
        console.warn(
          `[visual-shock] performance warning: fps dropped below 50 (${next.fps.toFixed(1)})`,
        );
      }

      if (!manualQualityOverride) {
        const decision = evaluateQualityAdjustment({
          currentLevel: visualShockStore.getState().qualityLevel,
          fps: next.fps,
          now,
          lowFpsSince: lowFpsSinceRef.current,
          highFpsSince: highFpsSinceRef.current,
        });
        lowFpsSinceRef.current = decision.lowFpsSince;
        highFpsSinceRef.current = decision.highFpsSince;
        if (decision.nextLevel) {
          applyQualityLevel(decision.nextLevel);
        }
      }

      if (!manualQualityOverride) {
        if (next.fps < 30) {
          stableHighFpsSinceRef.current = null;
          if (criticalLowFpsSinceRef.current === null) {
            criticalLowFpsSinceRef.current = now;
          }

          const lowDuration = now - criticalLowFpsSinceRef.current;
          const currentStage = degradationStageRef.current;
          if (lowDuration >= 1400 && currentStage < 5) {
            const nextStage = (currentStage + 1) as PerformanceDegradationStage;
            applyDegradationStage(nextStage);
            criticalLowFpsSinceRef.current = now;
            setRuntimeNotice(
              `检测到低帧率，已触发第 ${nextStage} 级性能降级。`,
            );
          }
        } else {
          criticalLowFpsSinceRef.current = null;
          if (next.fps > 56) {
            if (stableHighFpsSinceRef.current === null) {
              stableHighFpsSinceRef.current = now;
            }
            const stableDuration = now - stableHighFpsSinceRef.current;
            const currentStage = degradationStageRef.current;
            if (stableDuration >= 10_000 && currentStage > 0) {
              const recoveredStage = (currentStage -
                1) as PerformanceDegradationStage;
              applyDegradationStage(recoveredStage);
              stableHighFpsSinceRef.current = now;
            }
          } else {
            stableHighFpsSinceRef.current = null;
          }
        }
      }
    },
    [
      applyDegradationStage,
      applyQualityLevel,
      manualQualityOverride,
      showPerformanceHUD,
    ],
  );

  const handleExportMetrics = useCallback(() => {
    const payload = performanceMonitor.exportMetrics();
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visual-shock-metrics-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [performanceMonitor]);

  if (shouldUseFallback) {
    return <WebGLFallback message={runtimeNotice ?? undefined} />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.22),transparent_46%),radial-gradient(circle_at_80%_12%,rgba(59,130,246,0.2),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.18),transparent_52%)]" />
      {PARALLAX_LAYER_CONFIG.map((layer, index) => (
        <div
          key={layer.key}
          ref={(node) => {
            parallaxLayerRefs.current[index] = node;
          }}
          className={layer.className}
          style={layer.style}
          aria-hidden="true"
        />
      ))}

      <div className="absolute inset-0 opacity-95">
        <HeroScene
          cameraMode={cameraMode}
          pointerRef={pointerRef}
          onFrameMetrics={handleFrameMetrics}
          shadowsEnabled={heroShadowsEnabled}
          onContextEvent={handleWebGLContextEvent}
        />
      </div>
      <FluidOverlay simulator={fluidSimulator} />
      <ParticleOverlay engine={particleEngine} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-slate-50/30" />

      {runtimeNotice ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 backdrop-blur-md">
          {runtimeNotice}
        </div>
      ) : null}

      {process.env.NODE_ENV !== "production" && shaderErrors.length > 0 ? (
        <div className="pointer-events-auto absolute bottom-4 left-4 z-20 max-w-xl rounded-xl border border-rose-300/70 bg-rose-50/95 p-3 text-xs text-rose-900 shadow-lg">
          <p className="mb-2 font-semibold">Shader 编译错误（开发模式）</p>
          <ul className="space-y-1">
            {shaderErrors.map((error, index) => (
              <li key={`${error}-${index}`} className="truncate">
                {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {audioAutoplayBlocked ? (
        <button
          type="button"
          className="pointer-events-auto absolute bottom-5 right-5 z-30 rounded-full border border-sky-300/80 bg-white/90 px-4 py-2 text-xs font-semibold text-sky-700 shadow-lg backdrop-blur transition hover:bg-white"
          onClick={() => {
            void audioManager.requestResumeFromUserGesture().then((ok) => {
              if (!ok) {
                setRuntimeNotice("浏览器阻止了自动播放，请再次点击启用音效。");
              } else {
                setRuntimeNotice("音频已启用。");
                setAudioAutoplayBlocked(false);
              }
            });
          }}
        >
          启用音效
        </button>
      ) : null}

      {degradationStage > 0 ? (
        <div className="pointer-events-none absolute right-5 top-5 z-20 rounded-full border border-amber-300/70 bg-amber-50/80 px-3 py-1 text-[11px] font-semibold text-amber-700 backdrop-blur">
          性能降级级别 {degradationStage}
        </div>
      ) : null}

      <PerformanceHUD
        visible={showPerformanceHUD}
        fps={metrics.fps}
        frameTime={metrics.frameTime}
        drawCalls={metrics.drawCalls}
        particleCount={visualShockStore.getState().particleCount}
        webglSupport={webglSupport}
        cameraMode={cameraMode}
        onExport={handleExportMetrics}
      />
    </div>
  );
}
