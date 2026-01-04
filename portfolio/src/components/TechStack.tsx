'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SkillCategory, VibeCodingData } from '@/types';
import { Layers, Workflow, Cpu, Database, Cloud, Code, Sparkles, LucideIcon } from 'lucide-react';
import EditableText from './EditableText';

const icons: Record<string, LucideIcon> = {
    "Backend": Code,
    "后端核心": Code,
    "Data": Database,
    "数据存储": Database,
    "分布式": Layers,
    "前端": Sparkles,
    "Engineering": Cloud,
    "DevOps": Cloud,
    "AI Engineering": Cpu,
    "AI 工程 · Vibe Coding": Cpu,
    "AI-assisted Workflow": Workflow
};

interface TechStackProps {
    skills: SkillCategory[];
    vibeCoding: VibeCodingData;
    isEditorActive?: boolean;
}

export default function TechStack({ skills, vibeCoding, isEditorActive = false }: TechStackProps) {
    return (
        <section className="py-24 relative bg-white" id="skills">
            <div className="container-padding">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">
                        技术 <span className="text-zinc-500">生态</span>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        高性能、AI 驱动的开发工具集
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 技能矩阵 */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((skillGroup, index) => {
                            const Icon = icons[skillGroup.category] || Code;
                            return (
                                <motion.div
                                    key={skillGroup.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-zinc-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900">{skillGroup.category}</h3>
                                            {skillGroup.description && (
                                                <p className="text-xs text-zinc-400 mt-0.5">{skillGroup.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {skillGroup.items.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-50 text-zinc-600 border border-zinc-100 hover:bg-zinc-100 transition-all cursor-default"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Vibe Coding 卡片 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="h-full rounded-2xl border border-zinc-800 p-8 relative bg-zinc-900 text-white">
                            {/* 装饰性渐变 - 独立层，不影响文字 */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"
                                aria-hidden="true"
                            />

                            {/* 内容层 */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Workflow className="text-purple-400" />
                                    <h3 className="text-xl font-bold">
                                        <EditableText
                                            id="vibe-title"
                                            value={vibeCoding.title}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </h3>
                                </div>

                                <div className="text-zinc-400 leading-relaxed mb-8">
                                    <EditableText
                                        id="vibe-desc"
                                        value={vibeCoding.description}
                                        onChange={() => { }}
                                        as="div"
                                        multiline
                                        isEditorActive={isEditorActive}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-sm text-zinc-300">AI-First 开发</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        <span className="text-sm text-zinc-300">快速原型构建</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                        <span className="text-sm text-zinc-300">全栈可扩展</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
