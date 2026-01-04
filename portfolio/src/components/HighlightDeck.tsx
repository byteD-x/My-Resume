'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap, Gauge, Code2, LucideIcon } from 'lucide-react';
import { ImpactItem } from '@/types';

// Icon 映射
const iconMap: Record<string, LucideIcon> = {
    Star,
    Users,
    Zap,
    Gauge,
    Code2,
};

interface HighlightDeckProps {
    items: ImpactItem[];
    onItemClick?: (linkedExperienceId: string) => void;
    isEditorActive?: boolean;
}

export default function HighlightDeck({
    items,
    onItemClick,
    isEditorActive = false
}: HighlightDeckProps) {
    const handleClick = (item: ImpactItem) => {
        if (item.linkedExperienceId && onItemClick) {
            onItemClick(item.linkedExperienceId);
        }
    };

    return (
        <section className="py-20 bg-zinc-50 border-y border-zinc-200" id="impact">
            <div className="container-padding">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">量化成果</h2>
                    <p className="text-zinc-500 mt-2">用数据证明工程价值</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                    {items.map((item, i) => {
                        const Icon = iconMap[item.icon] || Code2;
                        const isClickable = !!item.linkedExperienceId;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => handleClick(item)}
                                className={`
                  relative p-6 rounded-3xl border border-zinc-200
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                  ${item.colSpan || ''}
                  ${item.rowSpan || ''}
                  ${item.isFocal ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}
                  ${isClickable ? 'cursor-pointer' : ''}
                `}
                            >
                                {/* 背景装饰（Focal 卡片） */}
                                {item.isFocal && (
                                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                        <Icon size={120} />
                                    </div>
                                )}

                                <div className="flex flex-col h-full justify-between relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-2 rounded-xl ${item.isFocal ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-900'
                                            }`}>
                                            <Icon size={24} />
                                        </div>
                                        {isClickable && (
                                            <span className="text-xs text-zinc-400">
                                                点击查看详情 →
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <div className={`text-4xl font-bold tracking-tight mb-1 ${item.isFocal ? 'text-white' : 'text-zinc-900'
                                            }`}>
                                            {item.value}
                                        </div>
                                        <div className={`font-medium ${item.isFocal ? 'text-zinc-400' : 'text-zinc-500'
                                            }`}>
                                            {item.label}
                                        </div>
                                        {item.description && (
                                            <div className={`text-xs mt-2 ${item.isFocal ? 'text-zinc-500' : 'text-zinc-400'
                                                }`}>
                                                {item.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
