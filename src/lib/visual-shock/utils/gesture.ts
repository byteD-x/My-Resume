import type { SwipeDirection } from "@/lib/visual-shock/types";

function normalizeAngle(angle: number): number {
  const fullTurn = 360;
  const normalized = ((angle % fullTurn) + fullTurn) % fullTurn;
  return normalized;
}

export function angleToEightDirection(angle: number): SwipeDirection {
  const normalized = normalizeAngle(angle);

  if (normalized >= 337.5 || normalized < 22.5) return "right";
  if (normalized >= 22.5 && normalized < 67.5) return "down-right";
  if (normalized >= 67.5 && normalized < 112.5) return "down";
  if (normalized >= 112.5 && normalized < 157.5) return "down-left";
  if (normalized >= 157.5 && normalized < 202.5) return "left";
  if (normalized >= 202.5 && normalized < 247.5) return "up-left";
  if (normalized >= 247.5 && normalized < 292.5) return "up";
  return "up-right";
}

export function isIntentionalSwipe(
  distance: number,
  velocity: number,
  threshold: number,
): boolean {
  if (!Number.isFinite(distance) || !Number.isFinite(velocity)) return false;
  return (
    Math.abs(distance) >= Math.max(10, threshold) && Math.abs(velocity) >= 0.1
  );
}
