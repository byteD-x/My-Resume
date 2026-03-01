"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Activity, Cpu, Gauge, Github, Sparkles, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useHydrated } from "@/hooks/useHydrated";
import {
  fallbackGithubTelemetry,
  getGithubTelemetry,
  type GitHubTelemetryPayload,
  type TelemetrySource,
} from "@/lib/github-telemetry";
import {
  getRuntimeSnapshot,
  RuntimeMetric,
  subscribeRuntimeSnapshot,
} from "@/lib/runtime-metrics-store";
import staticGithubTelemetry from "@/data/github-telemetry.json";

type TelemetryState = "idle" | "loading" | "ready" | "error";

import { Tooltip } from "@/components/ui/Tooltip";

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
  LCP: "最大内容绘制 (LCP)",
  INP: "交互到下次绘制 (INP)",
  CLS: "累计布局偏移 (CLS)",
  FCP: "首次内容绘制 (FCP)",
  TTFB: "首字节到达时间 (TTFB)",
};

const metricDescriptionMap: Record<RuntimeMetric["name"], string> = {
  LCP: "主要内容加载完成所需时间，反映页面加载速度。",
  INP: "用户交互（点击/按键）后的响应延迟，反映页面流畅度。",
  CLS: "页面布局在加载过程中的稳定性，反映视觉抖动程度。",
  FCP: "浏览器首次渲染内容的时间点，反映首屏感知速度。",
  TTFB: "服务器响应首个字节的时间，反映网络及后端处理速度。",
};

const ratingClassMap = {
  pending: "text-slate-500 bg-slate-100",
  good: "text-emerald-600 bg-emerald-50",
  "needs-improvement": "text-amber-600 bg-amber-50",
  poor: "text-rose-600 bg-rose-50",
} as const;

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

const sourceLabelMap: Record<TelemetrySource, string> = {
  "github-api": "GitHub 接口",
  "github-web": "GitHub 网页降级",
  fallback: "本地降级",
};

const ratingLabelMap = {
  pending: "采集中",
  good: "良好",
  "needs-improvement": "需改进",
  poor: "较差",
} as const;

const deployTargetLabelMap: Record<string, string> = {
  server: "服务端",
  "static-export": "静态导出",
};

// Extract MetricCard to prevent re-renders of the whole list
import React from "react";
const MetricCard = React.memo(({ metric }: { metric: RuntimeMetric }) => {
  const rating = metric.value === null ? "pending" : metric.rating;
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="w-fit">
        <Tooltip content={metricDescriptionMap[metric.name]} position="top">
          <p className="cursor-help border-b border-dashed border-slate-300 text-xs font-medium text-slate-500 transition-colors hover:border-slate-500 hover:text-slate-700">
            {metricLabelMap[metric.name]}
          </p>
        </Tooltip>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900">
          {formatMetricValue(metric)}
          {metric.value !== null && metricUnitMap[metric.name] && (
            <span className="ml-1 text-sm font-medium text-slate-500">
              {metricUnitMap[metric.name]}
            </span>
          )}
        </p>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${ratingClassMap[rating]}`}
        >
          {ratingLabelMap[rating]}
        </span>
      </div>
    </article>
  );
});
MetricCard.displayName = "MetricCard";

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
      // In static export, we use build-time data.
      // We can optionally try to fetch fresh data if force is true, but usually static is static.
      if (options?.force) {
        // Try to fetch, but if it fails (CORS/404), revert to static data usually.
        // For now, just keep using static data to avoid error messages.
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

  return (
    <>
      <button
        type="button"
        disabled={!isHydrated}
        onClick={() => {
          setIsOpen(true);
          void fetchTelemetry({ force: true });
        }}
        className="fixed bottom-24 right-6 z-40 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105 active:scale-95"
        aria-label="Engineering Command Center / 打开工程实力中枢"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles size={16} />
          工程中枢
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm"
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
              className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
            >
              <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      id="engineering-command-center-title"
                      className="text-lg font-bold text-slate-900"
                    >
                      工程实力中枢
                    </h2>
                    <p className="text-sm text-slate-500">
                      实时指标 / 开源数据 / 工程指纹
                    </p>
                  </div>
                  <button
                    ref={closeButtonRef}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="关闭工程实力中枢"
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              <div className="space-y-8 px-6 py-6">
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    <Gauge size={16} />
                    实时性能指标
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {metricCards.map((metric) => (
                      <MetricCard key={metric.name} metric={metric} />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    注：INP 需发生用户交互后才会出现；LCP/FCP/CLS
                    会在页面生命周期内逐步上报。
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    <Github size={16} />
                    开源数据看板
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <article className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">粉丝数</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatCount(githubTelemetry.followers)}
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">仓库数</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatCount(githubTelemetry.public_repos)}
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">总 Star</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatCount(githubTelemetry.totalStars)}
                      </p>
                    </article>
                  </div>
                  <div className="mt-3 rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-500">
                        关注仓库
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        来源：
                        {sourceLabelMap[githubTelemetry.source ?? "fallback"]}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {githubTelemetry.specificRepos.length === 0 && (
                        <li className="text-sm text-slate-500">
                          暂无可用仓库数据（已自动降级），请稍后再试。
                        </li>
                      )}
                      {githubTelemetry.specificRepos.map((repo) => (
                        <li
                          key={repo.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-700 hover:text-blue-600"
                          >
                            {repo.name}
                          </a>
                          <span className="text-slate-900">
                            ★ {repo.stars.toLocaleString("en-US")}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">
                      {telemetryState === "loading" &&
                        "正在从 GitHub 获取实时数据..."}
                      {telemetryState === "error" &&
                        (githubTelemetry.message ?? "数据拉取失败。")}
                      {telemetryState === "ready" && githubTelemetry.message}
                      {githubTelemetry.isPartial &&
                        telemetryState === "ready" &&
                        "（部分数据）"}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    <Cpu size={16} />
                    工程指纹
                  </h3>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-center justify-between">
                        <span>Next.js</span>
                        <span className="font-semibold text-slate-900">
                          {nextVersion}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>React</span>
                        <span className="font-semibold text-slate-900">
                          {reactVersion}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>TypeScript</span>
                        <span className="font-semibold text-slate-900">
                          {tsVersion}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>部署模式</span>
                        <span className="font-semibold text-slate-900">
                          {deployTargetLabelMap[deployTarget] ?? deployTarget}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>构建时间</span>
                        <span className="font-semibold text-slate-900">
                          {buildTimestamp}
                        </span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                  <p className="font-semibold">说明</p>
                  <p className="mt-1">
                    本面板仅展示匿名性能指标与公开开源数据，不采集姓名、邮箱、留言等敏感信息。
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2">
                    <Activity size={14} />
                    指标会在页面生命周期内持续更新。
                  </p>
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
