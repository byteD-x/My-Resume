"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { clearScrollRestore, readScrollRestore } from "@/lib/scroll-restore";
import { useScrollPastThreshold } from "@/lib/scroll-observer";
import { scrollToSection } from "@/lib/section-scroll";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";

const EngineeringCommandCenter = dynamic(
  () => import("@/components/EngineeringCommandCenter"),
  {
    ssr: false,
    loading: () => null,
  },
);

const ScrollProgressBar = dynamic(
  () =>
    import("@/components/ScrollProgressBar").then((mod) => ({
      default: mod.ScrollProgressBar,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

const FloatingResumeButton = dynamic(
  () => import("@/components/FloatingResumeButton"),
  {
    ssr: false,
    loading: () => null,
  },
);

interface HomePageRuntimeProps {
  resumeOwnerName: string;
  resumeOwnerTitle: string;
}

export function HomePageRuntime({
  resumeOwnerName,
  resumeOwnerTitle,
}: HomePageRuntimeProps) {
  const isLowPerformanceMode = useLowPerformanceMode();
  const hasReachedEnhancementZone = useScrollPastThreshold(240);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

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
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(media.matches);
    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  const shouldRenderEnhancements = showCommandCenter;
  const shouldRenderSupplementalActions =
    hasReachedEnhancementZone && !isLowPerformanceMode;

  return (
    <>
      {shouldRenderEnhancements ? (
        <>
          {!isMobileViewport ? (
            <aside
              data-print="hide"
              className="pointer-events-none fixed right-4 top-1/2 z-40 w-[17rem] -translate-y-1/2 xl:right-6 xl:w-[17.5rem]"
              aria-label="快捷操作"
            >
              <div className="theme-floating-dock pointer-events-none rounded-[1.5rem] p-3.5">
                <div className="border-b border-[color:var(--border-muted)] pb-3">
                  <p className="theme-floating-label">快捷入口</p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-[color:var(--text-primary)]">
                    <Sparkles size={14} className="text-[color:var(--brand-gold)]" />
                    <span className="text-balance leading-5">工程证明入口</span>
                  </p>
                  <p className="theme-floating-meta mt-1 text-balance leading-5">
                    汇集指标、项目入口与常用操作。
                  </p>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <EngineeringCommandCenter className="w-full" />

                  <div className="border-t border-[color:var(--border-muted)] pt-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="theme-floating-label">辅助操作</p>
                      <span className="theme-floating-meta inline-flex items-center gap-1">
                        滚动
                        <ArrowUpRight size={12} />
                      </span>
                    </div>
                    {shouldRenderSupplementalActions ? (
                      <ScrollProgressBar variant="dock" />
                    ) : null}
                  </div>

                  <div className="border-t border-[color:var(--border-muted)] pt-3">
                    <p className="theme-floating-label mb-2">常用操作</p>
                    {shouldRenderSupplementalActions ? (
                      <FloatingResumeButton
                        resumeOwnerName={resumeOwnerName}
                        resumeOwnerTitle={resumeOwnerTitle}
                        desktopVariant="dock"
                        mobileVariant="hidden"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </aside>
          ) : (
            <div
              data-print="hide"
              className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))]"
            >
              <div className="theme-floating-dock pointer-events-none rounded-[1.15rem] p-2">
                <div className="flex flex-col gap-2">
                  <EngineeringCommandCenter compact className="w-full" />
                  {shouldRenderSupplementalActions ? (
                    <FloatingResumeButton
                      resumeOwnerName={resumeOwnerName}
                      resumeOwnerTitle={resumeOwnerTitle}
                      desktopVariant="hidden"
                      mobileVariant="inline"
                      mobileClassName="w-full"
                      mobileShowContactAction={false}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}
