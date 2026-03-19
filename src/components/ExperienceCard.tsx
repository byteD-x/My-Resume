"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { TimelineItem, ProjectItem } from "../types";
import { saveScrollRestore, ScrollRestoreSection } from "@/lib/scroll-restore";
import { MarkdownRenderer } from "./ui/MarkdownRenderer";

interface ExperienceCardProps {
  item: TimelineItem | ProjectItem;
  type?: "timeline" | "project";
  hideDate?: boolean;
}

export const ExperienceCard = memo(function ExperienceCard({
  item,
  type,
  hideDate = false,
}: ExperienceCardProps) {
  const title = "role" in item ? item.role : item.name;
  const subtitle = "company" in item ? item.company : "";
  const date = item.year;
  const isProjectCard =
    type === "project" || (type !== "timeline" && !("role" in item));

  const githubLink =
    item.link ||
    item.expandedDetails?.links?.find((l) =>
      l.label.toLowerCase().includes("github"),
    )?.url;
  const demoLink =
    "demoLink" in item && item.demoLink
      ? item.demoLink
      : item.expandedDetails?.links?.find(
          (l) => !l.label.toLowerCase().includes("github"),
        )?.url;
  const section: ScrollRestoreSection =
    type === "project"
      ? "projects"
      : type === "timeline"
        ? "experience"
        : "role" in item
          ? "experience"
          : "projects";

  const handleOpen = () => {
    if (typeof window === "undefined") return;
    const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    saveScrollRestore({
      path,
      y: window.scrollY,
      section,
      ts: Date.now(),
    });
  };

  return (
    <Link
      href={`/experiences/${item.id}`}
      scroll={false}
      className="group block h-full"
      onClick={handleOpen}
    >
      <div className="theme-card theme-card-interactive relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border-[rgba(148,163,184,0.16)] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:rounded-[1.55rem] sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(219,234,254,0.42),transparent)] opacity-90" />

        <div className="relative z-10 mb-5 flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] pb-4 sm:mb-6 sm:pb-5">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="theme-card-title text-[1.08rem] transition-colors group-hover:text-[color:var(--brand-gold)]">
              {title}
            </h3>
            {subtitle ? (
              <p className="theme-card-kicker mt-2.5">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {!hideDate ? (
              <div className="theme-chip px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                {date}
              </div>
            ) : null}
            <div className="motion-chip flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(37,99,235,0.14)] bg-white/88 text-[color:var(--text-tertiary)] transition-colors duration-200 group-hover:border-[rgba(37,99,235,0.26)] group-hover:text-[color:var(--brand-gold)]">
              <ArrowUpRight className="motion-arrow-shift h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div
          className={`theme-card-body relative z-10 mb-6 flex-grow text-[13px] leading-[1.92] sm:mb-7 sm:text-[14px] sm:leading-7 ${
            isProjectCard
              ? "min-h-[8.5rem] sm:min-h-[9.75rem]"
              : "min-h-[7.5rem] sm:min-h-[8.5rem]"
          }`}
        >
          <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
        </div>

        <div className="relative z-10 mt-auto border-t border-[color:var(--border-default)] pt-4 sm:pt-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
            <div className="flex min-h-10 flex-wrap content-start gap-2">
              {item.techTags?.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="theme-chip max-w-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
              {(item.techTags?.length || 0) > 3 ? (
                <span className="theme-chip px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  +{(item.techTags?.length || 0) - 3}
                </span>
              ) : null}
            </div>

            {githubLink || demoLink ? (
              <div className="flex min-h-10 items-start justify-start gap-1.5 opacity-80 transition-opacity group-hover:opacity-100 sm:justify-end">
                {githubLink ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(githubLink, "_blank", "noopener,noreferrer");
                    }}
                    className="motion-chip rounded-full border border-transparent p-2 text-[color:var(--text-tertiary)] transition-colors hover:border-[rgba(37,99,235,0.14)] hover:bg-[rgba(239,246,255,0.92)] hover:text-[color:var(--brand-gold)]"
                    aria-label="GitHub"
                    title="查看源码"
                  >
                    <Github size={15} strokeWidth={2} className="motion-icon-float" />
                  </button>
                ) : null}
                {demoLink ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(demoLink, "_blank", "noopener,noreferrer");
                    }}
                    className="motion-chip rounded-full border border-transparent p-2 text-[color:var(--text-tertiary)] transition-colors hover:border-[rgba(37,99,235,0.14)] hover:bg-[rgba(239,246,255,0.92)] hover:text-[color:var(--brand-gold)]"
                    aria-label="Live Demo"
                    title="查看演示"
                  >
                    <ExternalLink size={15} strokeWidth={2} className="motion-icon-float" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
});
