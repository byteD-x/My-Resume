import type { Transition } from "framer-motion";

type SurfaceKind = "drawer" | "panel" | "modal";

const EMPHASIZED_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

interface SurfaceMotionOptions {
  reduceMotion: boolean;
  desktop: boolean;
  kind: SurfaceKind;
}

export function getOverlayFadeTransition(
  reduceMotion: boolean,
): Transition {
  return reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.18, ease: EMPHASIZED_EASE };
}

export function getOverlaySurfaceTransition({
  reduceMotion,
  kind,
}: SurfaceMotionOptions): Transition {
  if (reduceMotion) {
    return { duration: 0.14, ease: EMPHASIZED_EASE };
  }

  if (kind === "modal") {
    return { duration: 0.24, ease: EMPHASIZED_EASE };
  }

  return { duration: 0.26, ease: EMPHASIZED_EASE };
}

export function getOverlaySurfaceInitial({
  reduceMotion,
  desktop,
  kind,
}: SurfaceMotionOptions) {
  if (reduceMotion) {
    return { opacity: 0 };
  }

  if (kind === "modal") {
    return desktop
      ? { opacity: 0, y: 20, scale: 0.985 }
      : { opacity: 0, y: 28, scale: 1 };
  }

  return desktop
    ? { opacity: 0.98, x: 28, y: 0, scale: 1 }
    : { opacity: 0.98, x: 0, y: 24, scale: 1 };
}

export function getOverlaySurfaceAnimate({
  reduceMotion,
}: SurfaceMotionOptions) {
  if (reduceMotion) {
    return { opacity: 1 };
  }

  return { opacity: 1, x: 0, y: 0, scale: 1 };
}

export function getOverlaySurfaceExit({
  reduceMotion,
  desktop,
  kind,
}: SurfaceMotionOptions) {
  if (reduceMotion) {
    return { opacity: 0 };
  }

  if (kind === "modal") {
    return desktop
      ? { opacity: 0, y: 12, scale: 0.992, transition: { ease: EXIT_EASE } }
      : { opacity: 0, y: 18, scale: 1, transition: { ease: EXIT_EASE } };
  }

  return desktop
    ? { opacity: 0.96, x: 18, y: 0, scale: 1, transition: { ease: EXIT_EASE } }
    : { opacity: 0.96, x: 0, y: 18, scale: 1, transition: { ease: EXIT_EASE } };
}
