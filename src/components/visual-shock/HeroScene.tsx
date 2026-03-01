"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import type { CameraMode } from "@/lib/visual-shock/systems/WebGLRenderer";

const ENABLE_REMOTE_HDR = process.env.NEXT_PUBLIC_ENABLE_REMOTE_HDR === "true";

interface FrameMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
}

interface HeroSceneProps {
  cameraMode: CameraMode;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  onFrameMetrics: (metrics: FrameMetrics) => void;
  shadowsEnabled?: boolean;
  onContextEvent?: (
    event: "context-lost" | "context-restored" | "context-restore-failed",
  ) => void;
}

function WebGLContextGuard({
  onContextEvent,
}: {
  onContextEvent?: HeroSceneProps["onContextEvent"];
}) {
  const { gl } = useThree();

  useEffect(() => {
    if (!onContextEvent) return;
    const canvas = gl.domElement;
    let restored = true;
    let failTimer = 0;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      restored = false;
      onContextEvent("context-lost");
      if (failTimer) {
        window.clearTimeout(failTimer);
      }
      failTimer = window.setTimeout(() => {
        if (!restored) {
          onContextEvent("context-restore-failed");
        }
      }, 2400);
    };

    const handleContextRestored = () => {
      restored = true;
      if (failTimer) {
        window.clearTimeout(failTimer);
        failTimer = 0;
      }
      onContextEvent("context-restored");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, {
      passive: false,
    });
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      if (failTimer) {
        window.clearTimeout(failTimer);
      }
    };
  }, [gl, onContextEvent]);

  return null;
}

function SceneObjects({
  pointerRef,
  onFrameMetrics,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  onFrameMetrics: HeroSceneProps["onFrameMetrics"];
}) {
  const clusterRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const cameraTarget = useMemo(() => new THREE.Vector3(0, 0, 8), []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const entranceProgress = Math.min(1, elapsed / 2.4);
    const easedProgress = 1 - Math.pow(1 - entranceProgress, 3);

    if (clusterRef.current) {
      clusterRef.current.scale.setScalar(0.45 + easedProgress * 0.55);
      clusterRef.current.position.y = (1 - easedProgress) * 1.2;
      clusterRef.current.rotation.y += delta * 0.12;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.x += delta * 0.25;
      sphereRef.current.rotation.y += delta * 0.42;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.2;
      torusRef.current.rotation.y -= delta * 0.35;
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x -= delta * 0.18;
      cubeRef.current.rotation.z += delta * 0.22;
    }

    const targetX = pointerRef.current.x * 0.8;
    const targetY = pointerRef.current.y * 0.55;
    cameraTarget.set(targetX, -targetY, 8);
    state.camera.position.lerp(cameraTarget, 0.08);
    state.camera.lookAt(0, 0, 0);

    onFrameMetrics({
      fps: delta > 0 ? Math.min(240, 1 / delta) : 60,
      frameTime: delta * 1000,
      drawCalls: state.gl.info.render.calls,
    });
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        color="#38bdf8"
        intensity={80}
        angle={0.45}
        penumbra={0.8}
        position={[6, 5, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        color="#22d3ee"
        intensity={55}
        angle={0.5}
        penumbra={0.8}
        position={[-5, 4, 6]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        color="#60a5fa"
        intensity={65}
        angle={0.42}
        penumbra={0.7}
        position={[1, -3, 7]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <group ref={clusterRef}>
        <mesh ref={sphereRef} position={[-2.2, 0.4, -0.8]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            color="#c1e6ff"
            metalness={0.84}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>

        <mesh ref={torusRef} position={[2.2, -0.1, 0.2]} castShadow>
          <torusKnotGeometry args={[0.72, 0.2, 220, 32]} />
          <meshPhysicalMaterial
            color="#a5f3fc"
            metalness={0.28}
            roughness={0.04}
            transmission={0.95}
            thickness={0.7}
            ior={1.22}
          />
        </mesh>

        <mesh ref={cubeRef} position={[0, 1.35, -1.35]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#93c5fd"
            metalness={0.62}
            roughness={0.12}
            clearcoat={0.8}
            clearcoatRoughness={0.09}
          />
        </mesh>
      </group>

      <mesh
        position={[0, -2.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[26, 26]} />
        <shadowMaterial opacity={0.28} />
      </mesh>

      {ENABLE_REMOTE_HDR ? <Environment preset="city" /> : null}
    </>
  );
}

function SceneCanvas({
  cameraMode,
  pointerRef,
  onFrameMetrics,
  shadowsEnabled = true,
  onContextEvent,
  isInView,
}: HeroSceneProps & { isInView: boolean }) {
  if (cameraMode === "orthographic") {
    return (
      <Canvas
        frameloop={isInView ? "always" : "demand"}
        orthographic
        camera={{ position: [0, 0, 8], zoom: 95, near: 0.1, far: 120 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        shadows={shadowsEnabled}
      >
        <Suspense fallback={null}>
          <WebGLContextGuard onContextEvent={onContextEvent} />
          {isInView && (
            <SceneObjects
              pointerRef={pointerRef}
              onFrameMetrics={onFrameMetrics}
            />
          )}
        </Suspense>
      </Canvas>
    );
  }

  return (
    <Canvas
      frameloop={isInView ? "always" : "demand"}
      camera={{ position: [0, 0, 8], fov: 48, near: 0.1, far: 120 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      shadows={shadowsEnabled}
    >
      <Suspense fallback={null}>
        <WebGLContextGuard onContextEvent={onContextEvent} />
        {isInView && (
          <SceneObjects
            pointerRef={pointerRef}
            onFrameMetrics={onFrameMetrics}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export default function HeroScene({
  cameraMode,
  pointerRef,
  onFrameMetrics,
  shadowsEnabled = true,
  onContextEvent,
}: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <SceneCanvas
        cameraMode={cameraMode}
        pointerRef={pointerRef}
        onFrameMetrics={onFrameMetrics}
        shadowsEnabled={shadowsEnabled}
        onContextEvent={onContextEvent}
        isInView={isInView}
      />
    </div>
  );
}
