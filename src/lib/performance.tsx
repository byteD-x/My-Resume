'use client';

import { useEffect } from 'react';
import type { Metric as WebVitalsMetric } from 'web-vitals';

/**
 * Web Vitals 性能监控组件
 * 跟踪 Core Web Vitals 指标：
 * - LCP (Largest Contentful Paint) - 最大内容绘制
 * - FID (First Input Delay) - 首次输入延迟
 * - CLS (Cumulative Layout Shift) - 累积布局偏移
 * - FCP (First Contentful Paint) - 首次内容绘制
 * - TTFB (Time to First Byte) - 首字节时间
 */

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
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

// Core Web Vitals 阈值
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

// 评估指标评级
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
  if (!threshold) return 'needs-improvement';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// 发送指标到 Google Analytics
const sendToGA = (metric: Metric) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'web-vitals',
      event_category: 'Web Vitals',
      event_label: metric.name,
      event_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        metric_id: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
      },
    });
  }

  // 同时发送到控制台（开发环境）
  if (process.env.NODE_ENV === 'development') {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `%c${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`,
      `color: ${metric.rating === 'good' ? '#22c55e' : metric.rating === 'needs-improvement' ? '#eab308' : '#ef4444'}`
    );
  }
};

// 使用 web-vitals 库进行性能监控
export function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 动态导入 web-vitals 库以减少初始包大小
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      try {
        // Cumulative Layout Shift - 布局稳定性
        onCLS((metric: WebVitalsMetric) => {
          sendToGA({
            name: metric.name,
            value: metric.value,
            rating: getRating('CLS', metric.value),
          });
        });

        // Interaction to Next Paint - 交互响应性 (替换 FID)
        onINP((metric: WebVitalsMetric) => {
          sendToGA({
            name: metric.name,
            value: metric.value,
            rating: getRating('FID', metric.value), // 仍然使用 FID 的阈值
          });
        });

        // First Contentful Paint - 内容加载速度
        onFCP((metric: WebVitalsMetric) => {
          sendToGA({
            name: metric.name,
            value: metric.value,
            rating: getRating('FCP', metric.value),
          });
        });

        // Largest Contentful Paint - 主要内容加载
        onLCP((metric: WebVitalsMetric) => {
          sendToGA({
            name: metric.name,
            value: metric.value,
            rating: getRating('LCP', metric.value),
          });
        });

        // Time to First Byte - 服务器响应时间
        onTTFB((metric: WebVitalsMetric) => {
          sendToGA({
            name: metric.name,
            value: metric.value,
            rating: getRating('TTFB', metric.value),
          });
        });
      } catch (error) {
        console.error('Error tracking web vitals:', error);
      }
    });

    // 性能预算监控
    const checkPerformanceBudget = () => {
      if (!window.performance || !window.performance.memory) return;

      const memory = window.performance.memory;
      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usagePercent > 80) {
          console.warn(
            `⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent.toFixed(1)}%)`
          );
        }
      }
    };

    // 定期检查内存使用情况
    const intervalId = setInterval(checkPerformanceBudget, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return null;
}

/**
 * 性能监控 Hook
 * 用于在组件内部监控特定性能指标
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    const startTime = performance.now();
    const markName = `${componentName}-mount`;

    performance.mark(markName);

    return () => {
      const endTime = performance.now();
      performance.measure(`${componentName}-lifetime`, markName);

      const measure = performance.getEntriesByName(`${componentName}-lifetime`)[0];
      if (measure) {
        console.log(
          `%c⏱️ ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`,
          'color: #3b82f6'
        );
      }

      performance.clearMarks(markName);
      performance.clearMeasures(`${componentName}-lifetime`);
    };
  }, [componentName]);
}

/**
 * 长任务监控
 * 检测执行时间超过 50ms 的任务
 */
export function useLongTaskMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(
              `⚠️ Long task detected: ${(entry.duration).toFixed(2)}ms`,
              entry
            );
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }, []);
}
