'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkillCategory, VibeCodingData } from '@/types';
import { Badge } from './ui/Badge';
import { Container } from './ui/Container';
import { Section } from './ui/Section';
import {
    Code2, Database, BrainCircuit, Terminal, Layout, Zap, ChevronDown, ChevronUp
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
    "Backend": Code2,
    "后端开发": Code2,
    "Data": Database,
    "数据存储": Database,
    "AI Engineering": BrainCircuit,
    "AI 工程化": BrainCircuit,
    "Engineering": Terminal,
    "工程 & 运维": Terminal,
    "Frontend": Layout,
    "前端 & 全栈": Layout
};

interface TechStackProps {
    skills: SkillCategory[];
    vibeCoding: VibeCodingData;
}

export default function TechStack({ skills, vibeCoding }: TechStackProps) {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Section className="bg-slate-50/50" id="skills">
            <Container>
                {/* Header */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        技术栈与工具箱
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        不设技术边界，以解决问题为核心。熟练运用 AI 辅助开发，实现极速交付。
                    </p>
                </div>

                {/* Vibe Coding / AI Native Badge */}
                <div className="mb-16">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold">{vibeCoding.title}</h3>
                            </div>
                            <p className="text-indigo-100/80 leading-relaxed max-w-4xl text-pretty">
                                {vibeCoding.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {skills.map((category, idx) => {
                        const Icon = categoryIcons[category.category] || Code2;
                        const isExpanded = expandedCategories[category.id];
                        const displayItems = isExpanded ? category.items : category.items.slice(0, 8); // Show all if expanded, else first 8
                        const remainingCount = category.items.length - 8;
                        const hasMore = remainingCount > 0;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {category.category}
                                    </h3>
                                </div>

                                <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                                    {category.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {displayItems.map((item) => (
                                        <Badge
                                            key={item}
                                            variant="secondary"
                                            className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors py-1 px-3 text-sm"
                                        >
                                            {item}
                                        </Badge>
                                    ))}

                                    {hasMore && !isExpanded && (
                                        <button
                                            onClick={() => toggleCategory(category.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            +{remainingCount} 更多
                                            <ChevronDown size={14} />
                                        </button>
                                    )}
                                    {isExpanded && (
                                        <button
                                            onClick={() => toggleCategory(category.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                                        >
                                            收起
                                            <ChevronUp size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
}
