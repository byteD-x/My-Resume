'use client';

import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { TimelineItem, ProjectItem } from '../types';
import { TechTag } from './ui/TechTag';
import { saveScrollRestore, ScrollRestoreSection } from '@/lib/scroll-restore';

interface ExperienceCardProps {
    item: TimelineItem | ProjectItem;
    type?: 'timeline' | 'project';
    hideDate?: boolean;
}

export function ExperienceCard({ item, type, hideDate = false }: ExperienceCardProps) {
    const title = 'role' in item ? item.role : item.name;
    const subtitle = 'company' in item ? item.company : '';
    const date = item.year;

    const githubLink = item.link || item.expandedDetails?.links?.find(l => l.label.toLowerCase().includes('github'))?.url;
    const demoLink = 'demoLink' in item && item.demoLink ? item.demoLink : item.expandedDetails?.links?.find(l => !l.label.toLowerCase().includes('github'))?.url;
    const section: ScrollRestoreSection = type === 'project'
        ? 'projects'
        : type === 'timeline'
            ? 'experience'
            : ('role' in item ? 'experience' : 'projects');

    const handleOpen = () => {
        if (typeof window === 'undefined') return;
        const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        saveScrollRestore({
            path,
            y: window.scrollY,
            section,
            ts: Date.now(),
        });
    };

    return (
        <Link href={`/experiences/${item.id}`} scroll={false} className="block group h-full" onClick={handleOpen}>
            <div
                className="
                    relative overflow-hidden p-6 rounded-2xl
                    bg-white/80 dark:bg-zinc-900/80
                    backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50
                    transition-colors duration-300 ease-out
                    will-change-transform
                    flex flex-col h-full
                    group-hover:shadow-xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-900/15
                    group-hover:border-blue-500/30
                "
            >
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                    style={{
                        background: 'radial-gradient(800px circle at top right, rgba(59, 130, 246, 0.08), transparent 40%)',
                    }}
                />
                <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 rounded-2xl transition-colors duration-300 ease-out pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {!hideDate && (
                        <div className="shrink-0 text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 mt-1">
                            {date}
                        </div>
                    )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 line-clamp-3 leading-relaxed relative z-10">
                    {item.summary}
                </p>

                <div className="flex flex-wrap items-end gap-2 mt-auto pt-2 relative z-10">
                    <div className="flex flex-wrap gap-2 flex-1">
                        {item.techTags?.slice(0, 3).map((tag, idx) => (
                            <TechTag key={idx} name={tag} />
                        ))}
                        {(item.techTags?.length || 0) > 3 && (
                            <TechTag name={`+${((item.techTags?.length || 0) - 3)}`} className="bg-zinc-100/50 text-zinc-500" />
                        )}
                    </div>

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
                                    title="查看源码"
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
                                    title="查看演示"
                                >
                                    <ExternalLink size={16} strokeWidth={2} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-blue-500/50" />
                </div>
            </div>
        </Link>
    );
}
