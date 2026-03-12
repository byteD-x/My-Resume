"use client";

const DEFAULT_SECTION_GAP = 20;

export function getPreferredScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  return prefersReducedMotion || coarsePointer ? "auto" : "smooth";
}

export function getSectionScrollTarget(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;

  return (
    document.querySelector<HTMLElement>(`[data-scroll-target="${id}"]`) ??
    document.getElementById(id)
  );
}

function getNavbarHeight(): number {
  if (typeof document === "undefined") return 0;
  return document.querySelector<HTMLElement>("nav")?.getBoundingClientRect()
    .height ?? 0;
}

interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
  gap?: number;
}

export function scrollToSection(
  id: string,
  options?: ScrollToSectionOptions,
): boolean {
  if (typeof window === "undefined") return false;

  const target = getSectionScrollTarget(id);
  if (!target) return false;

  const top =
    window.scrollY +
    target.getBoundingClientRect().top -
    getNavbarHeight() -
    (options?.gap ?? DEFAULT_SECTION_GAP);

  window.scrollTo({
    top: Math.max(0, top),
    behavior: options?.behavior ?? getPreferredScrollBehavior(),
  });

  if (options?.updateHash !== false) {
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  return true;
}
