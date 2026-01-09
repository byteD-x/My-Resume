'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { TimelineItem, ProjectItem } from '../types';
import { TechTag } from './ui/TechTag';

interface ExperienceCardProps {
    item: TimelineItem | ProjectItem;
    type?: 'timeline' | 'project';
    hideDate?: boolean; // Hide date when already shown in Timeline
}

export function ExperienceCard({ item, hideDate = false }: ExperienceCardProps) {
    // Determine title and subtitle based on type
    const title = 'role' in item ? item.role : item.name;
    const subtitle = 'company' in item ? item.company : '';
    const date = item.year;

    // Get evidence links
    const githubLink = item.link || item.expandedDetails?.links?.find(l => l.label.toLowerCase().includes('github'))?.url;
    const demoLink = 'demoLink' in item && item.demoLink ? item.demoLink : item.expandedDetails?.links?.find(l => !l.label.toLowerCase().includes('github'))?.url;

    return (
        <Link href={`/experiences/${item.id}`} scroll={false} className="block group h-full">
            <motion.div
                layoutId={`card-${item.id}`}
                whileHover={{
                    y: -4,
                }}
                whileTap={{ scale: 0.995 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8
                }}
                className="relative overflow-hidden p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300 flex flex-col h-full group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-900/20 group-hover:border-blue-500/20"
            >
                {/* Gradient Hover Border Effect - Use motion for opacity to sync with hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        background: 'radial-gradient(800px circle at top right, rgba(59, 130, 246, 0.08), transparent 40%)',
                    }}
                />
                {/* Subtle border glow - CSS transition is fine here as it is opacity/color on child */}
                <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 rounded-2xl transition-colors duration-500 pointer-events-none" />

                {/* Header Section */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3
                            className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight"
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <p
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1"
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {/* Refined Date Display: Text only, clean typography */}
                    {!hideDate && (
                        <div
                            className="shrink-0 text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 mt-1"
                        >
                            {date}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <p
                    className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 line-clamp-3 leading-relaxed relative z-10"
                >
                    {item.summary}
                </p>

                {/* Tech Tags + Evidence Links */}
                <div className="flex flex-wrap items-end gap-2 mt-auto pt-2 relative z-10">
                    <div className="flex flex-wrap gap-2 flex-1">
                        {item.techTags?.slice(0, 3).map((tag, idx) => (
                            <TechTag key={idx} name={tag} />
                        ))}
                        {(item.techTags?.length || 0) > 3 && (
                            <TechTag name={`+${((item.techTags?.length || 0) - 3)}`} className="bg-zinc-100/50 text-zinc-500" />
                        )}
                    </div>

                    {/* Evidence Links - Minimalist buttons */}
                    {(githubLink || demoLink) && (
                        <div className="flex items-center gap-1 ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {githubLink && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(githubLink, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:scale-105"
                                    aria-label="GitHub"
                                    title="View Source"
                                >
                                    <Github size={16} strokeWidth={2} />
                                </button>
                            )}
                            {demoLink && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(demoLink, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105"
                                    aria-label="Live Demo"
                                    title="View Demo"
                                >
                                    <ExternalLink size={16} strokeWidth={2} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Hover Indicator - Subtle top right glow icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-blue-500/50" />
                </div>
            </motion.div>
        </Link>
    );
}
