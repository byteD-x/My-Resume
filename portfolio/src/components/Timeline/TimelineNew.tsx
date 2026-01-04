'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineItem } from '@/types';
import { Badge } from '../ui/Badge';
import EditableText from '../EditableText';

interface TimelineProps {
    items: TimelineItem[];
    isEditorActive?: boolean;
}

export function Timeline({ items, isEditorActive = false }: TimelineProps) {
    return (
        <div className="relative space-y-12">
            {/* Vertical Line */}
            <div
                className="absolute left-[13px] top-2 bottom-0 w-[2px] bg-slate-200 hidden md:block"
            />

            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: index * 0.1 }}
                    className="relative md:pl-12 group"
                >
                    {/* Timeline Node (Desktop) */}
                    <div
                        className="absolute left-0 top-1.5 w-[28px] h-[28px] bg-white border-[3px] border-slate-200 rounded-full hidden md:flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all z-10"
                    >
                        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full group-hover:bg-blue-600 transition-colors" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        {/* Time & Meta (Mobile: Top; Desktop: Left Side if we wanted split, but here we keep it consolidated for scannability on right) 
                           Update: Per plan Option B "Time next to node" or Option A "Left column".
                           Let's go with a clean "Time on top of content" or "Time in metadata" approach for simplicity and density unless we have huge space.
                           Actually, plan said Option B: "Time in node side, content right".
                        */}

                        <div className="flex-1">
                            {/* Header Group */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-slate-900">
                                            <EditableText
                                                id={`exp-${index}-role`}
                                                value={item.role}
                                                onChange={() => { }}
                                                as="span"
                                                isEditorActive={isEditorActive}
                                            />
                                        </h3>
                                        {item.highlighted && (
                                            <Badge variant="accent" className="bg-blue-50 text-blue-600 border-blue-100 hidden sm:inline-flex">
                                                核心经历
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-base font-medium text-slate-600 mt-1">
                                        <EditableText
                                            id={`exp-${index}-company`}
                                            value={item.company}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </div>
                                </div>

                                <div className="text-sm font-semibold text-slate-500 tabular-nums bg-slate-50 px-3 py-1 rounded-full border border-slate-100 self-start sm:self-center">
                                    <EditableText
                                        id={`exp-${index}-year`}
                                        value={item.year}
                                        onChange={() => { }}
                                        as="span"
                                        isEditorActive={isEditorActive}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-4 text-slate-600 leading-relaxed text-balance">
                                <EditableText
                                    id={`exp-${index}-summary`}
                                    value={item.summary}
                                    onChange={() => { }}
                                    as="p"
                                    isEditorActive={isEditorActive}
                                />
                            </div>

                            {/* Key Outcomes (The "3 hard metrics") */}
                            {item.keyOutcomes && item.keyOutcomes.length > 0 && (
                                <div className="mb-5 grid sm:grid-cols-2 gap-3">
                                    {item.keyOutcomes.map((outcome, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100/50"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <span>{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tech Tags */}
                            {item.techTags && item.techTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {item.techTags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs font-medium text-slate-500 border-slate-200">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
