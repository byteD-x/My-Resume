"use client";

import { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import { ArrowUpDown, Search, Sparkles } from "lucide-react";
import { ProjectItem } from "@/types";
import { ExperienceCard } from "./ExperienceCard";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-md md:p-5"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="搜索项目名、技术栈、年份"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              aria-label="搜索项目"
            />
          </div>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setSortMode("highlight")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                sortMode === "highlight"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Sparkles size={13} className="mr-1 inline-block" />
              重点优先
            </button>
            <button
              type="button"
              onClick={() => setSortMode("latest")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                sortMode === "latest"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <ArrowUpDown size={13} className="mr-1 inline-block" />
              按时间
            </button>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTech("all");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              activeTech === "all"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
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
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                activeTech === tag
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          当前匹配{" "}
          <span className="font-bold text-slate-800">
            {filteredItems.length}
          </span>{" "}
          个项目
        </p>
      </motion.div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center">
          <p className="text-base font-semibold text-slate-700">暂无匹配项目</p>
          <p className="mt-2 text-sm text-slate-500">
            可尝试更换关键词或取消技术栈筛选。
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {visibleItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 65,
                    damping: 16,
                  },
                },
              }}
              className="h-full"
              style={{ willChange: "opacity, transform" }}
              layout
            >
              <ExperienceCard item={item} type="project" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
            }
            className="btn btn-secondary px-6 py-2.5 text-sm font-semibold"
          >
            加载更多项目
          </button>
        </div>
      )}
    </div>
  );
}
