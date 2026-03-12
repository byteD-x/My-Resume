"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
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
      className="block group h-full"
      onClick={handleOpen}
    >
      <div
        className="
                    relative overflow-hidden p-6 rounded-lg
                    bg-white dark:bg-zinc-900/50
                    border border-zinc-200 dark:border-zinc-800
                    transition-colors duration-300 ease-out
                    flex flex-col h-full
                    group-hover:border-zinc-400 dark:group-hover:border-zinc-600
                "
      >
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-1.5 uppercase tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          {!hideDate && (
            <div className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-1 tracking-wider">
              {date}
            </div>
          )}
        </div>

        <div className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-3 leading-relaxed relative z-10 flex-grow">
          <MarkdownRenderer inline>{item.summary}</MarkdownRenderer>
        </div>

        <div className="flex flex-wrap items-end gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/80 relative z-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {item.techTags?.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="rounded px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {tag}
              </span>
            ))}
            {(item.techTags?.length || 0) > 3 && (
              <span className="rounded px-2 py-1 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border border-zinc-200 dark:border-zinc-800">
                +{(item.techTags?.length || 0) - 3}
              </span>
            )}
          </div>

          {(githubLink || demoLink) && (
            <div className="flex items-center gap-1.5 ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {githubLink && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(githubLink, "_blank", "noopener,noreferrer");
                  }}
                  className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="GitHub"
                  title="查看源码"
                >
                  <Github size={16} strokeWidth={2} />
                </button>
              )}
              {demoLink && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(demoLink, "_blank", "noopener,noreferrer");
                  }}
                  className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  aria-label="Live Demo"
                  title="查看演示"
                >
                  <ExternalLink size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
          <ArrowUpRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        </div>
      </div>
    </Link>
  );
});
