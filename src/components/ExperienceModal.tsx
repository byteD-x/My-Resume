"use client";

import { m as motion } from "framer-motion";
import { X, Calendar, MapPin, Building, Globe, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { TimelineItem, ProjectItem } from "../types";
import { useScrollLock } from "../hooks/useScrollLock";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  clearScrollRestore,
  readScrollRestore,
  saveScrollRestore,
} from "@/lib/scroll-restore";
import { evaluateVerificationConfidence } from "@/lib/verification";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";

type ExperienceModalVariant = "overlay" | "page";

interface ExperienceModalProps {
  item: TimelineItem | ProjectItem;
  variant?: ExperienceModalVariant;
}

export function ExperienceModal({
  item,
  variant = "overlay",
}: ExperienceModalProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const isOverlay = variant === "overlay";
  const useSharedLayout = isOverlay && !shouldReduceMotion;
  const overlayTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
  const contentTransition = shouldReduceMotion
    ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
    : ({ type: "spring", stiffness: 300, damping: 30, mass: 0.92 } as const);

  // Hooks for a11y & ux
  useScrollLock(isOverlay);
  const containerRef = useFocusTrap<HTMLDivElement>(true);

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

  const title = "role" in item ? item.role : item.name;
  const subtitle = "company" in item ? item.company : "";

  return (
    <div
      className={`${isOverlay ? "fixed inset-0 z-50" : "relative z-10"} flex items-center justify-center p-4 sm:p-6`}
      role="dialog"
      aria-modal={isOverlay ? "true" : undefined}
      aria-labelledby={`modal-title-${item.id}`}
    >
      {/* Backdrop */}
      {isOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          onClick={closeModal}
          className="absolute inset-0 bg-[rgba(15,23,42,0.34)] backdrop-blur-[10px]"
          aria-hidden="true"
        />
      )}

      {/* Modal Content */}
      <motion.div
        ref={containerRef}
        layoutId={useSharedLayout ? `card-${item.id}` : undefined}
        className="theme-card relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] shadow-2xl"
        initial={
          useSharedLayout
            ? undefined
            : shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.972, y: 24 }
        }
        animate={
          useSharedLayout ? undefined : { opacity: 1, scale: 1, y: 0 }
        }
        exit={
          useSharedLayout
            ? { opacity: 0, scale: 0.99, y: 14 }
            : shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.985, y: 18 }
        }
        transition={contentTransition}
      >
        {/* Header */}
        <div className="relative border-b border-[color:var(--border-default)] bg-[rgba(248,250,252,0.94)] p-6 sm:p-8">
          <button
            onClick={closeModal}
            aria-label="关闭弹窗"
            className="group motion-chip absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-[rgba(239,246,255,0.92)]"
          >
            <X className="motion-icon-float h-5 w-5 text-[color:var(--text-tertiary)] group-hover:text-[color:var(--brand-gold)]" />
          </button>

          <div className="pr-8">
            <motion.h2
              layoutId={useSharedLayout ? `title-${item.id}` : undefined}
              id={`modal-title-${item.id}`}
              className="theme-title mb-2 text-2xl font-bold"
            >
              {title}
            </motion.h2>

            {subtitle && (
              <motion.div
                layoutId={useSharedLayout ? `subtitle-${item.id}` : undefined}
                className="mb-4 flex items-center gap-2 text-lg font-medium text-[color:var(--brand-gold)]"
              >
                <Building className="w-4 h-4" />
                {subtitle}
              </motion.div>
            )}

            <div className="theme-copy flex flex-wrap gap-4 text-sm">
              <motion.div
                layoutId={useSharedLayout ? `date-${item.id}` : undefined}
                className="theme-chip flex items-center gap-1.5 px-3 py-1 font-mono"
              >
                <Calendar className="w-3.5 h-3.5" />
                {item.year}
              </motion.div>

              {"location" in item && item.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 overscroll-contain">
          {/* TL;DR Summary */}
          <section>
            <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
              概要
            </h4>
            <div className="theme-copy text-base leading-relaxed sm:text-lg">
              <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
            </div>
          </section>

          {item.businessValue && (
            <section className="rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
              <h4 className="mb-2 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                业务价值
              </h4>
              <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
                {item.businessValue.zh}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-emerald-800/90 italic dark:text-emerald-200/90">
                {item.businessValue.en}
              </p>
            </section>
          )}

          {item.engineeringDepth && (
            <section className="rounded-xl border border-blue-200/70 bg-blue-50/80 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
                工程深度
              </h4>
              <p className="text-sm leading-relaxed text-slate-900">
                {item.engineeringDepth.zh}
              </p>
              <p className="mt-2 text-xs italic leading-relaxed text-blue-800/90">
                {item.engineeringDepth.en}
              </p>
            </section>
          )}

          {item.verification && item.verification.length > 0 && (
            <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
                证据来源
              </h4>
              <div className="space-y-2">
                {item.verification.map((entry, idx) => {
                  const assessment = evaluateVerificationConfidence(entry);

                  return (
                    <div
                      key={`${entry.sourceLabel}-${idx}`}
                      className="theme-card-muted rounded-[1rem] p-3"
                    >
                      <div className="theme-title text-sm font-medium">
                        {entry.sourceLabel}
                      </div>
                      <div className="theme-copy mt-1 text-xs">
                        {entry.sourceType} · 置信度 {assessment.confidenceText}{" "}
                        · 验证时间 {entry.verifiedAt}
                      </div>

                      {assessment.basis.length > 0 && (
                        <ul className="theme-copy mt-2 space-y-1 text-xs">
                          {assessment.basis.map((basisItem, basisIdx) => (
                            <li
                              key={`${basisItem}-${basisIdx}`}
                              className="flex items-start gap-1.5"
                            >
                              <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-[rgba(37,99,235,0.55)]" />
                              <span>{basisItem}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <p className="theme-copy mt-2 text-xs leading-relaxed">
                        <span className="font-semibold">判定原因：</span>
                        {assessment.reason}
                      </p>

                      {entry.sourceUrl && (
                        <a
                          href={entry.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-link mt-2 inline-flex text-xs font-semibold hover:underline"
                        >
                          打开证据链接
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Extended Details */}
          {item.expandedDetails && (
            <>
              {/* Background & Problem */}
              {(item.expandedDetails.background ||
                item.expandedDetails.problem) && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {item.expandedDetails.background && (
                    <section>
                      <h4 className="theme-copy-subtle mb-2 text-xs font-semibold uppercase tracking-wider">
                        背景
                      </h4>
                      <MarkdownRenderer tone="muted">
                        {item.expandedDetails.background}
                      </MarkdownRenderer>
                    </section>
                  )}
                  {item.expandedDetails.problem && (
                    <section>
                      <h4 className="theme-copy-subtle mb-2 text-xs font-semibold uppercase tracking-wider">
                        挑战
                      </h4>
                      <MarkdownRenderer tone="muted">
                        {item.expandedDetails.problem}
                      </MarkdownRenderer>
                    </section>
                  )}
                </div>
              )}

              {/* Solution & Result */}
              <section className="-mx-4 rounded-xl border border-blue-200/70 bg-blue-50/70 p-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  行动与成果
                </h4>
                <div className="space-y-4">
                  {item.expandedDetails.solution && (
                    <div>
                      <div className="theme-title mb-2 font-semibold">
                        解决方案
                      </div>
                      <MarkdownRenderer>
                        {item.expandedDetails.solution}
                      </MarkdownRenderer>
                    </div>
                  )}
                  {item.expandedDetails.result && (
                    <div>
                      <div className="theme-title mb-2 font-semibold">
                        成果
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

          {/* Key Outcomes / Metrics */}
          {item.keyOutcomes && item.keyOutcomes.length > 0 && (
            <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
                关键指标
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.keyOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="theme-card-muted flex items-center gap-2 rounded-[1rem] p-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="theme-title text-sm font-medium">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack */}
          <section>
              <h4 className="theme-copy-subtle mb-3 text-xs font-semibold uppercase tracking-wider">
              技术栈
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

          {/* Links */}
          {item.expandedDetails?.links &&
            item.expandedDetails.links.length > 0 && (
              <section className="border-t border-[color:var(--border-default)] pt-4">
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
                        <Github className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
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
}
