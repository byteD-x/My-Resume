"use client";

import { useEffect, useRef } from "react";
import type { FluidPoint } from "@/lib/visual-shock/types";
import type { FluidSimulatorSystem } from "@/lib/visual-shock/systems/FluidSimulator";

interface FluidOverlayProps {
  simulator: FluidSimulatorSystem;
}

function initializeCanvas(
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

function drawFluidPoint(
  ctx: CanvasRenderingContext2D,
  point: FluidPoint,
): void {
  const alpha = Math.max(0, Math.min(point.intensity * 0.4, 0.72));
  const gradient = ctx.createRadialGradient(
    point.x,
    point.y,
    0,
    point.x,
    point.y,
    point.radius,
  );
  gradient.addColorStop(
    0,
    `rgba(${Math.round(point.color.r * 255)}, ${Math.round(point.color.g * 255)}, ${Math.round(point.color.b * 255)}, ${alpha})`,
  );
  gradient.addColorStop(
    0.65,
    `rgba(${Math.round(point.color.r * 255)}, ${Math.round(point.color.g * 255)}, ${Math.round(point.color.b * 255)}, ${alpha * 0.28})`,
  );
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
  ctx.fill();
}

export function FluidOverlay({ simulator }: FluidOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let context = initializeCanvas(canvas);
    if (!context) return;

    let rafId = 0;

    const handleResize = () => {
      context = initializeCanvas(canvas);
    };

    const render = () => {
      if (!context) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      const points = simulator.getRenderPoints(140);
      for (let i = 0; i < points.length; i += 1) {
        drawFluidPoint(context, points[i]);
      }

      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, [simulator]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
