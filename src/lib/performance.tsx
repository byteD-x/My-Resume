"use client";

import { useEffect } from "react";
import type { Metric as WebVitalsMetric } from "web-vitals";
import { upsertRuntimeMetric } from "@/lib/runtime-metrics-store";

interface MetricPayload {
  name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    performance: Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };
  }
}

const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

const getRating = (
  name: keyof typeof VITALS_THRESHOLDS,
  value: number,
): "good" | "needs-improvement" | "poor" => {
  const threshold = VITALS_THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};

const sendToGA = (metric: MetricPayload) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "web-vitals",
      event_category: "Web Vitals",
      event_label: metric.name,
      event_value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      ),
      custom_map: {
        metric_id: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
      },
    });
  }

  if (process.env.NODE_ENV === "development") {
    const marker =
      metric.rating === "good"
        ? "OK"
        : metric.rating === "needs-improvement"
          ? "WARN"
          : "POOR";
    const normalized =
      metric.name === "CLS"
        ? metric.value.toFixed(3)
        : `${metric.value.toFixed(2)}ms`;
    console.log(`[web-vitals] ${metric.name}=${normalized} (${marker})`);
  }
};

const handleMetric = (name: MetricPayload["name"], metric: WebVitalsMetric) => {
  const rating = getRating(name, metric.value);
  const payload: MetricPayload = { name, value: metric.value, rating };
  sendToGA(payload);
  upsertRuntimeMetric(payload);
};

export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      try {
        onCLS((metric) => handleMetric("CLS", metric));
        onINP((metric) => handleMetric("INP", metric));
        onFCP((metric) => handleMetric("FCP", metric));
        onLCP((metric) => handleMetric("LCP", metric));
        onTTFB((metric) => handleMetric("TTFB", metric));
      } catch (error) {
        console.error("Error tracking web vitals:", error);
      }
    });

    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const checkPerformanceBudget = () => {
      if (!window.performance || !window.performance.memory) return;

      const memory = window.performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memory.jsHeapSizeLimit / 1048576);
      const usagePercent =
        (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      if (usagePercent > 80) {
        console.warn(
          `[perf-budget] High memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent.toFixed(1)}%)`,
        );
      }
    };

    const intervalId = window.setInterval(checkPerformanceBudget, 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  return null;
}

export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development")
      return;

    const startTime = performance.now();
    const markName = `${componentName}-mount`;
    performance.mark(markName);

    return () => {
      const endTime = performance.now();
      performance.measure(`${componentName}-lifetime`, markName);
      const measure = performance.getEntriesByName(
        `${componentName}-lifetime`,
      )[0];
      if (measure) {
        console.log(
          `[component-perf] ${componentName}: ${(endTime - startTime).toFixed(2)}ms`,
        );
      }

      performance.clearMarks(markName);
      performance.clearMeasures(`${componentName}-lifetime`);
    };
  }, [componentName]);
}

export function useLongTaskMonitor() {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(
              `[perf-budget] Long task detected: ${entry.duration.toFixed(2)}ms`,
              entry,
            );
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
      return () => observer.disconnect();
    } catch (error) {
      console.warn("Long task monitoring not supported:", error);
    }
  }, []);
}
