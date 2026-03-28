"use client";

import React, { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import { TimelineItem as TimelineItemType } from "@/types";
import { TimelineItem } from "./TimelineItem";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";

interface TimelineProps {
  items: TimelineItemType[];
}

const TAG_ALL = "全部";
const POPULAR_TAG_LIMIT = 10;
const RECENT_TAG_LIMIT = 5;
const RECENT_TAG_STORAGE_KEY = "portfolio.timeline.recent_tags";

function readRecentTagsFromStorage(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_TAG_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(parsed.filter((tag): tag is string => typeof tag === "string")),
    ).slice(0, RECENT_TAG_LIMIT);
  } catch {
    return [];
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Timeline({ items }: TimelineProps) {
  const isHydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const isLowPerformanceMode = useLowPerformanceMode();
  const [activeTag, setActiveTag] = useState<string>(TAG_ALL);
  const [tagKeyword, setTagKeyword] = useState("");
  const [isTagExpanded, setIsTagExpanded] = useState(false);
  const [recentTags, setRecentTags] = useState<string[]>(() =>
    readRecentTagsFromStorage(),
  );
  const effectiveRecentTags = useMemo(
    () => (isHydrated ? recentTags : []),
    [isHydrated, recentTags],
  );

  const tagStats = useMemo(() => {
    const tagCount = new Map<string, number>();
    items.forEach((item) => {
      item.techTags.forEach((tag) => {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(tagCount.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [items]);

  const matchedTags = useMemo(() => {
    const keyword = tagKeyword.trim().toLowerCase();
    if (!keyword) return tagStats;
    return tagStats.filter(([tag]) => tag.toLowerCase().includes(keyword));
  }, [tagStats, tagKeyword]);

  const orderedTagNames = useMemo(() => {
    const matchedTagNames = matchedTags.map(([tag]) => tag);
    if (tagKeyword.trim().length > 0) return matchedTagNames;

    const recentMatched = effectiveRecentTags.filter((tag) =>
      matchedTagNames.includes(tag),
    );
    const remaining = matchedTagNames.filter(
      (tag) => !recentMatched.includes(tag),
    );
    return [...recentMatched, ...remaining];
  }, [matchedTags, effectiveRecentTags, tagKeyword]);

  const visibleTags = useMemo(() => {
    const coreTags =
      isTagExpanded || tagKeyword.trim().length > 0
        ? orderedTagNames
        : orderedTagNames.slice(0, POPULAR_TAG_LIMIT);

    const tags = [TAG_ALL, ...coreTags];
    if (activeTag !== TAG_ALL && !tags.includes(activeTag)) {
      tags.push(activeTag);
    }
    return tags;
  }, [activeTag, isTagExpanded, orderedTagNames, tagKeyword]);

  const recentDisplayTags = useMemo(() => {
    if (tagKeyword.trim().length > 0) return [];
    return orderedTagNames
      .filter((tag) => effectiveRecentTags.includes(tag))
      .slice(0, RECENT_TAG_LIMIT);
  }, [orderedTagNames, effectiveRecentTags, tagKeyword]);

  const filteredItems = useMemo(() => {
    if (activeTag === TAG_ALL) return items;
    return items.filter((item) => item.techTags.includes(activeTag));
  }, [activeTag, items]);
  const shouldAnimateTimeline = !shouldReduceMotion && !isLowPerformanceMode;

  const canExpand =
    tagKeyword.trim().length === 0 &&
    orderedTagNames.length > POPULAR_TAG_LIMIT;
  const hiddenTagCount = Math.max(
    orderedTagNames.length - POPULAR_TAG_LIMIT,
    0,
  );

  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
    if (tag === TAG_ALL) return;

    setRecentTags((prev) => {
      const next = [tag, ...prev.filter((item) => item !== tag)].slice(
        0,
        RECENT_TAG_LIMIT,
      );
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            RECENT_TAG_STORAGE_KEY,
            JSON.stringify(next),
          );
        } catch {
          // Ignore localStorage write failures.
        }
      }
      return next;
    });
  };

  return (
    <div className="space-y-7 sm:space-y-10">
      <div className="theme-card space-y-[1.125rem] rounded-2xl border-[rgba(148,163,184,0.16)] p-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:space-y-5 sm:rounded-[1.6rem] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="theme-card-kicker text-xs">
            {tagStats.length > 0
              ? `Filters (${tagStats.length})`
              : "Filters"}
          </p>

          <label className="relative block w-full sm:w-72">
            <span className="sr-only">搜索技术标签</span>
            <input
              type="search"
              value={tagKeyword}
              onChange={(event) => setTagKeyword(event.target.value)}
              placeholder="Search technologies..."
              className="w-full rounded-full border border-[color:var(--border-default)] bg-[rgba(255,255,255,0.92)] px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] outline-none transition-colors focus:border-[rgba(37,99,235,0.28)] focus:ring-2 focus:ring-[rgba(37,99,235,0.12)] sm:px-3 sm:py-2"
            />
          </label>
        </div>

        {recentDisplayTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="theme-card-kicker text-[11px]">Recent</span>
            {recentDisplayTags.map((tag) => (
              <button
                key={`recent-${tag}`}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={cn(
                  "cursor-pointer rounded px-3 py-1.5 text-[12px] font-semibold transition-colors sm:px-2.5 sm:py-1 sm:text-[11px]",
                  activeTag === tag
                    ? "bg-[rgba(239,246,255,0.95)] text-[color:var(--text-primary)]"
                    : "theme-chip hover:bg-[rgba(239,246,255,0.92)]",
                )}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-start gap-2 border-t border-[color:var(--border-default)] pt-4">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagSelect(tag)}
              className={cn(
                "cursor-pointer rounded border px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-xs",
                activeTag === tag
                  ? "border-[rgba(37,99,235,0.28)] bg-[color:var(--brand-ink)] text-[color:var(--text-inverse)]"
                  : "border-[color:var(--border-default)] bg-[rgba(255,255,255,0.92)] text-[color:var(--text-secondary)] hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--brand-gold)]",
              )}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        {canExpand && (
          <div className="border-t border-[color:var(--border-default)] pt-2">
            <button
              type="button"
              onClick={() => setIsTagExpanded((value) => !value)}
              className="theme-link text-[13px] font-semibold"
              aria-expanded={isTagExpanded}
            >
              {isTagExpanded ? "Show Less" : `Show All (+${hiddenTagCount})`}
            </button>
          </div>
        )}
      </div>

      <div className="relative min-h-[420px] pt-2 sm:min-h-[500px] sm:pt-4">
        <div
          className="absolute bottom-0 left-[13px] top-4 hidden w-[1px] bg-[rgba(37,99,235,0.14)] md:block"
          aria-hidden="true"
        />

        <div className="space-y-8 sm:space-y-12">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={shouldAnimateTimeline ? "hidden" : false}
              animate={shouldAnimateTimeline ? "visible" : undefined}
              variants={itemVariants}
              transition={
                shouldAnimateTimeline
                  ? {
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }
                  : undefined
              }
            >
              <TimelineItem
                item={item}
                index={index}
                isHighlighted={item.highlighted}
                isLast={index === filteredItems.length - 1}
              />
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={shouldAnimateTimeline ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            className="theme-copy py-24 text-center text-sm font-medium"
          >
            No matching experience found.
          </motion.div>
        )}
      </div>
    </div>
  );
}
