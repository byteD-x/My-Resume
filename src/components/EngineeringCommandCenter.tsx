"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
  pending: "border-slate-200 bg-slate-100 text-slate-600",
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "needs-improvement": "border-amber-200 bg-amber-50 text-amber-700",
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

const telemetryStateClassMap: Record<TelemetryState, string> = {
  idle: "border-slate-200 bg-slate-100 text-slate-600",
  loading: "border-blue-200 bg-blue-50 text-blue-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-amber-200 bg-amber-50 text-amber-700",
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
  "rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-900/5";

const MetricCard = React.memo(({ metric }: { metric: RuntimeMetric }) => {
  const rating = metric.value === null ? "pending" : metric.rating;

  return (
    <article className="flex min-h-[8.5rem] flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm shadow-slate-900/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Tooltip content={metricDescriptionMap[metric.name]} position="top">
            <p className="w-fit cursor-help border-b border-dashed border-slate-300 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-500 hover:text-slate-700">
              {metricLabelMap[metric.name]}
            </p>
          </Tooltip>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${ratingClassMap[rating]}`}
        >
          {ratingLabelMap[rating]}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <p className="text-3xl font-bold tracking-tight text-slate-950">
          {formatMetricValue(metric)}
          {metric.value !== null && metricUnitMap[metric.name] ? (
            <span className="ml-1 text-sm font-medium text-slate-500">
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

export default function EngineeringCommandCenter() {
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
        label: "运行状态",
        value: telemetryStateLabelMap[telemetryState],
        hint:
          telemetryState === "loading"
            ? "正在同步运行时指标和 GitHub 数据。"
            : "打开面板时会自动刷新一次数据。",
        icon: Activity,
      },
      {
        label: "数据来源",
        value: sourceLabelMap[githubTelemetry.source ?? "fallback"],
        hint: "优先读取 GitHub 实时数据，请求失败时自动降级。",
        icon: Github,
      },
      {
        label: "部署模式",
        value: deployTargetLabelMap[deployTarget] ?? deployTarget,
        hint: buildTimestamp === "未知" ? "等待构建时间注入" : buildTimestamp,
        icon: Cpu,
      },
    ],
    [githubTelemetry.source, telemetryState],
  );

  const fingerprintItems = useMemo(
    () => [
      { label: "Next.js", value: nextVersion },
      { label: "React", value: reactVersion },
      { label: "TypeScript", value: tsVersion },
      { label: "部署模式", value: deployTargetLabelMap[deployTarget] ?? deployTarget },
      { label: "构建时间", value: buildTimestamp },
    ],
    [],
  );

  const telemetryMessage =
    telemetryState === "loading"
      ? "正在从 GitHub 拉取实时数据..."
      : telemetryState === "error"
        ? (githubTelemetry.message ?? "GitHub 数据暂不可用。")
        : githubTelemetry.message;

  return (
    <>
      <button
        type="button"
        disabled={!isHydrated}
        onClick={() => {
          setIsOpen(true);
          void fetchTelemetry({ force: true });
        }}
        className="fixed bottom-24 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Engineering Command Center / 打开工程实力中枢"
      >
        <Sparkles size={16} />
        工程实力中枢
      </button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="engineering-command-center-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 z-[100] h-full w-full max-w-[52rem] overflow-y-auto border-l border-slate-200/80 bg-gradient-to-b from-white via-slate-50/60 to-white shadow-2xl"
            >
              <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
                <div className="px-5 py-5 md:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Engineering Command Center
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <h2
                          id="engineering-command-center-title"
                          className="text-2xl font-bold tracking-tight text-slate-950"
                        >
                          工程实力中枢
                        </h2>
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          匿名诊断面板
                        </span>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        把运行时性能、开源数据和工程指纹收拢到同一个侧边面板里，
                        用来快速判断这个作品集是否具备真实工程交付能力。
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void fetchTelemetry({ force: true })}
                        disabled={telemetryState === "loading"}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="刷新工程实力中枢数据"
                      >
                        <RefreshCw
                          size={15}
                          className={telemetryState === "loading" ? "animate-spin" : ""}
                        />
                        刷新
                      </button>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                        aria-label="关闭工程实力中枢"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <div className="space-y-6 px-5 py-5 md:px-6 md:py-6">
                <section className={panelSectionClassName}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        当前面板状态
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        仅展示匿名性能指标与公开仓库数据，不包含个人敏感信息。
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${telemetryStateClassMap[telemetryState]}`}
                    >
                      {telemetryStateLabelMap[telemetryState]}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {overviewItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <article
                          key={item.label}
                          className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 p-4"
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <Icon size={14} />
                            {item.label}
                          </div>
                          <p className="mt-3 text-lg font-semibold text-slate-950">
                            {item.value}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.hint}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.95fr)]">
                  <section className={panelSectionClassName}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                          <Gauge size={16} />
                          实时性能指标
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          指标来自当前页面生命周期，重点观察加载速度、交互响应和视觉稳定性。
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        自动采集
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {metricCards.map((metric) => (
                        <MetricCard key={metric.name} metric={metric} />
                      ))}
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      INP 需要在发生用户交互后才会出现；LCP、FCP、CLS 会在页面生命周期内持续更新。
                    </p>
                  </section>

                  <div className="space-y-6">
                    <section className={panelSectionClassName}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            <Github size={16} />
                            开源数据看板
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            用公开仓库数据补充说明项目活跃度与工程沉淀。
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          来源: {sourceLabelMap[githubTelemetry.source ?? "fallback"]}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                          <p className="text-xs font-medium text-slate-500">粉丝数</p>
                          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                            {formatCount(githubTelemetry.followers)}
                          </p>
                        </article>
                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                          <p className="text-xs font-medium text-slate-500">仓库数</p>
                          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                            {formatCount(githubTelemetry.public_repos)}
                          </p>
                        </article>
                        <article className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                          <p className="text-xs font-medium text-slate-500">总 Star</p>
                          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                            {formatCount(githubTelemetry.totalStars)}
                          </p>
                        </article>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            重点仓库
                          </p>
                          <span className="text-xs text-slate-500">
                            Top {githubTelemetry.specificRepos.length || 0}
                          </span>
                        </div>

                        <ul className="mt-3 divide-y divide-slate-100">
                          {githubTelemetry.specificRepos.length === 0 ? (
                            <li className="py-3 text-sm text-slate-500">
                              暂无可用仓库数据，当前展示的是降级结果。
                            </li>
                          ) : (
                            githubTelemetry.specificRepos.map((repo) => (
                              <li
                                key={repo.name}
                                className="flex items-center justify-between gap-4 py-3"
                              >
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex min-w-0 items-center gap-2 font-medium text-slate-700 transition hover:text-blue-600"
                                >
                                  <span className="truncate">{repo.name}</span>
                                  <ArrowUpRight size={14} className="shrink-0" />
                                </a>
                                <span className="shrink-0 text-sm font-semibold text-slate-900">
                                  ★ {repo.stars.toLocaleString("en-US")}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>

                        {telemetryMessage ? (
                          <p className="mt-3 text-xs leading-5 text-slate-500">
                            {telemetryMessage}
                            {githubTelemetry.isPartial && telemetryState === "ready"
                              ? "（部分数据）"
                              : ""}
                          </p>
                        ) : null}
                      </div>
                    </section>

                    <section className={panelSectionClassName}>
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        <Cpu size={16} />
                        工程指纹
                      </h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {fingerprintItems.map((item) => (
                          <article
                            key={item.label}
                            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4"
                          >
                            <p className="text-xs font-medium text-slate-500">
                              {item.label}
                            </p>
                            <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                              {item.value}
                            </p>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-blue-200/80 bg-blue-50/85 p-5 text-blue-950 shadow-sm shadow-blue-900/5">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-white/70 p-2 text-blue-700">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">隐私与采集边界</p>
                          <p className="mt-2 text-sm leading-6 text-blue-900/80">
                            本面板只展示匿名性能指标和公开开源数据，不采集姓名、邮箱、留言内容等个人信息。
                          </p>
                          <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-blue-900/75">
                            <Clock3 size={14} />
                            指标会在页面停留期间持续更新。
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
      </AnimatePresence>
    </>
  );
}
