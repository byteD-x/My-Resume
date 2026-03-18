"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowUpDown, Search, Sparkles } from "lucide-react";
import { ProjectItem } from "@/types";
import { ExperienceCard } from "./ExperienceCard";
import { cn } from "@/lib/utils";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimateInView = !isLowPerformanceMode;
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("highlight");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const chipTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : ({ type: "spring", stiffness: 460, damping: 36, mass: 0.75 } as const);

  const sortOptions = useMemo(
    () =>
      [
        {
          key: "highlight" as const,
          label: "重点优先",
          icon: Sparkles,
        },
        {
          key: "latest" as const,
          label: "按时间",
          icon: ArrowUpDown,
        },
      ] satisfies Array<{
        key: SortMode;
        label: string;
        icon: typeof Sparkles;
      }>,
    [],
  );

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
        className="theme-card rounded-[1.65rem] p-4 md:p-6"
      >
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative min-w-[240px] flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-tertiary)]"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="搜索项目名称、技术栈、年份"
              className="w-full rounded-full border border-[color:var(--border-default)] bg-[rgba(255,255,255,0.92)] py-2.5 pl-10 pr-4 text-[13px] font-medium text-[color:var(--text-primary)] placeholder:font-normal placeholder:text-[color:var(--text-tertiary)] outline-none transition-colors focus:border-[rgba(37,99,235,0.28)] focus:ring-2 focus:ring-[rgba(37,99,235,0.12)]"
              aria-label="搜索项目"
            />
          </div>

          <div className="inline-flex items-center rounded-full border border-[color:var(--border-default)] bg-[rgba(248,250,252,0.92)] p-1">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortMode === option.key;

              return (
                <motion.button
                  key={option.key}
                  layout
                  type="button"
                  onClick={() => setSortMode(option.key)}
                  transition={chipTransition}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  className={cn(
                    "motion-chip relative rounded-full px-3.5 py-1.5 text-[12px] font-semibold",
                    isActive
                      ? "text-[color:var(--text-primary)]"
                      : "text-[color:var(--text-tertiary)] hover:text-[color:var(--brand-gold)]",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="project-sort-active-pill"
                      className="motion-chip-active-indicator"
                      transition={chipTransition}
                    />
                  ) : null}
                  <span className="motion-chip-label">
                    <Icon
                      size={12}
                      className={cn(
                        "motion-icon-float opacity-70",
                        isActive && "opacity-100",
                      )}
                    />
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {["all", ...techFilters].map((tag) => {
            const isActive = activeTech === tag;
            const label = tag === "all" ? "全部" : tag;

            return (
              <motion.button
                key={tag}
                layout
                type="button"
                onClick={() => {
                  setActiveTech(tag);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                transition={chipTransition}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                className={cn(
                  "motion-chip relative rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider",
                  isActive
                    ? "border-[rgba(37,99,235,0.28)] text-[color:var(--text-primary)]"
                    : "border-[color:var(--border-default)] bg-[rgba(255,255,255,0.92)] text-[color:var(--text-secondary)] hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--brand-gold)]",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="project-tech-active-pill"
                    className={cn(
                      "motion-chip-active-indicator",
                      tag === "all" &&
                        "bg-[color:var(--brand-ink)] shadow-[0_12px_24px_rgba(15,23,42,0.18)]",
                    )}
                    transition={chipTransition}
                  />
                ) : null}
                <span
                  className={cn(
                    "motion-chip-label",
                    isActive && tag === "all" && "text-[color:var(--text-inverse)]",
                  )}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className="theme-copy-subtle text-[10px] font-bold uppercase tracking-widest">
          Showing{" "}
          <span className="text-[color:var(--text-primary)]">
            {filteredItems.length}
          </span>{" "}
          Results
        </p>
      </motion.div>

      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="theme-card-muted flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed p-16 text-center"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(239,246,255,0.92)] text-[color:var(--brand-gold)]">
            <Search size={18} className="motion-icon-float" />
          </div>
          <p className="theme-title text-[14px] font-semibold">
            未找到匹配的工程实践
          </p>
          <p className="theme-copy mt-2 max-w-sm text-[13px]">
            你可以尝试更换搜索关键词，或重置当前的技术栈筛选条件。
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTech("all");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className="theme-link mt-6 text-[13px] font-semibold underline underline-offset-4"
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
                layout
                initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.12 }
                    : {
                        layout: chipTransition,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                className="h-full"
              >
                <ExperienceCard item={item} type="project" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasMore ? (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
            }
            className="btn btn-secondary w-auto px-8 py-2.5 text-[13px]"
          >
            加载更多项目
          </button>
        </div>
      ) : null}
    </div>
  );
}
