'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Github, ExternalLink, TrendingUp } from 'lucide-react';
import { TimelineItem, ProjectItem } from '../types';
import { TechTag } from './ui/TechTag';

interface ExperienceCardProps {
    item: TimelineItem | ProjectItem;
    type?: 'timeline' | 'project';
    hideDate?: boolean;
}

export function ExperienceCard({ item, hideDate = false }: ExperienceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine title and subtitle based on type
    const title = 'role' in item ? item.role : item.name;
    const subtitle = 'company' in item ? item.company : '';
    const date = item.year;

    // Get core metric from keyOutcomes or impact
    const coreMetric = item.keyOutcomes?.[0] || ('impact' in item ? item.impact : null);

    // Get evidence links
    const githubLink = item.link || item.expandedDetails?.links?.find(l => l.label.toLowerCase().includes('github'))?.url;
    const demoLink = 'demoLink' in item && item.demoLink ? item.demoLink : item.expandedDetails?.links?.find(l => !l.label.toLowerCase().includes('github'))?.url;

    const hasExpandedContent = item.summary || item.techTags?.length || item.expandedDetails;

    return (
        <article className="group h-full">
            <motion.div
                layoutId={`card-${item.id}`}
                whileHover={{ y: -2 }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8
                }}
                className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300 flex flex-col h-full group-hover:shadow-lg group-hover:shadow-blue-500/5"
            >
                {/* Main Content - Always Visible */}
                <div className="p-5">
                    {/* Header: Title, Subtitle, Date, Core Metric */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {!hideDate && (
                            <div className="shrink-0 text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                {date}
                            </div>
                        )}
                    </div>

                    {/* Core Metric - Prominent Display */}
                    {coreMetric && (
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {coreMetric}
                            </span>
                        </div>
                    )}

                    {/* Action Row: Expand + Links */}
                    <div className="flex items-center justify-between gap-2">
                        {/* Expand Toggle */}
                        {hasExpandedContent && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors px-3 py-2 -ml-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 min-h-[44px]"
                                aria-expanded={isExpanded}
                                aria-controls={`details-${item.id}`}
                                aria-label={isExpanded ? '收起详情' : '展开详情'}
                            >
                                <motion.span
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={16} />
                                </motion.span>
                                {isExpanded ? '收起' : '详情'}
                            </button>
                        )}

                        {/* Evidence Links */}
                        <div className="flex items-center gap-1 ml-auto">
                            {githubLink && (
                                <a
                                    href={githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="查看源代码"
                                    title="GitHub"
                                >
                                    <Github size={18} />
                                </a>
                            )}
                            {demoLink && (
                                <a
                                    href={demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="查看演示"
                                    title="Demo"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                            <Link
                                href={`/experiences/${item.id}`}
                                scroll={false}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all min-h-[44px] flex items-center"
                                aria-label={`查看${title}完整详情`}
                            >
                                查看全部
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                    {isExpanded && hasExpandedContent && (
                        <motion.div
                            id={`details-${item.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800"
                        >
                            <div className="p-5 pt-4 space-y-4">
                                {/* Summary */}
                                {item.summary && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                        {item.summary}
                                    </p>
                                )}

                                {/* Key Outcomes */}
                                {item.keyOutcomes && item.keyOutcomes.length > 1 && (
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                            核心成果
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {item.keyOutcomes.slice(1).map((outcome, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                    {outcome}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tech Tags */}
                                {item.techTags && item.techTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.techTags.map((tag, idx) => (
                                            <TechTag key={idx} name={tag} />
                                        ))}
                                    </div>
                                )}

                                {/* Expanded Details */}
                                {item.expandedDetails && (
                                    <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                        {item.expandedDetails.problem && (
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                                                    问题
                                                </h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                    {item.expandedDetails.problem}
                                                </p>
                                            </div>
                                        )}
                                        {item.expandedDetails.solution && (
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                                                    方案
                                                </h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                    {item.expandedDetails.solution}
                                                </p>
                                            </div>
                                        )}
                                        {item.expandedDetails.result && (
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                                                    结果
                                                </h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                    {item.expandedDetails.result}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </article>
    );
}
