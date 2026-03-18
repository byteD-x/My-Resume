"use client";

import React, { useCallback, useRef } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { ImpactItem, TimelineItem } from "@/types";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { evaluateVerificationConfidence } from "@/lib/verification";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";

interface MetricDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metric: ImpactItem | null;
  linkedExperience?: TimelineItem | null;
}

export default function MetricDrawer({
  isOpen,
  onClose,
  metric,
  linkedExperience,
}: MetricDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const drawerRef = useFocusTrap<HTMLDivElement>(isOpen, {
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
    lockBodyScroll: true,
  });

  const overlayTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

  const drawerTransition = shouldReduceMotion
    ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
    : ({ type: "spring", stiffness: 320, damping: 30, mass: 0.92 } as const);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const jumpToLinkedExperience = useCallback(() => {
    if (!linkedExperience) return;

    onClose();
    window.setTimeout(() => {
      const target =
        document.getElementById(`timeline-${linkedExperience.id}`) ??
        document.getElementById(linkedExperience.id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 220);
  }, [linkedExperience, onClose]);

  if (!metric) return null;

  const details = linkedExperience?.expandedDetails;
  const verificationAssessment = metric.verification
    ? evaluateVerificationConfidence(metric.verification)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.34)",
              backdropFilter: "blur(10px)",
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            className="theme-card fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[1.5rem] md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-lg md:max-h-none md:rounded-none md:rounded-l-[1.5rem]"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: 28, opacity: 0.94, scale: 0.985 }
            }
            animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: 20, opacity: 0.96, scale: 0.992 }
            }
            transition={drawerTransition}
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex justify-center pb-2 pt-3 md:hidden">
              <div
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: "var(--border-strong)" }}
              />
            </div>

            <div
              className="theme-panel sticky top-0 z-10 flex items-center justify-between border-b p-4 md:p-6"
              style={{ borderColor: "var(--border-default)" }}
            >
              <h2
                id="drawer-title"
                className="theme-title text-lg font-semibold md:text-xl"
              >
                {metric.title}
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="motion-chip rounded-lg p-2 transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="关闭"
              >
                <X size={20} className="motion-icon-float" />
              </button>
            </div>

            <div className="space-y-6 p-4 md:p-6">
              <div className="theme-card-muted rounded-[1.25rem] p-6 text-center">
                <div
                  className="mb-2 text-4xl font-bold md:text-5xl"
                  style={{ color: "var(--brand-gold)" }}
                >
                  {metric.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {metric.label}
                </div>
              </div>

              {metric.description && (
                <div>
                  <h3 className="theme-copy-subtle mb-2 text-sm font-semibold uppercase tracking-wide">
                    概述
                  </h3>
                  <div style={{ color: "var(--text-secondary)" }}>
                    <MarkdownRenderer inline>
                      {metric.description}
                    </MarkdownRenderer>
                  </div>
                </div>
              )}

              {metric.details && (
                <div>
                  <h3 className="theme-copy-subtle mb-2 text-sm font-semibold uppercase tracking-wide">
                    方法拆解
                  </h3>
                  <div style={{ color: "var(--text-secondary)" }}>
                    <MarkdownRenderer tone="muted">
                      {metric.details}
                    </MarkdownRenderer>
                  </div>
                </div>
              )}

              {metric.verification && (
                <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/10">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                    证据口径
                  </h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    {metric.verification.sourceLabel}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                    置信度：{verificationAssessment?.confidenceText} ·
                    验证时间：{metric.verification.verifiedAt}
                  </p>
                  {verificationAssessment &&
                    verificationAssessment.basis.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          判定依据
                        </p>
                        <ul className="mt-1 space-y-1 text-xs text-emerald-800/90 dark:text-emerald-200/90">
                          {verificationAssessment.basis.map(
                            (basisItem, index) => (
                              <li
                                key={`${basisItem}-${index}`}
                                className="flex items-start gap-1.5"
                              >
                                <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-emerald-600/90 dark:bg-emerald-300/90" />
                                <span>{basisItem}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  {verificationAssessment && (
                    <p className="mt-2 text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-200/90">
                      <span className="font-semibold">判定原因：</span>
                      {verificationAssessment.reason}
                    </p>
                  )}
                  {metric.verification.sourceUrl && (
                    <a
                      href={metric.verification.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                      查看来源
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}

              {details && (
                <>
                  {details.background && (
                    <div>
                      <h3 className="theme-copy-subtle mb-2 text-sm font-semibold uppercase tracking-wide">
                        背景
                      </h3>
                      <div style={{ color: "var(--text-secondary)" }}>
                        <MarkdownRenderer tone="muted">
                          {details.background}
                        </MarkdownRenderer>
                      </div>
                    </div>
                  )}

                  {details.solution && (
                    <div>
                      <h3 className="theme-copy-subtle mb-2 text-sm font-semibold uppercase tracking-wide">
                        我的行动
                      </h3>
                      <MarkdownRenderer>{details.solution}</MarkdownRenderer>
                    </div>
                  )}

                  {details.result && (
                    <div>
                      <h3 className="theme-copy-subtle mb-2 text-sm font-semibold uppercase tracking-wide">
                        成果
                      </h3>
                      <MarkdownRenderer tone="default">
                        {details.result}
                      </MarkdownRenderer>
                    </div>
                  )}

                  {details.techStack && details.techStack.length > 0 && (
                    <div>
                      <h3 className="theme-copy-subtle mb-3 text-sm font-semibold uppercase tracking-wide">
                        技术要点
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.techStack.map((tech, i) => (
                          <span key={i} className="theme-chip px-2.5 py-1 text-xs font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.links && details.links.length > 0 && (
                    <div>
                      <h3 className="theme-copy-subtle mb-3 text-sm font-semibold uppercase tracking-wide">
                        查看证据
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {details.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                          >
                            {link.label}
                            <ExternalLink size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {linkedExperience && (
                <div
                  className="border-t pt-4"
                  style={{ borderColor: "var(--border-default)" }}
                >
                  <div className="theme-copy-subtle mb-1 text-xs uppercase tracking-wide">
                    来源
                  </div>
                  <div className="theme-title font-medium">
                    {linkedExperience.company}
                  </div>
                  <div className="theme-copy text-sm">
                    {linkedExperience.role} · {linkedExperience.year}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3"
                    onClick={jumpToLinkedExperience}
                  >
                    定位到对应经历
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
