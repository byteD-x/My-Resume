"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ImmersiveBackdrop from "@/components/ImmersiveBackdrop";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import FloatingResumeButton from "@/components/FloatingResumeButton";
import { clearScrollRestore, readScrollRestore } from "@/lib/scroll-restore";
import { scrollToSection } from "@/lib/section-scroll";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";

const EngineeringCommandCenter = dynamic(
  () => import("@/components/EngineeringCommandCenter"),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HomePageRuntime() {
  const isLowPerformanceMode = useLowPerformanceMode();
  const [showCommandCenter, setShowCommandCenter] = useState(false);

  useEffect(() => {
    const state = readScrollRestore();
    if (!state || typeof window === "undefined") return;

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (state.path && state.path !== currentPath) return;

    const restoreScroll = () => {
      if (typeof state.y === "number" && Number.isFinite(state.y)) {
        window.scrollTo({ top: state.y, behavior: "auto" });
      } else if (state.section) {
        scrollToSection(state.section, { behavior: "auto", updateHash: false });
      }
      clearScrollRestore();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readScrollRestore()) return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(hash, { behavior: "auto", updateHash: false });
      });
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowCommandCenter(true);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);
  return (
    <>
      <ImmersiveBackdrop />
      {!isLowPerformanceMode && <ScrollProgressBar />}
      {showCommandCenter ? <EngineeringCommandCenter /> : null}
      <FloatingResumeButton />
    </>
  );
}
