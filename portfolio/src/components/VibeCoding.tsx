'use client';

import { VibeCodingData } from '@/types';
import { Sparkles, Code, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableText from './EditableText';

interface VibeCodingProps {
    data: VibeCodingData;
    onUpdate: (field: keyof VibeCodingData, value: string) => void;
}

export default function VibeCoding({ data, onUpdate }: VibeCodingProps) {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated Border Glow */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 rounded-3xl opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 rounded-3xl opacity-20 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

                    {/* Card */}
                    <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-violet-500/20 overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

                        {/* Floating Sparkles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute pointer-events-none"
                                aria-hidden="true"
                                style={{
                                    left: `${10 + i * 20}%`,
                                    top: `${20 + (i % 3) * 25}%`,
                                }}
                                animate={{
                                    y: [0, -15, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3,
                                }}
                            >
                                <Sparkles className="w-4 h-4 text-violet-400/50" />
                            </motion.div>
                        ))}

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <motion.div
                                    className="p-3 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl border border-violet-500/30"
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(139, 92, 246, 0.3)',
                                            '0 0 40px rgba(139, 92, 246, 0.5)',
                                            '0 0 20px rgba(139, 92, 246, 0.3)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <Code className="w-6 h-6 text-violet-400" />
                                </motion.div>
                                <EditableText
                                    id="vibe-title"
                                    value={data.title}
                                    onChange={(_, value) => onUpdate('title', value)}
                                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
                                    as="h2"
                                />
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                </motion.div>
                            </div>

                            {/* Description */}
                            <EditableText
                                id="vibe-description"
                                value={data.description}
                                onChange={(_, value) => onUpdate('description', value)}
                                className="text-lg text-zinc-300 leading-relaxed break-words"
                                as="p"
                                multiline
                            />

                            {/* Tags */}
                            <motion.div
                                className="flex flex-wrap gap-3 mt-8"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                {['AI Coding', 'Cursor', 'Claude', 'Automation'].map((tag, i) => (
                                    <motion.span
                                        key={tag}
                                        className="px-4 py-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/30 rounded-full hover:bg-violet-500/20 hover:border-violet-500/50 transition-all duration-300 cursor-default"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        whileHover={{ y: -2, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
