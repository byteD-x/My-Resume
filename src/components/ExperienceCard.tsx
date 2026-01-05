'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { TimelineItem, ProjectItem } from '../types';

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

    // Handler to stop click propagation for direct links
    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Link href={`/experiences/${item.id}`} scroll={false} className="block group">
            <motion.div
                layoutId={`card-${item.id}`}
                className="relative p-6 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 hover:bg-white dark:hover:bg-zinc-800 transition-colors duration-300"
            >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <motion.h3
                            layoutId={`title-${item.id}`}
                            className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                            {title}
                        </motion.h3>
                        {subtitle && (
                            <motion.p
                                layoutId={`subtitle-${item.id}`}
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>
                    {/* Only show date badge if not hidden (e.g., when used outside Timeline) */}
                    {!hideDate && (
                        <motion.div
                            layoutId={`date-${item.id}`}
                            className="text-xs font-mono text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-full"
                        >
                            {date}
                        </motion.div>
                    )}
                </div>

                {/* Summary */}
                <motion.p
                    className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2"
                >
                    {item.summary}
                </motion.p>

                {/* Tech Tags + Evidence Links */}
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                    {item.techTags?.slice(0, 3).map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 rounded-md"
                        >
                            {tag}
                        </span>
                    ))}
                    {(item.techTags?.length || 0) > 3 && (
                        <span className="text-xs px-2 py-1 text-zinc-400">
                            +{((item.techTags?.length || 0) - 3)}
                        </span>
                    )}

                    {/* Evidence Links - Show inline icons */}
                    {(githubLink || demoLink) && (
                        <div className="flex items-center gap-1 ml-auto">
                            {githubLink && (
                                <a
                                    href={githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleLinkClick}
                                    className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    aria-label="查看 GitHub 仓库"
                                    title="GitHub"
                                >
                                    <Github size={14} />
                                </a>
                            )}
                            {demoLink && (
                                <a
                                    href={demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleLinkClick}
                                    className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    aria-label="查看在线演示"
                                    title="Demo"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300">
                    <ArrowUpRight className="w-5 h-5 text-blue-500" />
                </div>
            </motion.div>
        </Link>
    );
}
