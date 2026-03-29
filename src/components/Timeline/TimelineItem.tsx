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
      className={`experience-timeline-row group relative pl-7 transition-all duration-300 md:pl-0 ${isHighlighted ? "scroll-mt-32" : ""}`}
    >
      {/* Mobile Vertical Line */}
      {!isLast && (
        <div
          className="absolute bottom-[-18px] left-[10px] top-5 w-[1px] bg-[rgba(37,99,235,0.14)] md:hidden"
          aria-hidden="true"
        />
      )}

      <div className="md:grid md:grid-cols-[11.5ch_30px_1fr] md:gap-7 lg:grid-cols-[12.25ch_34px_1fr] lg:gap-8">
        {/* 1. Date Column (Desktop) */}
        <div className="hidden md:block pt-3.5 text-right lg:pt-4">
          <span className="experience-timeline-date theme-copy-subtle sticky top-24 text-[13px] font-medium uppercase tracking-widest">
            {item.year}
          </span>
        </div>

        {/* 2. Axis Column (Desktop) */}
        <div className="hidden md:flex flex-col items-center">
          {/* Dot */}
          <div
            className={`mt-5 z-10 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 bg-[rgba(255,255,255,0.95)] transition-colors duration-300 border-[rgba(37,99,235,0.22)] group-hover:border-[rgba(37,99,235,0.45)] lg:mt-[1.35rem]`}
          />
          {/* Desktop Vertical Line */}
          {!isLast && (
            <div className="absolute left-1/2 top-5 -z-0 h-full w-[1px] -translate-x-1/2 bg-[rgba(37,99,235,0.14)]" />
          )}
        </div>

        {/* 3. Content Card */}
        <div className="relative pb-5 md:pb-1.5">
          {/* Mobile Dot (Absolute) */}
          <div
            className={`absolute left-[-22px] top-7 z-10 h-2.5 w-2.5 rounded-full border-2 bg-[rgba(255,255,255,0.95)] transition-colors border-[rgba(37,99,235,0.22)] group-hover:border-[rgba(37,99,235,0.45)] md:hidden`}
          />

          {/* Mobile Date */}
          <div className="mb-2.5 md:hidden">
            <span className="experience-timeline-date theme-copy-subtle inline-block text-[11px] font-semibold uppercase tracking-[0.12em]">
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
