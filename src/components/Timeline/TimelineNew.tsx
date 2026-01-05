'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineItem as TimelineItemType } from '@/types';
import { TimelineItem } from './TimelineItem';
import { cn } from '@/lib/utils';

interface TimelineProps {
    items: TimelineItemType[];
    isEditorActive?: boolean;
}

export function Timeline({ items }: TimelineProps) {
    const [activeTag, setActiveTag] = useState<string>('All');

    // Extract unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>(['All']);
        items.forEach(item => {
            item.techTags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [items]);

    // Filter items
    const filteredItems = useMemo(() => {
        if (activeTag === 'All') return items;
        return items.filter(item => item.techTags.includes(activeTag));
    }, [items, activeTag]);

    return (
        <div className="space-y-8">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border",
                            activeTag === tag
                                ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-500"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="relative space-y-12 min-h-[500px]">
                {/* Vertical Line */}
                <div
                    className="absolute left-[13px] top-2 bottom-0 w-[2px] bg-slate-200 dark:bg-zinc-800 hidden md:block"
                    aria-hidden="true"
                />

                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TimelineItem
                                item={item}
                                index={index}
                                isHighlighted={item.highlighted}
                                isLast={index === filteredItems.length - 1} // Update logical last
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-slate-400"
                    >
                        无相关经历
                    </motion.div>
                )}
            </div>
        </div>
    );
}
