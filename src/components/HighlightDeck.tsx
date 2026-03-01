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

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HighlightDeck({
  items,
  timeline = [],
}: HighlightDeckProps) {
  const [selectedMetric, setSelectedMetric] = useState<ImpactItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [githubStats, setGithubStats] = useState<GitHubTelemetryPayload | null>(
    null,
  );

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
        // Keep static fallback values on request failures.
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
      <section className="section relative z-10">
        <div className="container">
          <div className="section-header mb-16">
            <h2 className="section-title mb-6">量化成果</h2>
            <p className="section-subtitle text-lg">
              用数据证明工程价值，点击卡片查看详情
            </p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item, index) => {
              const Icon = iconMap[item.icon] || TrendingUp;
              const isFocal = item.isFocal;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={cardVariants.initial}
                  whileInView={cardVariants.animate}
                  whileHover={{ y: -8, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{
                    duration: 0.38,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => handleCardClick(item)}
                  className={[
                    "group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl p-6 text-left will-change-transform",
                    isFocal
                      ? "border-zinc-800/80 bg-zinc-900/95 text-white shadow-2xl shadow-blue-900/10 backdrop-blur-xl"
                      : "border-zinc-200/50 bg-white/55 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50",
                    isFocal ? "sm:col-span-2 lg:col-span-1" : "",
                  ].join(" ")}
                  aria-label={`${item.title}-${item.label}`}
                >
                  {!isFocal && (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-sky-500/5 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-blue-500/0 transition-colors duration-300 ease-out group-hover:border-blue-500/20" />
                    </>
                  )}
                  {isFocal && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-sky-600/20 opacity-50 transition-opacity duration-300 ease-out group-hover:opacity-70" />
                  )}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
                    <div className="absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                  </div>

                  <div className="relative z-10 mb-4">
                    <div
                      className={[
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
                        isFocal
                          ? "bg-white/10 text-white"
                          : "bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/30",
                      ].join(" ")}
                    >
                      <Icon size={24} />
                    </div>

                    <div
                      className={[
                        "font-heading text-4xl font-bold tracking-tight tabular-nums md:text-5xl",
                        isFocal
                          ? "text-white"
                          : "text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400",
                      ].join(" ")}
                    >
                      {item.value}
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div
                      className={[
                        "mb-2 text-sm font-semibold",
                        isFocal
                          ? "text-zinc-200"
                          : "text-zinc-900 dark:text-zinc-100",
                      ].join(" ")}
                    >
                      {item.label}
                    </div>

                    {item.description && (
                      <p
                        className={[
                          "mb-6 text-sm leading-relaxed",
                          isFocal
                            ? "text-zinc-400"
                            : "text-zinc-500 transition-colors group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                        ].join(" ")}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.verification && (
                      <div className="mb-3 inline-flex w-fit self-start items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-900/20 dark:text-emerald-300">
                        已验证
                        <span className="opacity-70">
                          · {item.verification.verifiedAt}
                        </span>
                      </div>
                    )}

                    <div
                      className={[
                        "mt-auto flex translate-y-2 items-center gap-1 text-sm font-medium opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                        isFocal
                          ? "text-white"
                          : "text-blue-600 dark:text-blue-400",
                      ].join(" ")}
                    >
                      查看详情
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
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
