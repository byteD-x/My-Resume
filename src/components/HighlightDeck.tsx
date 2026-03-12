"use client";

import { useEffect, useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Database,
  Gauge,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ImpactItem, TimelineItem } from "@/types";
import {
  getGithubTelemetry,
  type GitHubTelemetryPayload,
} from "@/lib/github-telemetry";
import MetricDrawer from "./MetricDrawer";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Star,
  Users,
  Zap,
  Gauge,
  Code2,
  Database,
  TrendingDown,
  TrendingUp,
};

interface HighlightDeckProps {
  items: ImpactItem[];
  timeline?: TimelineItem[];
}

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export default function HighlightDeck({
  items,
  timeline = [],
}: HighlightDeckProps) {
  const [selectedMetric, setSelectedMetric] = useState<ImpactItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [githubStats, setGithubStats] = useState<GitHubTelemetryPayload | null>(null);

  const linkedExperience = useMemo(() => {
    if (!selectedMetric?.linkedExperienceId) return null;
    return (
      timeline.find((item) => item.id === selectedMetric.linkedExperienceId) ??
      null
    );
  }, [selectedMetric, timeline]);

  const strictCoreItems = useMemo(() => {
    const strictItems = items.filter(
      (item) => item.verification?.level === "strict",
    );
    return strictItems.length > 0 ? strictItems : items;
  }, [items]);

  const displayItems = useMemo(() => {
    if (!githubStats) return strictCoreItems;

    return strictCoreItems.map((item) => {
      if (item.githubRepo && githubStats.specificRepos) {
        const repoName = item.githubRepo.split("/")[1] || item.githubRepo;
        const matched = githubStats.specificRepos.find(
          (repo) => repo.name === repoName,
        );
        if (matched) {
          return { ...item, value: `${matched.stars}+` };
        }
      }

      return item;
    });
  }, [githubStats, strictCoreItems]);

  useEffect(() => {
    if (isStaticExport) return;
    let active = true;

    const fetchStats = async () => {
      try {
        const payload = await getGithubTelemetry();
        if (!active) return;
        setGithubStats(payload);
      } catch {
        // Fallback
      }
    };

    void fetchStats();
    return () => {
      active = false;
    };
  }, []);

  const handleCardClick = (item: ImpactItem) => {
    setSelectedMetric(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    window.setTimeout(() => setSelectedMetric(null), 200);
  };

  return (
    <>
      <section className="relative z-10 py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 max-w-3xl scroll-mt-28"
            data-scroll-target="impact"
          >
            <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
              Proven Impact
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              业务价值与工程量化
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-lg">
              拒绝模糊的“参与式”描述。这里的每一项产出，都通过真实的数据指标、可复核的开源仓库或明确的线上效果来验证其真正的工程价值。
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayItems.map((item) => {
              const Icon = iconMap[item.icon] || TrendingUp;
              const isFocal = item.isFocal;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleCardClick(item)}
                  className={[
                    "group relative flex h-full w-full cursor-pointer flex-col overflow-hidden text-left will-change-transform border transition-colors duration-200",
                    isFocal
                      ? "bg-zinc-900 border-zinc-800 text-zinc-50 p-8 rounded-xl sm:col-span-2 lg:col-span-1 dark:bg-white dark:border-zinc-200 dark:text-zinc-950 hover:border-zinc-700 dark:hover:border-zinc-400"
                      : "bg-white border-zinc-200 p-6 rounded-lg dark:bg-zinc-900/50 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                  ].join(" ")}
                  aria-label={`${item.title}-${item.label}`}
                >
                  <div className="relative z-10 mb-6 flex items-start justify-between">
                    <div
                      className={[
                        "font-heading text-4xl font-bold tracking-tighter tabular-nums md:text-[2.75rem] leading-none",
                        isFocal
                          ? "text-zinc-50 dark:text-zinc-900"
                          : "text-zinc-900 dark:text-zinc-50",
                      ].join(" ")}
                    >
                      {item.value}
                    </div>
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-md border",
                        isFocal
                          ? "border-zinc-800 bg-zinc-800/50 text-zinc-300 dark:border-zinc-200 dark:bg-zinc-100 dark:text-zinc-600"
                          : "border-zinc-100 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div
                      className={[
                        "mb-2 text-[15px] font-semibold tracking-tight",
                        isFocal
                          ? "text-zinc-300 dark:text-zinc-700"
                          : "text-zinc-900 dark:text-zinc-100",
                      ].join(" ")}
                    >
                      {item.label}
                    </div>

                    {item.description && (
                      <p
                        className={[
                          "mb-6 text-[13px] leading-relaxed",
                          isFocal
                            ? "text-zinc-400 dark:text-zinc-500"
                            : "text-zinc-500 dark:text-zinc-400",
                        ].join(" ")}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.verification && (
                      <div className="mb-5 inline-flex w-fit self-start items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <span className={cn("h-1.5 w-1.5 rounded-full", isFocal ? "bg-zinc-400 dark:bg-zinc-600" : "bg-zinc-400 dark:bg-zinc-500")} />
                        <span className={isFocal ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"}>Verified</span>
                      </div>
                    )}

                    <div
                      className={[
                        "mt-auto flex items-center gap-1.5 text-[13px] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                        isFocal
                          ? "text-zinc-50 dark:text-zinc-900"
                          : "text-zinc-900 dark:text-zinc-50",
                      ].join(" ")}
                    >
                      View Details
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <MetricDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        metric={selectedMetric}
        linkedExperience={linkedExperience}
      />
    </>
  );
}
