'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillCategory, VibeCodingData } from '@/types';
import {
    Layers, Workflow, Cpu, Database, Cloud, Code, Sparkles,
    LucideIcon, ChevronDown, Zap
} from 'lucide-react';

// Category icon mapping
const categoryIcons: Record<string, LucideIcon> = {
    "Backend": Code,
    "后端": Code,
    "Data": Database,
    "数据存储": Database,
    "分布式": Layers,
    "前端": Sparkles,
    "Frontend": Sparkles,
    "Engineering": Cloud,
    "DevOps": Cloud,
    "AI Engineering": Cpu,
    "AI 工程 · Vibe Coding": Cpu,
    "AI-assisted Workflow": Workflow
};

interface TechStackProps {
    skills: SkillCategory[];
    vibeCoding: VibeCodingData;
}

// Animation config
const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

const MAX_VISIBLE_TAGS = 8;

export default function TechStack({ skills, vibeCoding }: TechStackProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    return (
        <section
            className="section"
            id="skills"
            style={{ backgroundColor: 'var(--bg-muted)' }}
        >
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <h2 className="section-title">技术栈</h2>
                    <p className="section-subtitle">按能力领域组织，展示核心技术能力</p>
                </div>

                {/* AI Native Badge */}
                <motion.div
                    {...fadeIn}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <div
                        className="p-5 rounded-xl"
                        style={{
                            backgroundColor: 'var(--text-primary)',
                            color: 'white',
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <Zap size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">{vibeCoding.title}</h3>
                        </div>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                            {vibeCoding.description}
                        </p>
                    </div>
                </motion.div>

                {/* Skills List Layout */}
                <div className="space-y-8 max-w-4xl mx-auto">
                    {skills.map((skill, index) => {
                        const Icon = categoryIcons[skill.category] || Code;
                        const isExpanded = expandedCategories.has(skill.id);
                        const hasMoreTags = skill.items.length > MAX_VISIBLE_TAGS;
                        const visibleTags = isExpanded ? skill.items : skill.items.slice(0, MAX_VISIBLE_TAGS);
                        const hiddenCount = skill.items.length - MAX_VISIBLE_TAGS;

                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className="group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-4 md:p-6 rounded-2xl hover:bg-white/50 border border-transparent hover:border-slate-200 transition-all">
                                    {/* Icon & Title Column */}
                                    <div className="flex-shrink-0 w-full md:w-48 flex items-center md:items-start gap-3 md:block">
                                        <div
                                            className="p-2.5 rounded-xl bg-blue-50/50 text-blue-600 mb-0 md:mb-3 inline-flex"
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{skill.category}</h3>
                                            {skill.description && (
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed hidden md:block">
                                                    {skill.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Description (Shown below title on mobile) */}
                                    {skill.description && (
                                        <p className="text-xs text-slate-500 md:hidden -mt-2 mb-2">
                                            {skill.description}
                                        </p>
                                    )}

                                    {/* Tags Column */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            <AnimatePresence mode="popLayout">
                                                {visibleTags.map((item) => (
                                                    <motion.span
                                                        key={item}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-white border border-slate-200 text-slate-600 shadow-sm"
                                                    >
                                                        {item}
                                                    </motion.span>
                                                ))}
                                            </AnimatePresence>

                                            {/* Show more button */}
                                            {hasMoreTags && (
                                                <button
                                                    onClick={() => toggleCategory(skill.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    {isExpanded ? '收起' : `+${hiddenCount}`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider (except last) */}
                                {index !== skills.length - 1 && (
                                    <div className="h-px bg-slate-100 mx-6 md:mx-0 my-2" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
