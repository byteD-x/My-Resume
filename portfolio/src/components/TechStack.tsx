import React from 'react';
import { motion } from 'framer-motion';
import { SkillCategory, VibeCodingData } from '@/types';
import { Layers, Workflow, Cpu, Database, Cloud, Code, LucideIcon } from 'lucide-react';
import EditableText from './EditableText';

const icons: Record<string, LucideIcon> = {
    "后端核心": Code,
    "数据存储": Database,
    "分布式": Layers,
    "前端": Layers,
    "DevOps": Cloud,
    "AI 工程 · Vibe Coding": Cpu
};

interface TechStackProps {
    skills: SkillCategory[];
    vibeCoding: VibeCodingData;
    onUpdateVibeCoding: (field: keyof VibeCodingData, value: string) => void;
}

export default function TechStack({ skills, vibeCoding, onUpdateVibeCoding }: TechStackProps) {
    return (
        <section className="py-24 relative overflow-hidden bg-white" id="skills">
            <div className="container-padding">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">
                        Tech <span className="text-zinc-500">Ecosystem</span>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        A comprehensive toolkit designed for high-performance, AI-driven development.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Skills Matrix */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((skillGroup, index) => {
                            const Icon = icons[skillGroup.category] || Code;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bento-card p-6 bg-white hover:border-zinc-300 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="font-semibold text-zinc-900">{skillGroup.category}</h3>
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

                    {/* Vibe Coding / Philosophy Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="bento-card h-full p-8 relative overflow-hidden bg-zinc-900 text-white border-zinc-800">
                            {/* Decorative gradient since it's the "Vibe" card */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Workflow className="text-purple-400" />
                                <h3 className="text-xl font-bold">
                                    <EditableText
                                        id="vibe-title"
                                        value={vibeCoding.title}
                                        onChange={(_, val) => onUpdateVibeCoding('title', val)}
                                        as="span"
                                    />
                                </h3>
                            </div>

                            <div className="text-zinc-400 leading-relaxed mb-8 relative z-10">
                                <EditableText
                                    id="vibe-desc"
                                    value={vibeCoding.description}
                                    onChange={(_, val) => onUpdateVibeCoding('description', val)}
                                    as="div"
                                    multiline
                                />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-sm text-zinc-300">AI-First Development</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    <span className="text-sm text-zinc-300">Rapid Prototyping</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    <span className="text-sm text-zinc-300">Full Stack Scalability</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
