'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Building, Globe, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TimelineItem, ProjectItem } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { clearScrollRestore, readScrollRestore, saveScrollRestore } from '@/lib/scroll-restore';

type ExperienceModalVariant = 'overlay' | 'page';

interface ExperienceModalProps {
    item: TimelineItem | ProjectItem;
    variant?: ExperienceModalVariant;
}

export function ExperienceModal({ item, variant = 'overlay' }: ExperienceModalProps) {
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();
    const isOverlay = variant === 'overlay';
    const useSharedLayout = isOverlay && !shouldReduceMotion;

    // Hooks for a11y & ux
    useScrollLock(isOverlay);
    const containerRef = useFocusTrap(true);

    const closeModal = () => {
        if (isOverlay && typeof window !== 'undefined' && window.history.length > 1) {
            clearScrollRestore();
            router.back();
            return;
        }

        const saved = readScrollRestore();
        if (!saved) {
            const section = 'role' in item ? 'experience' : 'projects';
            saveScrollRestore({
                path: '/',
                section,
                ts: Date.now(),
            });
            router.push('/');
            return;
        }

        router.push(saved.path || '/');
    };

    const title = 'role' in item ? item.role : item.name;
    const subtitle = 'company' in item ? item.company : '';

    const renderInlineMarkdown = (input: string) => {
        const nodes: Array<ReactNode> = [];
        let remaining = input;

        const patterns = [
            { type: 'code', regex: /`([^`]+)`/ },
            { type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/ },
            { type: 'bold', regex: /\*\*([^*]+)\*\*/ },
            { type: 'bold', regex: /__([^_]+)__/ },
            { type: 'italic', regex: /\*([^*]+)\*/ },
            { type: 'italic', regex: /_([^_]+)_/ },
        ];

        const isSafeUrl = (url: string) => /^(https?:|mailto:)/i.test(url);

        while (remaining.length > 0) {
            let earliest: { index: number; match: RegExpExecArray; type: string } | null = null;

            for (const pattern of patterns) {
                pattern.regex.lastIndex = 0;
                const match = pattern.regex.exec(remaining);
                if (!match) continue;
                const index = match.index;
                if (earliest === null || index < earliest.index) {
                    earliest = { index, match, type: pattern.type };
                }
            }

            if (!earliest) {
                nodes.push(remaining);
                break;
            }

            if (earliest.index > 0) {
                nodes.push(remaining.slice(0, earliest.index));
            }

            const [full, first, second] = earliest.match;

            switch (earliest.type) {
                case 'code':
                    nodes.push(
                        <code
                            key={`code-${nodes.length}`}
                            className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[0.85em]"
                        >
                            {first}
                        </code>
                    );
                    break;
                case 'link':
                    if (second && isSafeUrl(second)) {
                        nodes.push(
                            <a
                                key={`link-${nodes.length}`}
                                href={second}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {first}
                            </a>
                        );
                    } else {
                        nodes.push(`${first} (${second})`);
                    }
                    break;
                case 'bold':
                    nodes.push(
                        <strong key={`bold-${nodes.length}`} className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {first}
                        </strong>
                    );
                    break;
                case 'italic':
                    nodes.push(
                        <em key={`italic-${nodes.length}`} className="italic">
                            {first}
                        </em>
                    );
                    break;
                default:
                    nodes.push(full);
                    break;
            }

            remaining = remaining.slice(earliest.index + full.length);
        }

        return nodes;
    };

    const renderMarkdown = (text: string, tone: 'muted' | 'default' = 'muted') => {
        const lines = text.split('\n');
        const blocks: Array<ReactNode> = [];
        let paragraphLines: string[] = [];
        let listType: 'ol' | 'ul' | null = null;
        let listItems: string[] = [];
        let quoteLines: string[] = [];
        let inCode = false;
        let codeLines: string[] = [];

        const paragraphClass =
            tone === 'default'
                ? 'text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed'
                : 'text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed';
        const listClass =
            tone === 'default'
                ? 'text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed'
                : 'text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed';
        const quoteClass =
            tone === 'default'
                ? 'text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed'
                : 'text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed';

        const headingClasses: Record<number, string> = {
            1: 'text-base font-semibold text-zinc-900 dark:text-zinc-100',
            2: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
            3: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
            4: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
            5: 'text-xs font-semibold text-zinc-900 dark:text-zinc-100',
            6: 'text-xs font-semibold text-zinc-900 dark:text-zinc-100',
        };

        const flushParagraph = () => {
            if (paragraphLines.length === 0) return;
            const textContent = paragraphLines.join(' ');
            blocks.push(
                <p key={`p-${blocks.length}`} className={paragraphClass}>
                    {renderInlineMarkdown(textContent)}
                </p>
            );
            paragraphLines = [];
        };

        const flushQuote = () => {
            if (quoteLines.length === 0) return;
            const textContent = quoteLines.join(' ');
            blocks.push(
                <blockquote
                    key={`quote-${blocks.length}`}
                    className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-3"
                >
                    <p className={quoteClass}>{renderInlineMarkdown(textContent)}</p>
                </blockquote>
            );
            quoteLines = [];
        };

        const flushList = () => {
            if (!listType || listItems.length === 0) return;
            const items = listItems.map((itemText, idx) => (
                <li key={idx} className="pl-1">
                    {renderInlineMarkdown(itemText)}
                </li>
            ));
            if (listType === 'ol') {
                blocks.push(
                    <ol
                        key={`ol-${blocks.length}`}
                        className={`${listClass} list-decimal list-outside pl-5 space-y-1`}
                    >
                        {items}
                    </ol>
                );
            } else {
                blocks.push(
                    <ul
                        key={`ul-${blocks.length}`}
                        className={`${listClass} list-disc list-outside pl-5 space-y-1`}
                    >
                        {items}
                    </ul>
                );
            }
            listType = null;
            listItems = [];
        };

        const flushCode = () => {
            if (!inCode) return;
            const codeContent = codeLines.join('\n');
            blocks.push(
                <pre
                    key={`code-${blocks.length}`}
                    className="text-xs leading-relaxed font-mono bg-zinc-900/5 dark:bg-zinc-100/5 text-zinc-800 dark:text-zinc-100 rounded-lg p-3 overflow-x-auto"
                >
                    <code>{codeContent}</code>
                </pre>
            );
            codeLines = [];
            inCode = false;
        };

        lines.forEach((rawLine) => {
            const line = rawLine.trimEnd();
            const trimmed = line.trim();

            if (trimmed.startsWith('```')) {
                flushParagraph();
                flushList();
                flushQuote();
                if (inCode) {
                    flushCode();
                } else {
                    inCode = true;
                }
                return;
            }

            if (inCode) {
                codeLines.push(rawLine);
                return;
            }

            if (!trimmed) {
                flushParagraph();
                flushList();
                flushQuote();
                return;
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                flushParagraph();
                flushList();
                flushQuote();
                const level = headingMatch[1].length;
                const content = headingMatch[2];
                const className = headingClasses[level] || headingClasses[3];
                blocks.push(
                    <div key={`h-${blocks.length}`} className={className}>
                        {renderInlineMarkdown(content)}
                    </div>
                );
                return;
            }

            const quoteMatch = trimmed.match(/^>\s*(.+)$/);
            if (quoteMatch) {
                flushParagraph();
                flushList();
                quoteLines.push(quoteMatch[1]);
                return;
            }

            const orderedMatch = trimmed.match(/^\d+(?:[.)]|、|）)\s*(.+)$/);
            if (orderedMatch) {
                flushParagraph();
                flushQuote();
                if (listType !== 'ol') {
                    flushList();
                    listType = 'ol';
                }
                listItems.push(orderedMatch[1]);
                return;
            }

            const unorderedMatch = trimmed.match(/^[-*•]\s*(.+)$/);
            if (unorderedMatch) {
                flushParagraph();
                flushQuote();
                if (listType !== 'ul') {
                    flushList();
                    listType = 'ul';
                }
                listItems.push(unorderedMatch[1]);
                return;
            }

            flushList();
            flushQuote();
            paragraphLines.push(trimmed);
        });

        flushParagraph();
        flushList();
        flushQuote();
        flushCode();

        if (blocks.length === 1) return blocks[0];
        return <div className="space-y-2">{blocks}</div>;
    };


    return (
        <div
            className={`${isOverlay ? 'fixed inset-0 z-50' : 'relative z-10'} flex items-center justify-center p-4 sm:p-6`}
            role="dialog"
            aria-modal={isOverlay ? 'true' : undefined}
            aria-labelledby={`modal-title-${item.id}`}
        >
            {/* Backdrop */}
            {isOverlay && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />
            )}

            {/* Modal Content */}
            <motion.div
                ref={containerRef}
                layoutId={useSharedLayout ? `card-${item.id}` : undefined}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                initial={shouldReduceMotion ? { opacity: 0, scale: 0.95 } : undefined}
                animate={shouldReduceMotion ? { opacity: 1, scale: 1 } : undefined}
                exit={shouldReduceMotion ? { opacity: 0, scale: 0.95 } : undefined}
            >
                {/* Header */}
                <div className="relative p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <button
                        onClick={closeModal}
                        aria-label="关闭弹窗"
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                    >
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                    </button>

                    <div className="pr-8">
                        <motion.h2
                            layoutId={useSharedLayout ? `title-${item.id}` : undefined}
                            id={`modal-title-${item.id}`}
                            className="text-2xl font-bold text-zinc-900 dark:text-white mb-2"
                        >
                            {title}
                        </motion.h2>

                        {subtitle && (
                            <motion.div
                                layoutId={useSharedLayout ? `subtitle-${item.id}` : undefined}
                                className="flex items-center gap-2 text-lg text-blue-600 dark:text-blue-400 font-medium mb-4"
                            >
                                <Building className="w-4 h-4" />
                                {subtitle}
                            </motion.div>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <motion.div
                                layoutId={useSharedLayout ? `date-${item.id}` : undefined}
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
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">概要</h4>
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
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">背景</h4>
                                            {renderMarkdown(item.expandedDetails.background, 'muted')}
                                        </section>
                                    )}
                                    {item.expandedDetails.problem && (
                                        <section>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">挑战</h4>
                                            {renderMarkdown(item.expandedDetails.problem, 'muted')}
                                        </section>
                                    )}
                                </div>
                            )}

                            {/* Solution & Result */}
                            <section className="bg-blue-50/50 dark:bg-blue-900/10 -mx-4 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">行动与成果</h4>
                                <div className="space-y-4">
                                    {item.expandedDetails.solution && (
                                        <div>
                                            <div className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">解决方案</div>
                                            {renderMarkdown(item.expandedDetails.solution, 'default')}
                                        </div>
                                    )}
                                    {item.expandedDetails.result && (
                                        <div>
                                            <div className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">成果</div>
                                            {renderMarkdown(item.expandedDetails.result, 'default')}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Key Bullets (from data structure) */}
                            {('details' in item && item.details) && (
                                <section>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">核心详情</h4>
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
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">关键指标</h4>
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
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">技术栈</h4>
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
