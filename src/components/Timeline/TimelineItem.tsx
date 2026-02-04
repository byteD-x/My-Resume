'use client';

import React from 'react';
import { TimelineItem as TimelineItemType } from '@/types';
import { ExperienceCard } from '../ExperienceCard';

interface TimelineItemProps {
    item: TimelineItemType;
    isLast: boolean;
    index: number;
    isHighlighted?: boolean;
}

export function TimelineItem({
    item,
    isLast,
    isHighlighted = false
}: TimelineItemProps) {
    return (
        <div
            id={`timeline-${item.id}`}
            className={`relative pl-8 md:pl-0 group transition-all duration-300 ${isHighlighted ? 'scroll-mt-32' : ''}`}
        >
            {/* Mobile Vertical Line */}
            {!isLast && (
                <div
                    className="md:hidden absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200 dark:bg-zinc-800"
                    aria-hidden="true"
                />
            )}

            <div className="md:grid md:grid-cols-[11ch_24px_1fr] md:gap-6">
                {/* 1. Date Column (Desktop) */}
                <div className="hidden md:block text-right pt-8">
                    <span className="text-sm font-mono font-medium text-slate-400 dark:text-zinc-500 tabular-nums sticky top-24">
                        {item.year}
                    </span>
                </div>

                {/* 2. Axis Column (Desktop) */}
                <div className="hidden md:flex flex-col items-center">
                    {/* Dot */}
                    <div
                        className={`w-3 h-3 rounded-full border-[2.5px] z-10 flex-shrink-0 transition-all duration-300 mt-[36px] bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 group-hover:border-blue-400`}
                    />
                    {/* Desktop Vertical Line */}
                    {!isLast && (
                        <div className="w-px h-full bg-slate-200 dark:bg-zinc-800 absolute top-[36px] left-1/2 -translate-x-1/2 -z-0" />
                    )}
                </div>

                {/* 3. Content Card */}
                <div className="relative pb-8 md:pb-2">
                    {/* Mobile Dot (Absolute) */}
                    <div
                        className={`md:hidden absolute left-[-26px] top-8 w-3 h-3 rounded-full border-[2.5px] z-10 bg-white dark:bg-zinc-900 transition-colors border-slate-300 dark:border-zinc-700`}
                    />

                    {/* Mobile Date */}
                    <div className="md:hidden mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-xs font-mono font-medium text-slate-600 dark:text-zinc-400">
                            {item.year}
                        </span>
                    </div>

                    <ExperienceCard item={item} hideDate={true} type="timeline" />
                </div>
            </div>
        </div>
    );
}

export default TimelineItem;
