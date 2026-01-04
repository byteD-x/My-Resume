'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Building, Globe, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TimelineItem, ProjectItem } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ExperienceModalProps {
    item: TimelineItem | ProjectItem;
}

export function ExperienceModal({ item }: ExperienceModalProps) {
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();

    // Hooks for a11y & ux
    useScrollLock(true);
    const containerRef = useFocusTrap(true);

    const closeModal = () => {
        router.back();
    };

    const title = 'role' in item ? item.role : item.name;
    const subtitle = 'company' in item ? item.company : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`modal-title-${item.id}`}>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
                ref={containerRef}
                layoutId={shouldReduceMotion ? undefined : `card-${item.id}`}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                initial={shouldReduceMotion ? { opacity: 0, scale: 0.95 } : undefined}
                animate={shouldReduceMotion ? { opacity: 1, scale: 1 } : undefined}
                exit={shouldReduceMotion ? { opacity: 0, scale: 0.95 } : undefined}
            >
                {/* Header */}
                <div className="relative p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <button
                        onClick={closeModal}
                        aria-label="Close modal"
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                    >
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                    </button>

                    <div className="pr-8">
                        <motion.h2
                            layoutId={shouldReduceMotion ? undefined : `title-${item.id}`}
                            id={`modal-title-${item.id}`}
                            className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
                        >
                            {title}
                        </motion.h2>

                        {subtitle && (
                            <motion.div
                                layoutId={shouldReduceMotion ? undefined : `subtitle-${item.id}`}
                                className="flex items-center gap-2 text-lg text-blue-600 dark:text-blue-400 font-medium mb-4"
                            >
                                <Building className="w-4 h-4" />
                                {subtitle}
                            </motion.div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <motion.div
                                layoutId={shouldReduceMotion ? undefined : `date-${item.id}`}
                                className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-mono"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                {item.year}
                            </motion.div>

                            {'location' in item && item.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {item.location}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 overscroll-contain">

                    {/* TL;DR Summary */}
                    <section>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Summary</h4>
                        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {item.summary}
                        </p>
                    </section>

                    {/* Extended Details */}
                    {item.expandedDetails && (
                        <>
                            {/* Background & Problem */}
                            {(item.expandedDetails.background || item.expandedDetails.problem) && (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {item.expandedDetails.background && (
                                        <section>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Background</h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.expandedDetails.background}</p>
                                        </section>
                                    )}
                                    {item.expandedDetails.problem && (
                                        <section>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">The Challenge</h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.expandedDetails.problem}</p>
                                        </section>
                                    )}
                                </div>
                            )}

                            {/* Solution & Result */}
                            <section className="bg-blue-50/50 dark:bg-blue-900/10 -mx-4 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">Action & Result</h4>
                                <div className="space-y-4">
                                    {item.expandedDetails.solution && (
                                        <div>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-200">Solution: </span>
                                            <span className="text-zinc-700 dark:text-zinc-300">{item.expandedDetails.solution}</span>
                                        </div>
                                    )}
                                    {item.expandedDetails.result && (
                                        <div>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-200">Outcome: </span>
                                            <span className="text-zinc-700 dark:text-zinc-300">{item.expandedDetails.result}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Key Bullets (from data structure) */}
                            {('details' in item && item.details) && (
                                <section>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Key Details</h4>
                                    <ul className="space-y-2">
                                        {item.details.map((detail, idx) => (
                                            <li key={idx} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                                <span className="text-blue-500 mt-1.5">•</span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </>
                    )}

                    {/* Key Outcomes / Metrics */}
                    {item.keyOutcomes && item.keyOutcomes.length > 0 && (
                        <section>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Key Metrics</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {item.keyOutcomes.map((outcome, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tech Stack */}
                    <section>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {item.techTags?.map((tech, idx) => (
                                <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Links */}
                    {item.expandedDetails?.links && item.expandedDetails.links.length > 0 && (
                        <section className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex flex-wrap gap-4">
                                {item.expandedDetails.links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {link.label.toLowerCase().includes('github') ? <Github className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
