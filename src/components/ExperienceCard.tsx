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

const MAX_TIMELINE_PREVIEW_POINTS = 3;

function normalizePreviewText(value?: string) {
  return value?.replace(/\r/g, "").replace(/\s+/g, " ").trim() ?? "";
}

function extractMarkdownListItems(value?: string) {
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim());
}

function getTimelinePreviewPoints(item: TimelineItem | ProjectItem) {
  if (!("role" in item)) return [];

  const points: string[] = [];
  const seen = new Set<string>();
  const details = item.expandedDetails;

  const pushPoint = (value?: string) => {
    const normalized = normalizePreviewText(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    points.push(normalized);
  };

  if (details) {
    const solutionPoints = extractMarkdownListItems(details.solution);

    if (solutionPoints.length > 0) {
      solutionPoints.forEach(pushPoint);
    } else {
      pushPoint(details.solution);
    }

    pushPoint(details.result);

    if (points.length < MAX_TIMELINE_PREVIEW_POINTS && details.techStack?.length) {
      pushPoint(`技术栈：${details.techStack.slice(0, 4).join(" / ")}`);
    }
  }

  if (points.length === 0) {
    pushPoint(item.engineeringDepth?.zh);
    pushPoint(item.businessValue?.zh);
    pushPoint(item.summary);
  }

  return points.slice(0, MAX_TIMELINE_PREVIEW_POINTS);
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
  const isTimelineCard = !isProjectCard;

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
      <div
        className={`theme-card theme-card-interactive relative flex h-full flex-col overflow-hidden border-[rgba(148,163,184,0.16)] shadow-[0_14px_30px_rgba(15,23,42,0.055)] ${
          isTimelineCard
            ? "rounded-[1.1rem] p-3.5 sm:rounded-[1.25rem] sm:p-3.5 md:p-4"
            : "rounded-[1.2rem] p-4 sm:rounded-[1.4rem] sm:p-4 md:p-5"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.42),transparent)] opacity-90 ${
            isTimelineCard ? "h-[3.2rem]" : "h-[3.75rem]"
          }`}
        />

        <div
          className={`relative z-10 flex items-start justify-between border-b border-[color:var(--border-default)] ${
            isTimelineCard
              ? "mb-3 gap-3 pb-2.5 sm:mb-4 sm:pb-3"
              : "mb-3.5 gap-3.5 pb-3 sm:mb-5 sm:pb-4"
          }`}
        >
          <div className="min-w-0 flex-1 pr-4">
            <h3
              className={`theme-card-title transition-colors group-hover:text-[color:var(--brand-gold)] ${
                isTimelineCard ? "text-[0.97rem] sm:text-[1rem]" : "text-[1rem] sm:text-[1.04rem]"
              }`}
            >
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
          className={`theme-card-body relative z-10 flex-grow text-[13px] leading-[1.78] sm:text-[14px] sm:leading-6 ${
            isProjectCard
              ? "mb-4 min-h-[6rem] sm:mb-5 sm:min-h-[7rem]"
              : "mb-3.5 min-h-[6.25rem] sm:mb-4 sm:min-h-[7rem]"
          }`}
        >
          {isTimelineCard ? (
            <ul className="space-y-1.5">
              {getTimelinePreviewPoints(item).map((point, index) => (
                <li
                  key={`${item.id}-preview-${index}`}
                  className="flex items-start gap-1.5"
                >
                  <span className="mt-[0.15rem] shrink-0 text-[color:var(--text-secondary)]">
                    ·
                  </span>
                  <MarkdownRenderer inline className="min-w-0 flex-1">
                    {point}
                  </MarkdownRenderer>
                </li>
              ))}
            </ul>
          ) : (
            <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
          )}
        </div>

        <div
          className={`relative z-10 mt-auto border-t border-[color:var(--border-default)] ${
            isTimelineCard ? "pt-2.5 sm:pt-3" : "pt-3 sm:pt-4"
          }`}
        >
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-3">
            <div
              className={`flex flex-wrap content-start gap-1.5 ${
                isTimelineCard ? "min-h-7 sm:min-h-8" : "min-h-8"
              }`}
            >
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
              <div className="flex min-h-8 items-start justify-start gap-1.5 opacity-80 transition-opacity group-hover:opacity-100 sm:min-h-9 sm:justify-end">
                {githubLink ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(githubLink, "_blank", "noopener,noreferrer");
                    }}
                    className="motion-chip flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[color:var(--text-tertiary)] transition-colors hover:border-[rgba(37,99,235,0.14)] hover:bg-[rgba(239,246,255,0.92)] hover:text-[color:var(--brand-gold)] sm:h-8 sm:w-8"
                    aria-label="查看 GitHub 仓库"
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
                    aria-label="查看在线演示"
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
