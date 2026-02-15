'use client';

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { SkillCategory, VibeCodingData } from '@/types';
import { TechTag } from './ui/TechTag';
import { Container } from './ui/Container';
import { Section } from './ui/Section';
import { InfiniteScroll } from './ui/InfiniteScroll';
import {
    Code2, Database, BrainCircuit, Terminal, Layout, Zap, ChevronDown, ChevronUp
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
    "Backend": Code2,
    "后端开发": Code2,
    "后端架构": Code2,
    "Data": Database,
    "数据存储": Database,
    "数据与中间件": Database,
    "AI Engineering": BrainCircuit,
    "AI 工程化": BrainCircuit,
    "Engineering": Terminal,
    "工程 & 运维": Terminal,
    "DevOps 与云原生": Terminal,
    "Frontend": Layout,
    "前端 & 全栈": Layout,
    "前端与全栈": Layout,
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

    // Flatten all skills for the Infinite Wall
    const allSkills = skills.reduce<string[]>((acc, category) => {
        return [...acc, ...category.items];
    }, []);

    // Split into two rows for visual interest
    const firstRow = allSkills.slice(0, Math.ceil(allSkills.length / 2));
    const secondRow = allSkills.slice(Math.ceil(allSkills.length / 2));

    return (
        <Section className="bg-slate-50/50" id="skills">
            <Container>
                {/* Header */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        技术栈与工具箱
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        不设技术边界，以解决问题为核心；用 AI 提效，但用工程门禁保证质量。
                    </p>
                </div>

                {/* Infinite Logo Wall */}
                <div className="mb-20 -mx-4 md:-mx-0 overflow-hidden space-y-4">
                    <InfiniteScroll
                        items={firstRow.map(skill => (
                            <span key={skill} className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                                {skill}
                            </span>
                        ))}
                        direction="right"
                        speed="slow"
                    />
                    <InfiniteScroll
                        items={secondRow.map(skill => (
                            <span key={skill} className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                                {skill}
                            </span>
                        ))}
                        direction="left"
                        speed="slow"
                    />
                </div>

                {/* Vibe Coding / AI Native Badge */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="bg-gradient-to-br from-slate-900 to-sky-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/30 transition-colors duration-500" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <motion.div
                                    className="p-2 rounded-lg bg-sky-500/20 text-sky-200"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                >
                                    <Zap size={24} />
                                </motion.div>
                                <h3 className="text-xl font-bold">{vibeCoding.title}</h3>
                            </div>
                            <p className="max-w-4xl leading-relaxed text-pretty text-sky-100/80">
                                {vibeCoding.description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Skills Grid (Preserved for depth) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    {skills.map((category, idx) => {
                        const Icon = categoryIcons[category.category] || Code2;
                        const isExpanded = expandedCategories[category.id];
                        const displayItems = isExpanded ? category.items : category.items.slice(0, 8);
                        const remainingCount = category.items.length - 8;
                        const hasMore = remainingCount > 0;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: idx * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                whileHover={{
                                    y: -4,
                                    boxShadow: '0 20px 40px -16px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08)'
                                }}
                                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col"
                                style={{ willChange: 'transform' }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <motion.div
                                        className="p-2.5 bg-slate-100 text-slate-600 rounded-lg"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {category.category}
                                    </h3>
                                </div>

                                <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                                    {category.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {displayItems.map((item) => (
                                        <TechTag key={item} name={item} />
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

