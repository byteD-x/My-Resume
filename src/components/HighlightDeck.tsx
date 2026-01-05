'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap, Gauge, Code2, LucideIcon, TrendingUp, ArrowRight } from 'lucide-react';
import { ImpactItem, TimelineItem } from '@/types';
import MetricDrawer from './MetricDrawer';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Star,
    Users,
    Zap,
    Gauge,
    Code2,
    TrendingUp,
};

interface HighlightDeckProps {
    items: ImpactItem[];
    timeline?: TimelineItem[];
    onItemClick?: (linkedExperienceId: string) => void;
}

// Animation config
const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function HighlightDeck({
    items,
    timeline = [],
    onItemClick
}: HighlightDeckProps) {
    const [selectedMetric, setSelectedMetric] = useState<ImpactItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Find linked experience for selected metric
    const linkedExperience = useMemo(() => {
        if (!selectedMetric?.linkedExperienceId) return null;
        return timeline.find(t => t.id === selectedMetric.linkedExperienceId) || null;
    }, [selectedMetric, timeline]);

    const handleCardClick = (item: ImpactItem) => {
        setSelectedMetric(item);
        setIsDrawerOpen(true);

        // Also trigger external handler if provided
        if (item.linkedExperienceId && onItemClick) {
            onItemClick(item.linkedExperienceId);
        }
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        // Delay clearing metric to allow exit animation
        setTimeout(() => setSelectedMetric(null), 200);
    };

    // Dynamic GitHub Stats
    const [displayItems, setDisplayItems] = useState(items);

    // Sync props to state if props change (editor mode)
    React.useEffect(() => {
        setDisplayItems(items);
    }, [items]);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/github');
                if (!res.ok) return;
                const data = await res.json();

                if (data.totalStars !== undefined) {
                    setDisplayItems(prev => prev.map(item => {
                        if (item.id === 'impact-1') {
                            return {
                                ...item,
                                value: `${data.totalStars}+`
                            };
                        }
                        return item;
                    }));
                }
            } catch {
                // Ignore errors, keep static data
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            <section
                className="section relative z-10"
                id="impact"
            // Remove solid background to fix "ugly box" issue - let page background show through
            >
                <div className="container">
                    {/* Section Header */}
                    <div className="section-header mb-16">
                        <h2 className="section-title mb-6">量化成果</h2>
                        <p className="section-subtitle text-lg">用数据证明工程价值，点击卡片查看详情</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        {displayItems.map((item, i) => {
                            const Icon = iconMap[item.icon] || TrendingUp;
                            const isFocal = item.isFocal;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={cardVariants.initial}
                                    whileInView={cardVariants.animate}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.08,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    onClick={() => handleCardClick(item)}
                                    // Base styles
                                    className={`
                                        group relative cursor-pointer p-6 rounded-2xl flex flex-col h-full overflow-hidden
                                        transition-all duration-300
                                        ${isFocal
                                            ? 'bg-zinc-900/95 backdrop-blur-xl border-zinc-800/80 text-white shadow-2xl shadow-blue-900/10'
                                            : 'bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/80 dark:hover:bg-zinc-900/80 border'}
                                        ${isFocal ? 'sm:col-span-2 lg:col-span-1' : ''}
                                    `}
                                    whileHover={{
                                        y: -6,
                                        transition: { type: 'spring', stiffness: 400, damping: 30 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Hover Gradients */}
                                    {!isFocal && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 rounded-2xl transition-colors duration-500 pointer-events-none" />
                                        </>
                                    )}
                                    {isFocal && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                                    )}

                                    {/* Header: Icon + Value */}
                                    <div className="mb-4 relative z-10">
                                        <motion.div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                                                ${isFocal ? 'bg-white/10 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'}
                                            `}
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                        >
                                            <Icon size={24} />
                                        </motion.div>

                                        {/* Metric Value - Tabular Nums */}
                                        <div
                                            className={`text-4xl md:text-5xl font-bold tracking-tight tabular-nums font-heading
                                                ${isFocal ? 'text-white' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'}
                                            `}
                                        >
                                            {item.value}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col relative z-10">
                                        {/* Label */}
                                        <div
                                            className={`text-sm font-semibold mb-2
                                                ${isFocal ? 'text-zinc-200' : 'text-zinc-900 dark:text-zinc-100'}
                                            `}
                                        >
                                            {item.label}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p
                                                className={`text-sm leading-relaxed mb-6
                                                    ${isFocal ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors'}
                                                `}
                                            >
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Footer: View Details */}
                                        <div
                                            className={`mt-auto flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0
                                                ${isFocal ? 'text-white' : 'text-blue-600 dark:text-blue-400'}
                                            `}
                                        >
                                            查看详情
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Metric Drawer */}
            <MetricDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                metric={selectedMetric}
                linkedExperience={linkedExperience}
            />
        </>
    );
}
