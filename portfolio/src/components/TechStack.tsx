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

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {skills.map((skill, index) => {
                        const Icon = categoryIcons[skill.category] || Code;
                        const isExpanded = expandedCategories.has(skill.id);
                        const hasMoreTags = skill.items.length > MAX_VISIBLE_TAGS;
                        const visibleTags = isExpanded ? skill.items : skill.items.slice(0, MAX_VISIBLE_TAGS);
                        const hiddenCount = skill.items.length - MAX_VISIBLE_TAGS;

                        return (
                            <motion.div
                                key={skill.id}
                                initial={fadeIn.initial}
                                whileInView={fadeIn.animate}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                viewport={{ once: true, margin: '-50px' }}
                                className="card p-6"
                                style={{ backgroundColor: 'var(--bg-surface)' }}
                            >
                                {/* Category Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div
                                        className="p-2 rounded-lg flex-shrink-0"
                                        style={{
                                            backgroundColor: 'var(--color-primary-light)',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <h3
                                            className="font-semibold"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {skill.category}
                                        </h3>
                                        {skill.description && (
                                            <p
                                                className="text-xs mt-0.5"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                {skill.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <AnimatePresence mode="popLayout">
                                        {visibleTags.map((item) => (
                                            <motion.span
                                                key={item}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.15 }}
                                                className="tag"
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>

                                    {/* Show more button */}
                                    {hasMoreTags && (
                                        <button
                                            onClick={() => toggleCategory(skill.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-colors"
                                            style={{
                                                backgroundColor: 'var(--color-primary-light)',
                                                color: 'var(--color-primary)',
                                            }}
                                        >
                                            {isExpanded ? (
                                                <>收起</>
                                            ) : (
                                                <>+{hiddenCount} 更多</>
                                            )}
                                            <ChevronDown
                                                size={12}
                                                style={{
                                                    transform: isExpanded ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform 0.2s',
                                                }}
                                            />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
