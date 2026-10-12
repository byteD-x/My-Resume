"use client";

import type { ImpactItem, TimelineItem } from "@/types";
import { useState } from "react";
import MetricDrawer from "@/components/MetricDrawer";

export function RebootMetricGrid({ items, linkedItems, locale }: { items: ImpactItem[]; linkedItems: TimelineItem[]; locale: "zh" | "en" }) {
  const [active, setActive] = useState<ImpactItem | null>(null);
  const linkedById = new Map(linkedItems.map((item) => [item.id, item]));

  return (
    <>
      <div className="reboot-metric-grid">
        {items.slice(0, 6).map((item) => {
          return (
            <button type="button" className="reboot-metric-card reboot-reveal" data-reboot-reveal key={item.id} onClick={() => setActive(item)} aria-label={`${item.title}: ${item.value}`}>
              <span>{item.title}</span><strong>{item.value}</strong><small>{item.label}</small><i>{locale === "zh" ? "查看详情" : "Inspect detail"}</i>
            </button>
          );
        })}
      </div>
      <MetricDrawer isOpen={Boolean(active)} onClose={() => setActive(null)} metric={active} linkedExperience={active?.linkedExperienceId ? linkedById.get(active.linkedExperienceId) : undefined} />
    </>
  );
}
