'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItemProps {
    date: string;
    isLast?: boolean;
    children: React.ReactNode;
    // Optional props for interactive states
    isHighlighted?: boolean;
}

export function TimelineItem({
    date,
    isLast = false,
    children,
    isHighlighted = false
}: TimelineItemProps) {
    return (
        <li className="grid grid-cols-1 md:grid-cols-[13ch_24px_1fr] gap-x-6 gap-y-2 relative group">
            {/* 1. Date Column (Desktop) - Hidden on Mobile, shown above text */}
            <div className="hidden md:block text-right pt-[2px]">
                <span className="text-sm font-mono font-medium text-slate-500 tabular-nums leading-tight block sticky top-24">
                    {date}
                </span>
            </div>

            {/* 2. Axis Column (Desktop & Mobile) */}
            <div className="relative flex flex-col items-center">
                {/* Dot - Aligned with the first line of text (approx 8px down from top of card padding if card has 24px padding? 
                   Actually, better to align with text baseline. 
                   If text has line-height 1.5 (24px), center of first line is ~12px.
                   Card padding top is usually 24px. So dot should be at 24 + 12 = 36px?
                   Let's assume the Card content starts at top:0 relative to this row.
                   The styling below assumes 'children' is the card with its own padding.
                   We need the dot to align visually with the Title inside the card.
                   
                   ADJUSTMENT: We will put a margin-top on the dot to match the top-padding of the Card content + font cap-height adjustment.
                   Standard Card padding: 24px. Title Line Height ~28px. Center ~14px.
                   Dot Top ~ 24 + 14 - (DotHeight/2) = 38 - 6 = 32px.
                */}
                <div
                    className={`w-3 h-3 rounded-full border-[2.5px] z-10 flex-shrink-0 transition-colors duration-300 mt-[1.65rem] md:mt-[1.65rem]
                    ${isHighlighted
                            ? 'bg-white border-blue-600 ring-4 ring-blue-50'
                            : 'bg-white border-slate-300 group-hover:border-blue-400'
                        }`}
                />

                {/* Vertical Line */}
                {!isLast && (
                    <div className="w-px h-full bg-slate-200 absolute top-[1.65rem] left-1/2 -translate-x-1/2 -z-0" />
                )}
            </div>

            {/* 3. Content Column */}
            <div className={`relative pb-2 ${isLast ? '' : 'md:pb-2'}`}>
                {/* Mobile Date (visible only on mobile) */}
                <div className="md:hidden mb-2 pl-1">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-xs font-mono font-medium text-slate-600">
                        {date}
                    </span>
                </div>

                {/* Content Card */}
                {children}
            </div>
        </li>
    );
}
