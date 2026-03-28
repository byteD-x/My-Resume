"use client";

import dynamic from "next/dynamic";
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

const MetricDrawer = dynamic(() => import("./MetricDrawer"), {
  ssr: false,
  loading: () => null,
});

export default function HighlightDeck({
  items,
  timeline = [],
}: HighlightDeckProps) {
  const [selectedMetric, setSelectedMetric] = useState<ImpactItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasLoadedMetricDrawer, setHasLoadedMetricDrawer] = useState(false);
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
    setHasLoadedMetricDrawer(true);
    setSelectedMetric(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    window.setTimeout(() => setSelectedMetric(null), 200);
  };

  return (
    <>
      <section className="theme-grid-section theme-section-dense relative z-10 !py-8 sm:!py-10 lg:!py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="theme-section-header scroll-mt-28 !mb-5 sm:!mb-6 lg:!mb-7"
            data-scroll-target="impact"
          >
            <p className="theme-kicker text-[11px]">量化结果</p>
            <h2 className="theme-title mt-2.5 text-3xl font-bold md:text-4xl">
              业务价值与工程量化
            </h2>
            <p className="theme-section-copy mt-2.5 md:text-lg">
              仅展示有指标或证据支撑的结果。
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
            className="grid auto-rows-fr grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
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
                  onClick={() => handleCardClick(item)}
                  className={[
                    "theme-card-interactive group relative flex h-full w-full cursor-pointer flex-col overflow-hidden text-left will-change-transform border transition-colors duration-200",
                    isFocal
                      ? "theme-card rounded-2xl border-[rgba(52,211,153,0.26)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(240,253,250,0.96)_58%,rgba(236,253,245,0.92)_100%)] p-4 shadow-[0_12px_28px_rgba(16,185,129,0.075)] sm:col-span-2 sm:p-5 md:rounded-[1.35rem] md:shadow-[0_18px_38px_rgba(16,185,129,0.08)] lg:col-span-1 hover:border-[rgba(16,185,129,0.34)]"
                      : "theme-card rounded-[1.05rem] p-4 sm:rounded-[1.2rem] sm:p-[1.125rem] hover:border-[rgba(37,99,235,0.22)]",
                  ].join(" ")}
                  aria-label={`${item.title}-${item.label}`}
                >
                  {isFocal ? (
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(110,231,183,0.24),transparent_72%)]" />
                  ) : null}
                  <div className="relative z-10 mb-4 flex items-start justify-between sm:mb-5">
                    <div
                      className={[
                        "font-heading text-[1.95rem] font-bold leading-none tracking-tighter tabular-nums sm:text-[2.2rem] md:text-[2.55rem]",
                        "text-[color:var(--text-primary)]",
                      ].join(" ")}
                    >
                      {item.value}
                    </div>
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-md border",
                        isFocal
                          ? "border-[rgba(52,211,153,0.28)] bg-[rgba(236,253,245,0.92)] text-emerald-600"
                          : "border-[rgba(37,99,235,0.12)] bg-[rgba(239,246,255,0.78)] text-[color:var(--brand-gold)]",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div
                      className={[
                        "mb-1.5 text-[14px] font-semibold tracking-tight",
                        "text-[color:var(--text-primary)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </div>

                    {item.description && (
                      <p
                        className={[
                          "mb-4 text-[13px] leading-relaxed sm:mb-5",
                          "text-[color:var(--text-secondary)]",
                        ].join(" ")}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.verification && (
                      <div className="mb-3 inline-flex w-fit self-start items-center gap-1.5 rounded-full border border-emerald-300/70 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest sm:mb-4">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            "bg-emerald-500 dark:bg-emerald-400",
                          )}
                        />
                        <span className="text-emerald-700 dark:text-emerald-300">
                          已核验
                        </span>
                      </div>
                    )}

                    <div
                      className={[
                        "mt-auto flex items-center gap-1.5 text-[13px] font-semibold opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100",
                        "text-[color:var(--text-primary)]",
                      ].join(" ")}
                    >
                      查看详情
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {hasLoadedMetricDrawer ? (
        <MetricDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          metric={selectedMetric}
          linkedExperience={linkedExperience}
        />
      ) : null}
    </>
  );
}
