'use client';

import React, { useMemo, useState } from 'react';
import { m as motion } from 'framer-motion';
import { TimelineItem as TimelineItemType } from '@/types';
import { TimelineItem } from './TimelineItem';
import { cn } from '@/lib/utils';
import { useHydrated } from '@/hooks/useHydrated';

interface TimelineProps {
    items: TimelineItemType[];
}

const TAG_ALL = '全部';
const POPULAR_TAG_LIMIT = 10;
const RECENT_TAG_LIMIT = 5;
const RECENT_TAG_STORAGE_KEY = 'portfolio.timeline.recent_tags';

function readRecentTagsFromStorage(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(RECENT_TAG_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return Array.from(
            new Set(parsed.filter((tag): tag is string => typeof tag === 'string')),
        ).slice(0, RECENT_TAG_LIMIT);
    } catch {
        return [];
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function Timeline({ items }: TimelineProps) {
    const isHydrated = useHydrated();
    const [activeTag, setActiveTag] = useState<string>(TAG_ALL);
    const [tagKeyword, setTagKeyword] = useState('');
    const [isTagExpanded, setIsTagExpanded] = useState(false);
    const [recentTags, setRecentTags] = useState<string[]>(() => readRecentTagsFromStorage());
    const effectiveRecentTags = useMemo(() => (isHydrated ? recentTags : []), [isHydrated, recentTags]);

    const tagStats = useMemo(() => {
        const tagCount = new Map<string, number>();
        items.forEach((item) => {
            item.techTags.forEach((tag) => {
                tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
            });
        });

        return Array.from(tagCount.entries()).sort(
            (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
        );
    }, [items]);

    const matchedTags = useMemo(() => {
        const keyword = tagKeyword.trim().toLowerCase();
        if (!keyword) return tagStats;
        return tagStats.filter(([tag]) => tag.toLowerCase().includes(keyword));
    }, [tagStats, tagKeyword]);

    const orderedTagNames = useMemo(() => {
        const matchedTagNames = matchedTags.map(([tag]) => tag);
        if (tagKeyword.trim().length > 0) return matchedTagNames;

        const recentMatched = effectiveRecentTags.filter((tag) => matchedTagNames.includes(tag));
        const remaining = matchedTagNames.filter((tag) => !recentMatched.includes(tag));
        return [...recentMatched, ...remaining];
    }, [matchedTags, effectiveRecentTags, tagKeyword]);

    const visibleTags = useMemo(() => {
        const coreTags =
            isTagExpanded || tagKeyword.trim().length > 0
                ? orderedTagNames
                : orderedTagNames.slice(0, POPULAR_TAG_LIMIT);

        const tags = [TAG_ALL, ...coreTags];
        if (activeTag !== TAG_ALL && !tags.includes(activeTag)) {
            tags.push(activeTag);
        }
        return tags;
    }, [activeTag, isTagExpanded, orderedTagNames, tagKeyword]);

    const recentDisplayTags = useMemo(() => {
        if (tagKeyword.trim().length > 0) return [];
        return orderedTagNames
            .filter((tag) => effectiveRecentTags.includes(tag))
            .slice(0, RECENT_TAG_LIMIT);
    }, [orderedTagNames, effectiveRecentTags, tagKeyword]);

    const filteredItems = useMemo(() => {
        if (activeTag === TAG_ALL) return items;
        return items.filter((item) => item.techTags.includes(activeTag));
    }, [activeTag, items]);

    const canExpand = tagKeyword.trim().length === 0 && orderedTagNames.length > POPULAR_TAG_LIMIT;
    const hiddenTagCount = Math.max(orderedTagNames.length - POPULAR_TAG_LIMIT, 0);

    const handleTagSelect = (tag: string) => {
        setActiveTag(tag);
        if (tag === TAG_ALL) return;

        setRecentTags((prev) => {
            const next = [tag, ...prev.filter((item) => item !== tag)].slice(0, RECENT_TAG_LIMIT);
            if (typeof window !== 'undefined') {
                try {
                    window.localStorage.setItem(RECENT_TAG_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Ignore localStorage write failures.
                }
            }
            return next;
        });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        {tagStats.length > 0 ? `共 ${tagStats.length} 个技术标签` : '暂无技术标签'}
                    </p>

                    <label className="relative block w-full sm:w-64">
                        <span className="sr-only">搜索技术标签</span>
                        <input
                            type="search"
                            value={tagKeyword}
                            onChange={(event) => setTagKeyword(event.target.value)}
                            placeholder="搜索技术标签..."
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                {recentDisplayTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400">最近使用</span>
                        {recentDisplayTags.map((tag) => (
                            <button
                                key={`recent-${tag}`}
                                type="button"
                                onClick={() => handleTagSelect(tag)}
                                className={cn(
                                    'cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors',
                                    activeTag === tag
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600',
                                )}
                                aria-pressed={activeTag === tag}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {visibleTags.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagSelect(tag)}
                            className={cn(
                                'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300',
                                activeTag === tag
                                    ? 'scale-105 border-blue-600 bg-blue-600 text-white shadow-md'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-500',
                            )}
                            aria-pressed={activeTag === tag}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {canExpand && (
                    <button
                        type="button"
                        onClick={() => setIsTagExpanded((value) => !value)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-500"
                        aria-expanded={isTagExpanded}
                    >
                        {isTagExpanded ? '收起标签' : `展开更多标签（+${hiddenTagCount}）`}
                    </button>
                )}
            </div>

            <div className="relative min-h-[500px] space-y-12">
                <div
                    className="absolute left-[13px] top-2 bottom-0 hidden w-[2px] bg-slate-200 dark:bg-zinc-800 md:block"
                    aria-hidden="true"
                />

                <div className="space-y-12">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.08,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <TimelineItem
                                item={item}
                                index={index}
                                isHighlighted={item.highlighted}
                                isLast={index === filteredItems.length - 1}
                            />
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center text-slate-400"
                    >
                        未找到匹配的经历
                    </motion.div>
                )}
            </div>
        </div>
    );
}
