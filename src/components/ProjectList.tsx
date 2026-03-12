"use client";

import { useMemo, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Search, Sparkles } from "lucide-react";
import { ProjectItem } from "@/types";
import { ExperienceCard } from "./ExperienceCard";
import { cn } from "@/lib/utils";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";

interface ProjectListProps {
  items: ProjectItem[];
}

const INITIAL_VISIBLE_COUNT = 6;

type SortMode = "latest" | "highlight";

function extractSortKey(period: string): number {
  const match = period.match(/(\d{4})(?:\.(\d{1,2}))?/);
  if (!match) return Number.NEGATIVE_INFINITY;

  const year = Number(match[1]);
  const month = Number(match[2] ?? "1");
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return Number.NEGATIVE_INFINITY;
  }

  return year * 100 + Math.min(Math.max(month, 1), 12);
}

export function ProjectList({ items }: ProjectListProps) {
  const isLowPerformanceMode = useLowPerformanceMode();
  const shouldAnimateInView = !isLowPerformanceMode;
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("highlight");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const techFilters = useMemo(() => {
    const frequency = new Map<string, number>();
    items.forEach((item) => {
      item.techTags.forEach((tag) => {
        frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
      });
    });

    return [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const queried = items.filter((item) => {
      const queryText = [item.name, item.summary, item.year, ...item.techTags]
        .join(" ")
        .toLowerCase();
      const queryMatched =
        normalizedQuery.length === 0 || queryText.includes(normalizedQuery);
      const techMatched =
        activeTech === "all" || item.techTags.includes(activeTech);
      return queryMatched && techMatched;
    });

    return queried.sort((a, b) => {
      if (sortMode === "highlight") {
        if (a.highlighted && !b.highlighted) return -1;
        if (!a.highlighted && b.highlighted) return 1;
      }
      return extractSortKey(b.year) - extractSortKey(a.year);
    });
  }, [activeTech, items, query, sortMode]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="space-y-8">
      <motion.div
        initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
        whileInView={shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
        animate={!shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
        viewport={shouldAnimateInView ? { once: true } : undefined}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:p-6"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[240px] flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="搜索项目名、技术栈、年份"
              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2 pl-10 pr-4 text-[13px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:font-normal placeholder:text-zinc-500 outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-800"
              aria-label="搜索项目"
            />
          </div>

          <div className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
            <button
              type="button"
              onClick={() => setSortMode("highlight")}
              className={cn(
                "rounded px-3 py-1 text-[12px] font-semibold transition-colors",
                sortMode === "highlight"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              <Sparkles size={12} className="mr-1.5 inline-block opacity-70" />
              重点优先
            </button>
            <button
              type="button"
              onClick={() => setSortMode("latest")}
              className={cn(
                "rounded px-3 py-1 text-[12px] font-semibold transition-colors",
                sortMode === "latest"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
              )}
            >
              <ArrowUpDown size={12} className="mr-1.5 inline-block opacity-70" />
              按时间
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTech("all");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className={cn(
              "rounded border px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold transition-colors",
              activeTech === "all"
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100",
            )}
          >
            全部
          </button>
          {techFilters.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setActiveTech(tag);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              className={cn(
                "rounded border px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold transition-colors",
                activeTech === tag
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Showing{" "}
          <span className="text-zinc-900 dark:text-zinc-100">
            {filteredItems.length}
          </span>{" "}
          Results
        </p>
      </motion.div>

      {filteredItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 p-16 text-center"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
            <Search size={18} />
          </div>
          <p className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">未找到匹配的工程实践</p>
          <p className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400 max-w-sm">
            你可以尝试更换搜索关键词，或重置当前的技术栈筛选条件。
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTech("all");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className="mt-6 text-[13px] font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 underline underline-offset-4"
          >
            重置筛选条件
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-7">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item) => (
              <motion.div
                key={item.id}
                initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ExperienceCard item={item} type="project" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
            }
            className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 py-2.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            加载更多项目
          </button>
        </div>
      )}
    </div>
  );
}
