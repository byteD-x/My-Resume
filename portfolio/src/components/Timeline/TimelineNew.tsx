'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineItem as TimelineItemType } from '@/types';
import { TimelineItem } from './TimelineItem';
import { Badge } from '../ui/Badge';
import EditableText from '../EditableText';

interface TimelineProps {
    items: TimelineItemType[];
    isEditorActive?: boolean;
}

export function Timeline({ items, isEditorActive = false }: TimelineProps) {
    return (
        <div className="relative space-y-12">
            {/* Vertical Line */}
            <div
                className="absolute left-[13px] top-2 bottom-0 w-[2px] bg-slate-200 dark:bg-zinc-800 hidden md:block"
            />

            {items.map((item, index) => (
                <TimelineItem
                    key={item.id}
                    item={item}
                    index={index}
                    isHighlighted={item.highlighted}
                    isLast={index === items.length - 1}
                />
            ))}
        </div>
    );
}
