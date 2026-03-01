"use client";

export type RuntimeMetricName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
export type RuntimeMetricRating =
  | "pending"
  | "good"
  | "needs-improvement"
  | "poor";

export interface RuntimeMetric {
  name: RuntimeMetricName;
  value: number | null;
  rating: RuntimeMetricRating;
  updatedAt: number | null;
}

export interface RuntimeSnapshot {
  metrics: Record<RuntimeMetricName, RuntimeMetric>;
}

interface RuntimeMetricUpdate {
  name: RuntimeMetricName;
  value: number;
  rating: RuntimeMetricRating;
}

const metricNames: RuntimeMetricName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];

const createDefaultMetric = (name: RuntimeMetricName): RuntimeMetric => ({
  name,
  value: null,
  rating: "pending",
  updatedAt: null,
});

const createInitialSnapshot = (): RuntimeSnapshot => ({
  metrics: metricNames.reduce(
    (acc, name) => {
      acc[name] = createDefaultMetric(name);
      return acc;
    },
    {} as Record<RuntimeMetricName, RuntimeMetric>,
  ),
});

let snapshot: RuntimeSnapshot = createInitialSnapshot();
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export function getRuntimeSnapshot(): RuntimeSnapshot {
  return snapshot;
}

export function subscribeRuntimeSnapshot(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function upsertRuntimeMetric(update: RuntimeMetricUpdate) {
  const current = snapshot.metrics[update.name];
  snapshot = {
    metrics: {
      ...snapshot.metrics,
      [update.name]: {
        ...current,
        value: update.value,
        rating: update.rating,
        updatedAt: Date.now(),
      },
    },
  };
  notify();
}
