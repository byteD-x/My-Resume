"use client";

import { useEffect, useRef } from "react";
import type { ParticleEngineSystem } from "@/lib/visual-shock/systems/ParticleEngine";

interface ParticleOverlayProps {
  engine: ParticleEngineSystem;
}

function setupCanvas(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(window.innerWidth, 1);
  const height = Math.max(window.innerHeight, 1);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  return context;
}

export function ParticleOverlay({ engine }: ParticleOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = setupCanvas(canvas);
    if (!ctx) return;

    let rafId = 0;

    const handleResize = () => {
      ctx = setupCanvas(canvas);
      engine.onEvent({
        type: "viewport-resize",
        source: "particle-overlay",
        timestamp: Date.now(),
        payload: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };

    const draw = () => {
      if (!ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const particles = engine.getActiveParticles(3500);
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        ctx.globalCompositeOperation =
          particle.blendMode === "additive" ? "lighter" : "source-over";
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, [engine]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
