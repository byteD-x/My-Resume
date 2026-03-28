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
      <div className="theme-card theme-card-interactive relative flex h-full flex-col overflow-hidden rounded-[1.3rem] border-[rgba(148,163,184,0.16)] p-[1.125rem] shadow-[0_14px_30px_rgba(15,23,42,0.055)] sm:rounded-[1.55rem] sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[4.5rem] bg-[linear-gradient(180deg,rgba(219,234,254,0.42),transparent)] opacity-90" />

        <div className="relative z-10 mb-4 flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-6 sm:pb-5">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="theme-card-title text-[1.04rem] transition-colors group-hover:text-[color:var(--brand-gold)] sm:text-[1.08rem]">
              {title}
            </h3>
            {subtitle ? (
              <p className="theme-card-kicker mt-2">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {!hideDate ? (
              <div className="theme-chip px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.2em]">
                {date}
              </div>
            ) : null}
            <div className="motion-chip flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(37,99,235,0.14)] bg-white/88 text-[color:var(--text-tertiary)] transition-colors duration-200 group-hover:border-[rgba(37,99,235,0.26)] group-hover:text-[color:var(--brand-gold)] sm:h-9 sm:w-9">
              <ArrowUpRight className="motion-arrow-shift h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        <div
          className={`theme-card-body relative z-10 mb-5 flex-grow text-[13px] leading-[1.9] sm:mb-7 sm:text-[14px] sm:leading-7 ${
            isProjectCard
              ? "min-h-[8rem] sm:min-h-[9.5rem]"
              : "min-h-[7rem] sm:min-h-[8.5rem]"
          }`}
        >
          <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
        </div>

        <div className="relative z-10 mt-auto border-t border-[color:var(--border-default)] pt-3.5 sm:pt-5">
          <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
            <div className="flex min-h-9 flex-wrap content-start gap-2">
              {item.techTags?.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="theme-chip max-w-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-wider"
                >
                  {tag}
                </span>
              ))}
              {(item.techTags?.length || 0) > 3 ? (
                <span className="theme-chip px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-wider">
                  +{(item.techTags?.length || 0) - 3}
                </span>
              ) : null}
            </div>

            {githubLink || demoLink ? (
              <div className="flex min-h-9 items-start justify-start gap-2 opacity-80 transition-opacity group-hover:opacity-100 sm:min-h-10 sm:justify-end">
                {githubLink ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(githubLink, "_blank", "noopener,noreferrer");
                    }}
                    className="motion-chip flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[color:var(--text-tertiary)] transition-colors hover:border-[rgba(37,99,235,0.14)] hover:bg-[rgba(239,246,255,0.92)] hover:text-[color:var(--brand-gold)] sm:h-8 sm:w-8"
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
                    className="motion-chip flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[color:var(--text-tertiary)] transition-colors hover:border-[rgba(37,99,235,0.14)] hover:bg-[rgba(239,246,255,0.92)] hover:text-[color:var(--brand-gold)] sm:h-8 sm:w-8"
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
