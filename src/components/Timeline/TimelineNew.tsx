"use client";

import React, { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import { TimelineItem as TimelineItemType } from "@/types";
import { TimelineItem } from "./TimelineItem";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";

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
    <div className="space-y-10">
      <div className="space-y-5 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
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
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800"
            />
          </label>
        </div>

        {recentDisplayTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400">Recent</span>
            {recentDisplayTags.map((tag) => (
              <button
                key={`recent-${tag}`}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={cn(
                  "cursor-pointer rounded px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  activeTag === tag
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                )}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-start gap-2 pt-2">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagSelect(tag)}
              className={cn(
                "cursor-pointer rounded border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                activeTag === tag
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100",
              )}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        {canExpand && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={() => setIsTagExpanded((value) => !value)}
              className="text-[13px] font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
              aria-expanded={isTagExpanded}
            >
              {isTagExpanded ? "Show Less" : `Show All (+${hiddenTagCount})`}
            </button>
          </div>
        )}
      </div>

      <div className="relative min-h-[500px] pt-4">
        <div
          className="absolute left-[13px] top-4 bottom-0 hidden w-[1px] bg-zinc-200 dark:bg-zinc-800 md:block"
          aria-hidden="true"
        />

        <div className="space-y-12">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
          >
            No matching experience found.
          </motion.div>
        )}
      </div>
    </div>
  );
}
