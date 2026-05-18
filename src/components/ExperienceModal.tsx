"use client";

import { useMemo, useRef } from "react";
import { m as motion } from "framer-motion";
import { Calendar, MapPin, Building, Globe, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { TimelineItem, ProjectItem } from "../types";
import { isProjectLikeTimelineSubtitle } from "@/lib/experience-presentation";
import { getExperienceGroupChildren } from "@/lib/experiences";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  clearScrollRestore,
  readScrollRestore,
  saveScrollRestore,
} from "@/lib/scroll-restore";
import { evaluateVerificationConfidence } from "@/lib/verification";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";
import { DialogCloseButton } from "./ui/DialogCloseButton";
import { cn } from "@/lib/utils";
import { OverlayPortal } from "./ui/OverlayPortal";
import { IntentLink } from "./ui/IntentLink";
import {
  getOverlayFadeTransition,
  getOverlaySurfaceAnimate,
  getOverlaySurfaceExit,
  getOverlaySurfaceInitial,
  getOverlaySurfaceTransition,
} from "@/lib/overlay-motion";
import { useLocale, useUiCopy } from "@/lib/LocaleProvider";

type ExperienceModalVariant = "overlay" | "page";

interface ExperienceModalProps {
  item: TimelineItem | ProjectItem;
  variant?: ExperienceModalVariant;
}

export function ExperienceModal({
  item,
  variant = "overlay",
}: ExperienceModalProps) {
  const { locale } = useLocale();
  const copy = useUiCopy();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const isOverlay = variant === "overlay";
  const isDesktopViewport = useMediaQuery("(min-width: 640px)");
  const useSharedLayout = isOverlay && !shouldReduceMotion;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const motionOptions = {
    reduceMotion: shouldReduceMotion,
    desktop: isDesktopViewport,
    kind: "modal" as const,
  };

  const closeModal = () => {
    if (
      isOverlay &&
      typeof window !== "undefined" &&
      window.history.length > 1
    ) {
      clearScrollRestore();
      router.back();
      return;
    }

    const saved = readScrollRestore();
    if (!saved) {
      const section = "role" in item ? "experience" : "projects";
      saveScrollRestore({
        path: "/",
        section,
        ts: Date.now(),
      });
      router.push("/");
      return;
    }

    router.push(saved.path || "/");
  };

  const containerRef = useFocusTrap<HTMLDivElement>(true, {
    onEscape: closeModal,
    initialFocusRef: closeButtonRef,
    lockBodyScroll: isOverlay,
  });

  const title = "role" in item ? item.role : item.name;
  const subtitle = "company" in item ? item.company : "";
  const isProjectLikeSubtitle =
    "role" in item && isProjectLikeTimelineSubtitle(item);
  const groupedChildren = useMemo(
    () => getExperienceGroupChildren(item, locale),
    [item, locale],
  );

  const content = (
    <div
      className={cn(
        isOverlay ? "fixed inset-0 z-50" : "relative z-10",
        "flex justify-center p-3 sm:p-6",
        isOverlay ? "items-end sm:items-center" : "items-center",
      )}
      role="dialog"
      aria-modal={isOverlay ? "true" : undefined}
      aria-labelledby={`modal-title-${item.id}`}
    >
      {isOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={getOverlayFadeTransition(shouldReduceMotion)}
          onClick={closeModal}
          className="theme-dialog-overlay absolute inset-0"
          aria-hidden="true"
        />
      )}

      <motion.div
        ref={containerRef}
        layoutId={useSharedLayout ? `card-${item.id}` : undefined}
        initial={
          useSharedLayout
            ? undefined
            : getOverlaySurfaceInitial(motionOptions)
        }
        animate={useSharedLayout ? undefined : getOverlaySurfaceAnimate(motionOptions)}
        exit={
          useSharedLayout
            ? { opacity: 0, scale: 0.99, y: 14 }
            : getOverlaySurfaceExit(motionOptions)
        }
        transition={getOverlaySurfaceTransition(motionOptions)}
        className={cn(
          "theme-dialog-shell relative flex w-full max-w-2xl flex-col overflow-hidden",
          isOverlay
            ? "max-h-[calc(100dvh-0.75rem)] rounded-[1.4rem] sm:max-h-[90vh] sm:rounded-[1.75rem]"
            : "max-h-[90vh] rounded-[1.75rem]",
        )}
      >
        {isOverlay ? (
          <div className="flex justify-center pb-2 pt-3 sm:hidden">
            <div
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: "var(--border-strong)" }}
            />
          </div>
        ) : null}

        <div className="theme-panel theme-dialog-header px-4 py-4 sm:px-6 sm:py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <motion.h2
                layoutId={useSharedLayout ? `title-${item.id}` : undefined}
                id={`modal-title-${item.id}`}
                className="theme-title mb-2 break-words text-[1.4rem] font-bold leading-tight [overflow-wrap:anywhere] sm:text-[1.7rem]"
              >
                {title}
              </motion.h2>

              {subtitle && (
                <motion.div
                  layoutId={useSharedLayout ? `subtitle-${item.id}` : undefined}
                  className={cn(
                    "mb-4 flex min-w-0 flex-wrap items-center gap-2 break-words [overflow-wrap:anywhere]",
                    isProjectLikeSubtitle
                      ? "text-[1rem] font-semibold text-[color:var(--text-primary)] sm:text-[1.08rem]"
                      : "text-[15px] font-medium text-[color:var(--brand-gold)] sm:text-base",
                  )}
                >
                  <Building
                    className={cn(
                      "h-4 w-4",
                      isProjectLikeSubtitle
                        ? "text-[color:var(--brand-gold)]"
                        : undefined,
                    )}
                  />
                  {subtitle}
                </motion.div>
              )}

              <div className="theme-copy flex flex-wrap gap-3 text-[0.92rem] leading-7">
                <motion.div
                  layoutId={useSharedLayout ? `date-${item.id}` : undefined}
                  className="theme-chip flex max-w-full items-center gap-1.5 break-words px-3 py-1 font-mono whitespace-normal [overflow-wrap:anywhere]"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {item.year}
                </motion.div>

                {"location" in item && item.location && (
                  <div className="flex min-w-0 items-center gap-1.5 break-words [overflow-wrap:anywhere]">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </div>
                )}
              </div>
            </div>

            <DialogCloseButton
              ref={closeButtonRef}
              onClick={closeModal}
              ariaLabel={copy.experience.close}
              className="shrink-0"
              iconSize={20}
            />
          </div>
        </div>

        <div className="theme-dialog-body flex-1 space-y-6 overflow-y-auto p-4 sm:space-y-7 sm:p-6 md:p-7">
          <section>
            <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
              {copy.experience.summary}
            </h4>
            <div className="theme-dialog-prose min-w-0 break-words text-[15px] [overflow-wrap:anywhere] sm:text-base md:text-[1.03rem]">
              <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
            </div>
          </section>

          {groupedChildren.length > 0 && (
            <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
                {locale === "en" ? "Grouped projects" : "分组子项目"}
              </h4>
              <div className="space-y-3">
                {groupedChildren.map((child) => {
                  const childTitle = "company" in child ? child.company : child.name;
                  const childLinks = child.expandedDetails?.links ?? [];

                  return (
                    <div
                      key={child.id}
                      className="theme-card-muted rounded-[1rem] p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start gap-2">
                            <h5 className="theme-title min-w-0 flex-1 break-words text-[1rem] font-semibold leading-7">
                              {childTitle}
                            </h5>
                            <span className="theme-chip px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                              {child.year}
                            </span>
                          </div>
                          <p className="theme-copy mt-2 break-words text-sm leading-7 [overflow-wrap:anywhere]">
                            {child.summary}
                          </p>
                        </div>
                      </div>

                      {child.keyOutcomes && child.keyOutcomes.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {child.keyOutcomes.slice(0, 3).map((outcome, index) => (
                            <li
                              key={`${child.id}-outcome-${index}`}
                              className="flex items-start gap-2"
                            >
                              <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              <span className="theme-copy break-words text-sm leading-7 [overflow-wrap:anywhere]">
                                {outcome}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {child.techTags.map((tech) => (
                          <span
                            key={`${child.id}-${tech}`}
                            className="theme-chip max-w-full px-2.5 py-1 text-[11px] font-medium [overflow-wrap:anywhere]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <IntentLink
                          href={`/experiences/${child.id}`}
                          className="theme-link min-w-0 break-words text-sm font-semibold hover:underline [overflow-wrap:anywhere]"
                        >
                          {locale === "en" ? "View child detail" : "查看子项目详情"}
                        </IntentLink>

                        {childLinks.map((link) => (
                          <a
                            key={`${child.id}-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-link inline-flex min-w-0 items-center gap-2 break-words text-sm font-medium hover:underline [overflow-wrap:anywhere]"
                          >
                            {link.label.toLowerCase().includes("github") ? (
                              <Github className="h-4 w-4" />
                            ) : (
                              <Globe className="h-4 w-4" />
                            )}
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {item.businessValue && (
            <section className="rounded-[1.15rem] border border-emerald-200/70 bg-emerald-50/72 p-4 sm:p-5 dark:border-emerald-900/40 dark:bg-emerald-900/10">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {copy.experience.businessValue}
              </h4>
              <p className="theme-readable-block break-words text-sm text-emerald-900 [overflow-wrap:anywhere] dark:text-emerald-100">
                {item.businessValue[locale] ?? item.businessValue.zh}
              </p>
            </section>
          )}

          {item.engineeringDepth && (
            <section className="rounded-[1.15rem] border border-blue-200/70 bg-blue-50/80 p-4 sm:p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
                {copy.experience.engineeringDepth}
              </h4>
              <p className="theme-readable-block break-words text-sm text-slate-900 [overflow-wrap:anywhere]">
                {item.engineeringDepth[locale] ?? item.engineeringDepth.zh}
              </p>
            </section>
          )}

          {item.verification && item.verification.length > 0 && (
            <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
                {copy.experience.evidence}
              </h4>
              <div className="space-y-2.5">
                {item.verification.map((entry, idx) => {
                  const assessment = evaluateVerificationConfidence(
                    entry,
                    new Date(),
                    locale,
                  );

                  return (
                    <div
                      key={`${entry.sourceLabel ?? entry.verifiedAt}-${idx}`}
                      className="theme-card-muted rounded-[1rem] p-3 sm:p-4"
                    >
                      {entry.sourceLabel && (
                        <div className="theme-title text-sm font-medium">
                          {entry.sourceLabel}
                        </div>
                      )}
                      <div className="theme-copy mt-1 text-xs leading-6">
                        {copy.experience.sourceLabels[entry.sourceType]} · {copy.experience.confidence} {assessment.confidenceText} · {copy.experience.verifiedAt} {entry.verifiedAt}
                      </div>

                      {assessment.basis.length > 0 && (
                        <ul className="theme-copy mt-2 space-y-1 text-xs leading-6">
                          {assessment.basis.map((basisItem, basisIdx) => (
                            <li
                              key={`${basisItem}-${basisIdx}`}
                              className="flex items-start gap-1.5"
                            >
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[rgba(37,99,235,0.55)]" />
                              <span>{basisItem}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <p className="theme-copy mt-2 text-xs leading-6">
                        <span className="font-semibold">{copy.experience.reason}</span>
                        {assessment.reason}
                      </p>

                      {entry.sourceUrl && (
                        <a
                          href={entry.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-link mt-2 inline-flex text-xs font-semibold hover:underline"
                        >
                          {copy.experience.viewEvidence}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {item.expandedDetails && (
            <>
              {(item.expandedDetails.background ||
                item.expandedDetails.problem) && (
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                  {item.expandedDetails.background && (
                    <section>
                      <h4 className="theme-copy-subtle mb-2 text-xs font-semibold uppercase tracking-wider">
                        {copy.experience.background}
                      </h4>
                      <MarkdownRenderer tone="muted">
                        {item.expandedDetails.background}
                      </MarkdownRenderer>
                    </section>
                  )}
                  {item.expandedDetails.problem && (
                    <section>
                      <h4 className="theme-copy-subtle mb-2 text-xs font-semibold uppercase tracking-wider">
                        {copy.experience.challenge}
                      </h4>
                      <MarkdownRenderer tone="muted">
                        {item.expandedDetails.problem}
                      </MarkdownRenderer>
                    </section>
                  )}
                </div>
              )}

              <section className="rounded-[1.15rem] border border-blue-200/70 bg-blue-50/72 p-4 sm:p-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  {copy.experience.actionResult}
                </h4>
                <div className="space-y-4">
                  {item.expandedDetails.solution && (
                    <div>
                      <div className="theme-title mb-2 font-semibold">
                        {copy.experience.solution}
                      </div>
                      <MarkdownRenderer>
                        {item.expandedDetails.solution}
                      </MarkdownRenderer>
                    </div>
                  )}
                  {item.expandedDetails.result && (
                    <div>
                      <div className="theme-title mb-2 font-semibold">
                        {copy.experience.result}
                      </div>
                      <MarkdownRenderer>
                        {item.expandedDetails.result}
                      </MarkdownRenderer>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {item.keyOutcomes && item.keyOutcomes.length > 0 && (
            <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
                {copy.experience.keyMetrics}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {item.keyOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="theme-card-muted flex items-center gap-2 rounded-[1rem] p-3"
                  >
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="theme-title text-sm font-medium">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
              {copy.experience.techStack}
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.techTags?.map((tech, idx) => (
                <span
                  key={idx}
                  className="theme-chip px-2.5 py-1 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {item.expandedDetails?.links &&
            item.expandedDetails.links.length > 0 && (
              <section
                className="border-t pt-4"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="flex flex-wrap gap-4">
                  {item.expandedDetails.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="theme-link inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      {link.label.toLowerCase().includes("github") ? (
                        <Github className="h-4 w-4" />
                      ) : (
                        <Globe className="h-4 w-4" />
                      )}
                      {link.label}
                    </a>
                  ))}
                </div>
              </section>
            )}
        </div>
      </motion.div>
    </div>
  );

  if (!isOverlay) {
    return content;
  }

  return <OverlayPortal>{content}</OverlayPortal>;
}
