'use client';

import { SkillCategory } from '@/types';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Cloud, Brain, Wrench } from 'lucide-react';

interface SkillsProps {
    skills: SkillCategory[];
}

const categoryStyles: Record<string, {
    gradient: string;
    border: string;
    glow: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    tagBg: string;
}> = {
    '后端开发': {
        gradient: 'from-blue-500/15 via-indigo-500/10 to-transparent',
        border: 'border-blue-500/20',
        glow: 'group-hover:shadow-blue-500/20',
        icon: Code2,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/20',
        tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20',
    },
    '数据技术': {
        gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
        border: 'border-emerald-500/20',
        glow: 'group-hover:shadow-emerald-500/20',
        icon: Database,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/20',
        tagBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20',
    },
    '前端技术': {
        gradient: 'from-orange-500/15 via-amber-500/10 to-transparent',
        border: 'border-orange-500/20',
        glow: 'group-hover:shadow-orange-500/20',
        icon: Layout,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-500/20',
        tagBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20',
    },
    '云平台与部署': {
        gradient: 'from-cyan-500/15 via-sky-500/10 to-transparent',
        border: 'border-cyan-500/20',
        glow: 'group-hover:shadow-cyan-500/20',
        icon: Cloud,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/20',
        tagBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20',
    },
    'AI 与大模型': {
        gradient: 'from-violet-500/15 via-purple-500/10 to-transparent',
        border: 'border-violet-500/20',
        glow: 'group-hover:shadow-violet-500/20',
        icon: Brain,
        iconColor: 'text-violet-400',
        iconBg: 'bg-violet-500/20',
        tagBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30 hover:bg-violet-500/20',
    },
    '开发工具': {
        gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
        border: 'border-rose-500/20',
        glow: 'group-hover:shadow-rose-500/20',
        icon: Wrench,
        iconColor: 'text-rose-400',
        iconBg: 'bg-rose-500/20',
        tagBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20',
    },
};

const defaultStyle = {
    gradient: 'from-zinc-500/15 via-slate-500/10 to-transparent',
    border: 'border-zinc-500/20',
    glow: 'group-hover:shadow-zinc-500/20',
    icon: Code2,
    iconColor: 'text-zinc-400',
    iconBg: 'bg-zinc-500/20',
    tagBg: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/20',
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3 },
    },
};

export default function Skills({ skills }: SkillsProps) {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl animate-float-slow" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/5 via-amber-500/3 to-transparent rounded-full blur-3xl animate-glow" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-14 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    技能专长
                </motion.h2>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {skills.map((category, index) => {
                        const style = categoryStyles[category.category] || defaultStyle;
                        const IconComponent = style.icon;

                        return (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                className="relative group"
                                whileHover={{ y: -4 }}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute -inset-[1px] bg-gradient-to-r ${style.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`} />

                                {/* Card */}
                                <div className={`
                                    relative bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6
                                    border ${style.border}
                                    group-hover:bg-white/[0.04] group-hover:border-opacity-50
                                    shadow-lg shadow-black/5 ${style.glow}
                                    transition-all duration-500
                                    overflow-hidden
                                `}>
                                    {/* Background Gradient */}
                                    <div
                                        className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${style.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                                        aria-hidden="true"
                                    />

                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-5 relative">
                                        <motion.div
                                            className={`p-2.5 rounded-xl ${style.iconBg} ${style.iconColor}`}
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </motion.div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {category.category}
                                        </h3>
                                    </div>

                                    {/* Tags */}
                                    <motion.div
                                        className="flex flex-wrap gap-2 relative"
                                        variants={containerVariants}
                                    >
                                        {category.items.map((skill, skillIndex) => (
                                            <motion.span
                                                key={skillIndex}
                                                variants={tagVariants}
                                                className={`
                                                    px-3 py-1.5 
                                                    ${style.tagBg}
                                                    text-sm font-medium
                                                    rounded-full
                                                    border
                                                    transition-all duration-300
                                                    cursor-default
                                                `}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
