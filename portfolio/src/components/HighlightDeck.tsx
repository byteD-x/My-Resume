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

    return (
        <>
            <section
                className="section"
                id="impact"
                style={{ backgroundColor: 'var(--bg-surface)' }}
            >
                <div className="container">
                    {/* Section Header */}
                    <div className="section-header">
                        <h2 className="section-title">量化成果</h2>
                        <p className="section-subtitle">用数据证明工程价值，点击卡片查看详情</p>
                    </div>

                    {/* Metrics Grid - Desktop gap-6 (24px) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        {items.map((item, i) => {
                            const Icon = iconMap[item.icon] || TrendingUp;
                            const isFocal = item.isFocal;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={cardVariants.initial}
                                    whileInView={cardVariants.animate}
                                    transition={{
                                        duration: 0.3,
                                        delay: i * 0.05,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    onClick={() => handleCardClick(item)}
                                    className={`
                                        group cursor-pointer p-6 rounded-2xl transition-all flex flex-col h-full
                                        ${isFocal ? 'sm:col-span-2 lg:col-span-1' : ''}
                                    `}
                                    style={{
                                        backgroundColor: isFocal ? 'var(--text-primary)' : 'var(--bg-page)',
                                        border: isFocal ? 'none' : '1px solid var(--border-default)',
                                    }}
                                    whileHover={{
                                        y: -4,
                                        boxShadow: 'var(--shadow-lg)',
                                    }}
                                >
                                    {/* Header: Icon + Value */}
                                    <div className="mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                            style={isFocal ? {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            } : {
                                                backgroundColor: 'var(--color-primary-light)',
                                                color: 'var(--color-primary)'
                                            }}
                                        >
                                            <Icon size={24} />
                                        </div>

                                        {/* Metric Value - Tabular Nums */}
                                        <div
                                            className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums"
                                            style={{
                                                color: isFocal ? 'white' : 'var(--color-primary)',
                                                fontFamily: 'var(--font-heading)',
                                            }}
                                        >
                                            {item.value}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        {/* Label */}
                                        <div
                                            className="text-sm font-semibold mb-2"
                                            style={{ color: isFocal ? 'rgba(255,255,255,0.9)' : 'var(--text-primary)' }}
                                        >
                                            {item.label}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p
                                                className="text-sm leading-relaxed mb-6"
                                                style={{ color: isFocal ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}
                                            >
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Footer: View Details (Always at bottom) */}
                                        <div
                                            className="mt-auto flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ color: isFocal ? 'rgba(255,255,255,0.9)' : 'var(--color-primary)' }}
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
