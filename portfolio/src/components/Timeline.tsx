'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TimelineItem } from '@/types';
import EditableText from './EditableText';

interface TimelineProps {
    items: TimelineItem[];
    onUpdate: (index: number, field: string, value: string) => void;
    onUpdateDetail: (index: number, detailIndex: number, value: string) => void;
}

export default function Timeline({ items, onUpdate, onUpdateDetail }: TimelineProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="relative">
            {/* Glowing Timeline Line */}
            <div
                className="absolute left-4 top-2 bottom-2 w-px timeline-line pointer-events-none"
                aria-hidden="true"
            />

            <div className="space-y-8">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="relative pl-14"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {/* Neon Node */}
                        <motion.div
                            className="absolute left-2 top-8 w-5 h-5 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.7 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <motion.div
                                className={`
                                    relative w-3 h-3 rounded-full transition-all duration-500
                                    ${expandedIndex === index
                                        ? 'bg-violet-500 text-violet-400 shadow-lg shadow-violet-500/50'
                                        : 'bg-zinc-600 text-zinc-500 hover:bg-zinc-500'
                                    }
                                `}
                            >
                                {expandedIndex === index && (
                                    <span className="timeline-ping" aria-hidden="true" />
                                )}
                                {expandedIndex === index && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-violet-400"
                                        animate={{
                                            scale: [1, 2, 1],
                                            opacity: [0.6, 0, 0.6],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Card */}
                        <motion.div
                            className={`
                                relative group cursor-pointer
                                bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6
                                border border-white/[0.06]
                                transition-all duration-500
                                ${expandedIndex === index
                                    ? 'bg-white/[0.04] border-violet-500/30 shadow-lg shadow-violet-500/10'
                                    : 'hover:bg-white/[0.04] hover:border-white/[0.1]'
                                }
                            `}
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            layout
                            whileHover={{ x: 4 }}
                        >
                            {/* Hover Glow */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-blue-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10" />

                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className="text-sm font-medium text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
                                            {item.year}
                                        </span>
                                        <EditableText
                                            id={`timeline-${index}-role`}
                                            value={item.role}
                                            onChange={(_, value) => onUpdate(index, 'role', value)}
                                            className="text-lg font-semibold text-white break-words font-heading"
                                            as="span"
                                        />
                                    </div>
                                    <EditableText
                                        id={`timeline-${index}-company`}
                                        value={item.company}
                                        onChange={(_, value) => onUpdate(index, 'company', value)}
                                        className="text-zinc-400 mb-3 break-words"
                                        as="p"
                                    />
                                    <EditableText
                                        id={`timeline-${index}-summary`}
                                        value={item.summary}
                                        onChange={(_, value) => onUpdate(index, 'summary', value)}
                                        className="text-zinc-300 leading-relaxed break-words"
                                        as="p"
                                    />
                                </div>

                                {/* Expand Button */}
                                <motion.div
                                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`
                                        flex-shrink-0 w-8 h-8 rounded-full 
                                        flex items-center justify-center
                                        transition-all duration-300
                                        ${expandedIndex === index
                                            ? 'bg-violet-500/20 text-violet-400'
                                            : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50'
                                        }
                                    `}
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-5 mt-5 border-t border-zinc-800">
                                            <ul className="space-y-3">
                                                {item.details.map((detail, detailIndex) => (
                                                    <motion.li
                                                        key={detailIndex}
                                                        className="flex items-start gap-3"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: detailIndex * 0.05 }}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 mt-2.5 flex-shrink-0" />
                                                        <EditableText
                                                            id={`timeline-${index}-detail-${detailIndex}`}
                                                            value={detail}
                                                            onChange={(_, value) => onUpdateDetail(index, detailIndex, value)}
                                                            className="text-zinc-400 leading-relaxed break-words flex-1"
                                                            as="span"
                                                        />
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
