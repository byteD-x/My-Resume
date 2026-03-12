"use client";

import React from "react";
import { TimelineItem as TimelineItemType } from "@/types";
import { ExperienceCard } from "../ExperienceCard";

interface TimelineItemProps {
  item: TimelineItemType;
  isLast: boolean;
  index: number;
  isHighlighted?: boolean;
}

export const TimelineItem = React.memo(function TimelineItem({
  item,
  isLast,
  isHighlighted = false,
}: TimelineItemProps) {
  return (
    <div
      id={`timeline-${item.id}`}
      className={`relative pl-8 md:pl-0 group transition-all duration-300 ${isHighlighted ? "scroll-mt-32" : ""}`}
    >
      {/* Mobile Vertical Line */}
      {!isLast && (
        <div
          className="md:hidden absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        />
      )}

      <div className="md:grid md:grid-cols-[12ch_32px_1fr] md:gap-8">
        {/* 1. Date Column (Desktop) */}
        <div className="hidden md:block text-right pt-6">
          <span className="text-[13px] font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400 sticky top-24">
            {item.year}
          </span>
        </div>

        {/* 2. Axis Column (Desktop) */}
        <div className="hidden md:flex flex-col items-center">
          {/* Dot */}
          <div
            className={`w-3 h-3 rounded-full border-2 z-10 flex-shrink-0 transition-colors duration-300 mt-[28px] bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-600 dark:group-hover:border-zinc-400`}
          />
          {/* Desktop Vertical Line */}
          {!isLast && (
            <div className="w-[1px] h-full bg-zinc-200 dark:bg-zinc-800 absolute top-[28px] left-1/2 -translate-x-1/2 -z-0" />
          )}
        </div>

        {/* 3. Content Card */}
        <div className="relative pb-8 md:pb-2">
          {/* Mobile Dot (Absolute) */}
          <div
            className={`md:hidden absolute left-[-26px] top-8 w-2.5 h-2.5 rounded-full border-2 z-10 bg-white dark:bg-zinc-900 transition-colors border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-500`}
          />

          {/* Mobile Date */}
          <div className="md:hidden mb-3">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              {item.year}
            </span>
          </div>

          <ExperienceCard item={item} hideDate={true} type="timeline" />
        </div>
      </div>
    </div>
  );
});

export default TimelineItem;
