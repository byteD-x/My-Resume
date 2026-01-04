'use client';

import { ProjectItem } from '@/types';
import { ExternalLink, Github, Sparkles, Rocket, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableText from './EditableText';

interface ProjectsProps {
    projects: ProjectItem[];
    onUpdate: (index: number, field: string, value: string) => void;
    onUpdateDetail: (index: number, detailIndex: number, value: string) => void;
}

const projectColors = [
    {
        gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
        border: 'border-violet-500/20',
        glow: 'hover:shadow-violet-500/20',
        accent: 'text-violet-400',
        accentBg: 'bg-violet-500',
        tagBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
        badgeHover: 'group-hover:border-violet-400/40 group-hover:text-zinc-200',
        lineGradient: 'from-violet-500 via-fuchsia-500 to-blue-500',
        icon: Sparkles,
    },
    {
        gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
        border: 'border-blue-500/20',
        glow: 'hover:shadow-blue-500/20',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-500',
        tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        badgeHover: 'group-hover:border-blue-400/40 group-hover:text-zinc-200',
        lineGradient: 'from-blue-500 via-indigo-500 to-cyan-500',
        icon: Rocket,
    },
    {
        gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        border: 'border-emerald-500/20',
        glow: 'hover:shadow-emerald-500/20',
        accent: 'text-emerald-400',
        accentBg: 'bg-emerald-500',
        tagBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        badgeHover: 'group-hover:border-emerald-400/40 group-hover:text-zinc-200',
        lineGradient: 'from-emerald-500 via-teal-500 to-green-500',
        icon: Zap,
    },
    {
        gradient: 'from-orange-500/20 via-amber-500/10 to-transparent',
        border: 'border-orange-500/20',
        glow: 'hover:shadow-orange-500/20',
        accent: 'text-orange-400',
        accentBg: 'bg-orange-500',
        tagBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
        badgeHover: 'group-hover:border-orange-400/40 group-hover:text-zinc-200',
        lineGradient: 'from-orange-500 via-red-500 to-amber-500',
        icon: Star,
    },
];

export default function Projects({ projects, onUpdate, onUpdateDetail }: ProjectsProps) {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-32 right-16 w-96 h-96 bg-gradient-to-br from-blue-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-32 left-12 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-cyan-500/6 to-transparent rounded-full blur-3xl animate-float-delayed" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-16 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    项目作品
                </motion.h2>

                <div className="relative">
                    <div
                        className="absolute left-4 md:left-8 top-4 bottom-4 w-px timeline-line pointer-events-none"
                        aria-hidden="true"
                    />

                    <div className="space-y-12 md:space-y-20">
                        {projects.map((project, index) => {
                            const colorScheme = projectColors[index % projectColors.length];
                            const IconComponent = colorScheme.icon;

                            return (
                                <motion.div
                                    key={index}
                                    className="relative pl-12 md:pl-24"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-120px" }}
                                    transition={{ duration: 0.6, delay: index * 0.08 }}
                                >
                                    <motion.div
                                        className={`absolute left-1 md:left-5 top-8 w-6 h-6 rounded-full border border-white/10 bg-zinc-950/80 flex items-center justify-center shadow-[0_0_18px_rgba(0,0,0,0.45)] ${colorScheme.accent} relative`}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true, margin: "-120px" }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                    >
                                        <span className="timeline-ping" aria-hidden="true" />
                                        <span className={`relative z-10 w-2.5 h-2.5 rounded-full ${colorScheme.accentBg} shadow-[0_0_12px_currentColor]`} />
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative group"
                                    >
                                        <div
                                            className={`absolute -inset-[1px] bg-gradient-to-r ${colorScheme.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`}
                                            aria-hidden="true"
                                        />

                                        <div className={`
                                            relative bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-6 md:p-8
                                            border border-white/[0.08]
                                            group-hover:border-white/[0.15] group-hover:bg-zinc-900/60
                                            transition-all duration-500
                                            overflow-hidden
                                        `}>
                                            <div
                                                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${colorScheme.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`}
                                                aria-hidden="true"
                                            />

                                            <div className="relative z-10">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <IconComponent className={`w-6 h-6 ${colorScheme.accent}`} />
                                                            <EditableText
                                                                id={`project-${index}-name`}
                                                                value={project.name}
                                                                onChange={(_, value) => onUpdate(index, 'name', value)}
                                                                className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight break-words"
                                                                as="h3"
                                                            />
                                                            <span className={`
                                                                text-xs font-mono py-1 px-3 rounded-full border
                                                                bg-white/5 border-white/10 text-zinc-400
                                                                transition-colors ${colorScheme.badgeHover}
                                                            `}>
                                                                {project.year}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech.map((tech, techIndex) => (
                                                                <span
                                                                    key={techIndex}
                                                                    className={`
                                                                        text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md
                                                                        bg-white/5 text-zinc-400 border border-white/5
                                                                        group-hover:border-white/10 group-hover:text-zinc-300
                                                                        transition-colors
                                                                    `}
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {project.link && (
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group/link self-start mt-2 md:mt-0"
                                                        >
                                                            <span className="text-xs uppercase tracking-wider font-medium">Visit Project</span>
                                                            {project.link.includes('github') ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                                        </a>
                                                    )}
                                                </div>

                                                <EditableText
                                                    id={`project-${index}-summary`}
                                                    value={project.summary}
                                                    onChange={(_, value) => onUpdate(index, 'summary', value)}
                                                    className="text-lg text-zinc-300 font-light leading-relaxed mb-6 border-l-2 border-white/10 pl-4 break-words"
                                                    as="p"
                                                />

                                                <ul className="space-y-3 relative">
                                                    {project.details.map((detail, detailIndex) => (
                                                        <li key={detailIndex} className="flex items-start gap-3 text-sm md:text-base text-zinc-400 min-w-0">
                                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${colorScheme.accentBg} flex-shrink-0 shadow-[0_0_8px_currentColor]`} />
                                                            <EditableText
                                                                id={`project-${index}-detail-${detailIndex}`}
                                                                value={detail}
                                                                onChange={(_, value) => onUpdateDetail(index, detailIndex, value)}
                                                                className="leading-relaxed break-words flex-1"
                                                                as="span"
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
