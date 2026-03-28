"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m as motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Clock3,
  Cpu,
  Gauge,
  Github,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useHydrated } from "@/hooks/useHydrated";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import staticGithubTelemetry from "@/data/github-telemetry.json";
import {
  fallbackGithubTelemetry,
  getGithubTelemetry,
  type GitHubTelemetryPayload,
  type TelemetrySource,
} from "@/lib/github-telemetry";
import {
  getRuntimeSnapshot,
  type RuntimeMetric,
  subscribeRuntimeSnapshot,
} from "@/lib/runtime-metrics-store";
import { cn } from "@/lib/utils";

type TelemetryState = "idle" | "loading" | "ready" | "error";

const metricOrder: RuntimeMetric["name"][] = [
  "LCP",
  "INP",
  "CLS",
  "FCP",
  "TTFB",
];

const metricUnitMap: Record<RuntimeMetric["name"], string> = {
  LCP: "ms",
  INP: "ms",
  CLS: "",
  FCP: "ms",
  TTFB: "ms",
};

const metricLabelMap: Record<RuntimeMetric["name"], string> = {
  LCP: "最大内容渲染时间 (LCP)",
  INP: "交互到下次绘制时间 (INP)",
  CLS: "累计布局偏移 (CLS)",
  FCP: "首次内容绘制 (FCP)",
  TTFB: "首字节到达时间 (TTFB)",
};

const metricDescriptionMap: Record<RuntimeMetric["name"], string> = {
  LCP: "衡量首屏主要内容完成渲染所需时间。",
  INP: "衡量用户交互后的整体响应延迟。",
  CLS: "衡量页面加载过程中的视觉稳定性。",
  FCP: "衡量浏览器首次绘制有效内容的时间点。",
  TTFB: "衡量服务端和网络链路返回首字节的速度。",
};

const ratingClassMap = {
  pending:
    "border-[color:var(--border-default)] bg-[rgba(var(--surface-muted-rgb),0.78)] text-[color:var(--text-secondary)]",
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "needs-improvement": "border-blue-200 bg-blue-50 text-blue-700",
  poor: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

const sourceLabelMap: Record<TelemetrySource, string> = {
  "github-api": "GitHub API",
  "github-web": "GitHub 页面降级",
  fallback: "本地降级数据",
};

const ratingLabelMap = {
  pending: "等待采集",
  good: "良好",
  "needs-improvement": "待优化",
  poor: "风险",
} as const;

const telemetryStateLabelMap: Record<TelemetryState, string> = {
  idle: "待同步",
  loading: "同步中",
  ready: "已更新",
  error: "已降级",
};

const deployTargetLabelMap: Record<string, string> = {
  server: "服务端渲染",
  "static-export": "静态导出",
};

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? "未知";
const deployTarget =
  process.env.NEXT_PUBLIC_DEPLOY_TARGET ??
  (isStaticExport ? "static-export" : "server");
const nextVersion = process.env.NEXT_PUBLIC_NEXT_VERSION ?? "未知";
const reactVersion = process.env.NEXT_PUBLIC_REACT_VERSION ?? "未知";
const tsVersion = process.env.NEXT_PUBLIC_TYPESCRIPT_VERSION ?? "未知";

const formatMetricValue = (metric: RuntimeMetric) => {
  if (metric.value === null) return "--";
  if (metric.name === "CLS") return metric.value.toFixed(3);
  return Math.round(metric.value).toString();
};

const formatCount = (value: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return value.toLocaleString("zh-CN");
};

const panelSectionClassName =
  "theme-card rounded-[1.05rem] p-4 sm:rounded-[1.3rem] sm:p-4 md:p-5";

const MetricCard = React.memo(({ metric }: { metric: RuntimeMetric }) => {
  const rating = metric.value === null ? "pending" : metric.rating;

  return (
    <article className="theme-card-muted flex min-h-[6.4rem] flex-col rounded-[1rem] p-3 sm:min-h-[7rem] sm:rounded-[1.2rem] sm:p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Tooltip content={metricDescriptionMap[metric.name]} position="top">
            <p className="theme-copy-subtle w-fit cursor-help border-b border-dashed border-[color:var(--border-default)] text-[11px] font-semibold transition-colors hover:border-[rgba(37,99,235,0.3)] hover:text-[color:var(--brand-gold)]">
              {metricLabelMap[metric.name]}
            </p>
          </Tooltip>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${ratingClassMap[rating]}`}
        >
          {ratingLabelMap[rating]}
        </span>
      </div>

      <div className="mt-auto pt-4">
        <p className="theme-title text-[1.6rem] font-bold tracking-tight sm:text-[1.8rem]">
          {formatMetricValue(metric)}
          {metric.value !== null && metricUnitMap[metric.name] ? (
            <span className="theme-copy-subtle ml-1 text-[13px] font-medium">
              {metricUnitMap[metric.name]}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
});

MetricCard.displayName = "MetricCard";

interface OverviewItem {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

interface EngineeringCommandCenterProps {
  className?: string;
  compact?: boolean;
}

export default function EngineeringCommandCenter({
  className,
  compact = false,
}: EngineeringCommandCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [githubTelemetry, setGithubTelemetry] =
    useState<GitHubTelemetryPayload>(
      isStaticExport
        ? (staticGithubTelemetry as GitHubTelemetryPayload)
        : fallbackGithubTelemetry,
    );
  const [telemetryState, setTelemetryState] = useState<TelemetryState>(
    isStaticExport ? "ready" : "idle",
  );
  const isHydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen, {
    onEscape: () => setIsOpen(false),
    initialFocusRef: closeButtonRef,
    lockBodyScroll: true,
  });

  const runtimeSnapshot = useSyncExternalStore(
    subscribeRuntimeSnapshot,
    getRuntimeSnapshot,
    getRuntimeSnapshot,
  );

  const fetchTelemetry = useCallback(async (options?: { force?: boolean }) => {
    if (isStaticExport) {
      if (options?.force) {
        setTelemetryState("ready");
        setGithubTelemetry(staticGithubTelemetry as GitHubTelemetryPayload);
      }
      return;
    }

    setTelemetryState("loading");
    try {
      const data = await getGithubTelemetry({ force: Boolean(options?.force) });
      setGithubTelemetry(data);
      setTelemetryState("ready");
    } catch {
      setTelemetryState("error");
      setGithubTelemetry({
        ...fallbackGithubTelemetry,
        message: "GitHub 数据请求失败，请稍后重试。",
      });
    }
  }, []);

  const metricCards = useMemo(
    () => metricOrder.map((name) => runtimeSnapshot.metrics[name]),
    [runtimeSnapshot.metrics],
  );

  const overviewItems = useMemo<OverviewItem[]>(
    () => [
      {
        label: "状态",
        value: telemetryStateLabelMap[telemetryState],
        hint:
          telemetryState === "loading"
            ? "正在同步"
            : "打开时自动刷新",
        icon: Activity,
      },
      {
        label: "数据",
        value: sourceLabelMap[githubTelemetry.source ?? "fallback"],
        hint: "失败时自动降级",
        icon: Github,
      },
      {
        label: "部署",
        value: deployTargetLabelMap[deployTarget] ?? deployTarget,
        hint: "当前发布形态",
        icon: Cpu,
      },
      {
        label: "构建",
        value: buildTimestamp,
        hint: buildTimestamp === "未知" ? "等待注入" : "最近构建时间",
        icon: Clock3,
      },
    ],
    [githubTelemetry.source, telemetryState],
  );

  const fingerprintItems = useMemo(
    () => [
      { label: "Next.js", value: nextVersion },
      { label: "React", value: reactVersion },
      { label: "TypeScript", value: tsVersion },
      { label: "构建时间", value: buildTimestamp },
    ],
    [],
  );

  const telemetryMessage =
    telemetryState === "loading"
      ? "正在同步 GitHub 数据..."
      : telemetryState === "error"
        ? (githubTelemetry.message ?? "GitHub 数据暂不可用。")
        : githubTelemetry.message;

  const overlayTransition = shouldReduceMotion
    ? { duration: 0.12 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  const panelTransition = shouldReduceMotion
    ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
    : ({ type: "spring", stiffness: 290, damping: 30, mass: 0.94 } as const);

  if (!isHydrated || typeof document === "undefined") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          void fetchTelemetry({ force: true });
        }}
        className={cn(
          compact
            ? "theme-floating-trigger-strong motion-chip pointer-events-auto inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[1.15rem] px-3.5 py-3 text-sm font-semibold"
            : "theme-floating-trigger-strong motion-chip pointer-events-auto inline-flex min-w-0 flex-col items-start gap-2 rounded-[1.2rem] px-4 py-3.5 text-left text-sm font-semibold",
          className,
        )}
        aria-label="打开工程实力中枢"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Sparkles size={16} className="motion-icon-float shrink-0" />
          <span className={compact ? "truncate" : "text-balance leading-5"}>
            {compact ? "工程中枢" : "工程实力中枢"}
          </span>
        </span>
        {compact ? null : (
          <span className="theme-floating-meta text-left leading-5">
            实时指标 · GitHub · 构建信息
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={overlayTransition}
                className="theme-dialog-overlay fixed inset-0 z-[90]"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              <motion.aside
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="engineering-command-center-title"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { x: "100%", opacity: 0.94, scale: 0.992 }
                }
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { x: "100%", opacity: 0.96, scale: 0.996 }
                }
                transition={panelTransition}
                className="theme-dialog-shell fixed inset-x-0 bottom-0 top-auto z-[100] flex max-h-[calc(100dvh-0.75rem)] w-full flex-col overflow-hidden rounded-t-[1.45rem] border border-[color:var(--border-default)] md:inset-y-0 md:right-0 md:left-auto md:top-0 md:max-h-none md:max-w-[50rem] md:rounded-none md:rounded-l-[1.45rem] md:border-y-0 md:border-r-0 md:border-l"
              >
              <div className="flex justify-center pb-2 pt-3 md:hidden">
                <div
                  className="h-1 w-10 rounded-full"
                  style={{ backgroundColor: "var(--border-strong)" }}
                />
              </div>

              <header className="theme-panel theme-dialog-header">
                <div className="px-3.5 py-3.5 md:px-6 md:py-5">
                  <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border-muted)] pb-4 md:pb-5">
                    <div className="min-w-0">
                      <p className="theme-kicker text-[11px] font-semibold tracking-[0.16em]">
                        工程面板
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <h2
                          id="engineering-command-center-title"
                          className="theme-title text-balance text-2xl font-bold tracking-tight"
                        >
                          工程实力中枢
                        </h2>
                        <span className="theme-chip whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold">
                          只读面板
                        </span>
                      </div>
                      <p className="theme-copy mt-3 max-w-2xl text-balance text-sm leading-6">
                        集中展示性能、仓库与构建信息。
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void fetchTelemetry({ force: true })}
                        disabled={telemetryState === "loading"}
                        className="motion-chip inline-flex h-10 items-center gap-2 rounded-xl border border-[color:var(--border-default)] bg-[rgba(var(--surface-rgb),0.92)] px-3 text-sm font-medium text-[color:var(--text-secondary)] transition hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:px-3 sm:py-2"
                        aria-label="刷新工程实力中枢数据"
                      >
                        <RefreshCw
                          size={15}
                          className={
                            telemetryState === "loading"
                              ? "animate-spin"
                              : "motion-icon-float"
                          }
                        />
                        刷新
                      </button>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="motion-chip h-10 w-10 rounded-xl border border-[color:var(--border-default)] bg-[rgba(var(--surface-rgb),0.92)] p-0 text-[color:var(--text-tertiary)] transition hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--text-primary)] sm:h-auto sm:w-auto sm:p-2.5"
                        aria-label="关闭工程实力中枢"
                      >
                        <X size={18} className="motion-icon-float" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <article
                          key={item.label}
                          className="theme-card-muted rounded-[1rem] border-[rgba(148,163,184,0.14)] p-3"
                        >
                          <div className="theme-copy-subtle flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em]">
                            <Icon size={13} />
                            {item.label}
                          </div>
                          <p className="theme-title mt-2 text-sm font-semibold leading-6">
                            {item.value}
                          </p>
                          <p className="theme-copy-subtle mt-0.5 text-[11px] leading-5">
                            {item.hint}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </header>

              <div className="theme-dialog-body flex-1 space-y-4 overflow-y-auto px-3.5 py-3.5 md:space-y-5 md:px-6 md:py-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.18fr)_minmax(17rem,0.92fr)]">
                  <section className={panelSectionClassName}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="theme-copy-subtle flex items-center gap-2 text-sm font-semibold tracking-[0.08em]">
                          <Gauge size={16} />
                          页面性能
                        </h3>
                        <p className="theme-copy mt-2 text-sm leading-6">
                          指标来自当前页面生命周期，重点观察加载、交互和视觉稳定性。
                        </p>
                      </div>
                      <span className="theme-chip px-2.5 py-1 text-xs font-medium">
                        自动采集
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {metricCards.map((metric) => (
                        <MetricCard key={metric.name} metric={metric} />
                      ))}
                    </div>

                    <p className="theme-copy-subtle mt-4 text-xs leading-5">
                      INP 需交互后显示；其余指标随会话刷新。
                    </p>
                  </section>

                  <div className="space-y-4">
                    <section className={panelSectionClassName}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="theme-copy-subtle flex items-center gap-2 text-sm font-semibold tracking-[0.08em]">
                            <Github size={16} />
                            开源数据
                          </h3>
                          <p className="theme-copy mt-2 text-sm leading-6">
                            用公开仓库数据呈现项目活跃度与维护情况。
                          </p>
                        </div>
                        <span className="theme-chip px-2.5 py-1 text-xs font-medium">
                          {sourceLabelMap[githubTelemetry.source ?? "fallback"]}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                        <article className="theme-card-muted rounded-[1rem] p-3">
                          <p className="theme-copy-subtle text-[11px] font-medium">粉丝数</p>
                          <p className="theme-title mt-1.5 text-[1.55rem] font-bold tracking-tight">
                            {formatCount(githubTelemetry.followers)}
                          </p>
                        </article>
                        <article className="theme-card-muted rounded-[1rem] p-3">
                          <p className="theme-copy-subtle text-[11px] font-medium">仓库数</p>
                          <p className="theme-title mt-1.5 text-[1.55rem] font-bold tracking-tight">
                            {formatCount(githubTelemetry.public_repos)}
                          </p>
                        </article>
                        <article className="theme-card-muted rounded-[1rem] p-3">
                          <p className="theme-copy-subtle text-[11px] font-medium">总 Star</p>
                          <p className="theme-title mt-1.5 text-[1.55rem] font-bold tracking-tight">
                            {formatCount(githubTelemetry.totalStars)}
                          </p>
                        </article>
                      </div>

                      <div className="theme-card mt-4 rounded-[1rem] p-3.5 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="theme-title text-sm font-semibold">
                            重点仓库
                          </p>
                          <span className="theme-copy-subtle text-xs">
                            Top {githubTelemetry.specificRepos.length || 0}
                          </span>
                        </div>

                        <ul className="mt-3 divide-y divide-[color:var(--border-muted)]">
                          {githubTelemetry.specificRepos.length === 0 ? (
                            <li className="theme-copy py-3 text-sm">
                              暂无可用仓库数据，当前展示的是降级结果。
                            </li>
                          ) : (
                            githubTelemetry.specificRepos.map((repo) => (
                              <li
                                key={repo.name}
                                className="flex items-start justify-between gap-4 py-2.5"
                              >
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex min-w-0 items-start gap-2 font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--brand-gold)]"
                                >
                                  <span className="break-words text-sm leading-6">{repo.name}</span>
                                  <ArrowUpRight size={14} className="mt-1 shrink-0" />
                                </a>
                                <span className="theme-title shrink-0 text-sm font-semibold">
                                  ★ {repo.stars.toLocaleString("en-US")}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>

                        {telemetryMessage ? (
                          <p className="theme-copy-subtle mt-3 text-xs leading-5">
                            {telemetryMessage}
                            {githubTelemetry.isPartial && telemetryState === "ready"
                              ? "（部分数据）"
                              : ""}
                          </p>
                        ) : null}
                      </div>
                    </section>

                    <section className={panelSectionClassName}>
                      <h3 className="theme-copy-subtle flex items-center gap-2 text-sm font-semibold tracking-[0.08em]">
                        <Cpu size={16} />
                        构建信息
                      </h3>
                      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {fingerprintItems.map((item) => (
                          <article
                            key={item.label}
                            className="theme-card-muted rounded-[1rem] p-3"
                          >
                            <p className="theme-copy-subtle text-[11px] font-medium">
                              {item.label}
                            </p>
                            <p className="theme-title mt-1.5 break-words text-sm font-semibold leading-6">
                              {item.value}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="theme-card-muted rounded-[1.1rem] border-[rgba(37,99,235,0.18)] p-4 text-[color:var(--text-primary)]">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-[rgba(239,246,255,0.9)] p-2 text-[color:var(--brand-gold)]">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="theme-title text-sm font-semibold">数据边界</p>
                          <p className="theme-copy mt-2 text-sm leading-6">
                            仅显示匿名性能与公开仓库数据，不记录联系信息。
                          </p>
                          <p className="theme-copy-subtle mt-2 inline-flex items-center gap-2 text-xs font-medium">
                            <Clock3 size={14} />
                            指标按页面会话刷新。
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
