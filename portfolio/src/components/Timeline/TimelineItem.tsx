'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown } from 'lucide-react';
import { TimelineItem as TimelineItemType } from '@/types';
import EditableText from '../EditableText';

interface TimelineItemProps {
    item: TimelineItemType;
    isLast: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    isEditorActive: boolean;
    index: number;
    isHighlighted?: boolean;
}

export function TimelineItem({
    item,
    isLast,
    isExpanded,
    onToggle,
    isEditorActive,
    index,
    isHighlighted = false
}: TimelineItemProps) {
    return (
        <li
            id={`timeline-${item.id}`}
            className={`relative pl-8 md:pl-0 group transition-all duration-300 ${isHighlighted ? 'scroll-mt-32' : ''}`}
        >
            {/* Mobile Vertical Line */}
            {!isLast && (
                <div
                    className="md:hidden absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200"
                    aria-hidden="true"
                />
            )}

            <div className="md:grid md:grid-cols-[11ch_24px_1fr] md:gap-6">
                {/* 1. Date Column (Desktop) */}
                <div className="hidden md:block text-right pt-5">
                    <span className="text-sm font-mono font-medium text-slate-400 tabular-nums sticky top-24">
                        <EditableText
                            id={`timeline-${item.id}-year`}
                            value={item.year}
                            onChange={() => { }}
                            as="span"
                            isEditorActive={isEditorActive}
                        />
                    </span>
                </div>

                {/* 2. Axis Column (Desktop) */}
                <div className="hidden md:flex flex-col items-center">
                    {/* Dot */}
                    <div
                        className={`w-3 h-3 rounded-full border-[2.5px] z-10 flex-shrink-0 transition-all duration-300 mt-[24px]
                        ${isExpanded || index === 0 || isHighlighted
                                ? 'bg-white border-blue-600 ring-4 ring-blue-50 scale-110'
                                : 'bg-white border-slate-300 group-hover:border-blue-400'
                            }`}
                    />
                    {/* Desktop Vertical Line */}
                    {!isLast && (
                        <div className="w-px h-full bg-slate-200 absolute top-[24px] left-1/2 -translate-x-1/2 -z-0" />
                    )}
                </div>

                {/* 3. Content Card */}
                <div className="relative pb-8 md:pb-2">
                    {/* Mobile Dot (Absolute) */}
                    <div
                        className={`md:hidden absolute left-[-26px] top-5 w-3 h-3 rounded-full border-[2.5px] z-10 bg-white transition-colors
                        ${isExpanded || isHighlighted ? 'border-blue-600' : 'border-slate-300'}`}
                    />

                    {/* Mobile Date */}
                    <div className="md:hidden mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-xs font-mono font-medium text-slate-600">
                            {item.year}
                        </span>
                    </div>

                    <div
                        className={`relative rounded-2xl border transition-all duration-300 overflow-hidden bg-white
                        ${isExpanded || isHighlighted
                                ? 'border-blue-200 shadow-lg shadow-blue-500/5 ring-1 ring-blue-100'
                                : 'border-slate-200 hover:border-blue-200 hover:shadow-md'
                            }
                        ${isHighlighted ? 'ring-2 ring-blue-200 ring-offset-2' : ''}
                        `}
                    >
                        {/* Header Area (Always Visible) */}
                        <button
                            onClick={onToggle}
                            className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 outline-none focus:bg-slate-50 transition-colors"
                        >
                            <div className="space-y-3 flex-1">
                                {/* Role & Company */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <EditableText
                                            id={`timeline-${item.id}-role`}
                                            value={item.role}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </h3>

                                    <span className="hidden md:inline text-slate-300 mx-1">•</span>

                                    <span
                                        className="flex items-center gap-1.5 text-sm font-medium"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <Building2 size={14} />
                                        {item.company}
                                    </span>
                                </div>

                                {/* Summary */}
                                {item.summary && (
                                    <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                                        <EditableText
                                            id={`timeline-${item.id}-summary`}
                                            value={item.summary}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </p>
                                )}

                                {/* Key Outcomes */}
                                {item.keyOutcomes && item.keyOutcomes.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                        {item.keyOutcomes.map((outcome, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                                                <span className="text-green-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                                <span style={{ color: 'var(--text-primary)' }}>{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Tech Tags */}
                                {item.techTags && item.techTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                        {item.techTags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-[11px] font-medium border bg-white text-slate-600 border-slate-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Expand Toggle Icon */}
                            <div className="flex flex-col items-center justify-center gap-1 pl-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                    {isExpanded ? '收起' : '展开'}
                                </span>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-100 rotate-180' : 'bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600'}`}
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </button>

                        {/* Expanded Details - Corrected Schema */}
                        <AnimatePresence>
                            {isExpanded && item.expandedDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/30">
                                        <div className="space-y-6 pt-4">
                                            {/* Problem */}
                                            {item.expandedDetails.problem && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Challenges</h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {item.expandedDetails.problem}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Solution */}
                                            {item.expandedDetails.solution && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Solution Architecture</h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {item.expandedDetails.solution}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Result */}
                                            {item.expandedDetails.result && (
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Business Impact</h4>
                                                    <div className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                                                        <span>{item.expandedDetails.result}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default TimelineItem;
