'use client';

import { motion } from 'framer-motion';
import EditableText from './EditableText';

interface AboutProps {
    content: string;
    onUpdate: (value: string) => void;
}

export default function About({ content, onUpdate }: AboutProps) {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float-delayed" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    关于我
                </motion.h2>

                <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    {/* Glow Border Effect */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-blue-500/50 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-white/[0.08] overflow-hidden">
                        {/* Inner Glow Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

                        {/* Accent Line */}
                        <motion.div
                            className="absolute left-10 top-10 w-1 bg-gradient-to-b from-violet-500 via-fuchsia-500 to-blue-500 rounded-full"
                            initial={{ height: 0 }}
                            whileInView={{ height: 80 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />

                        <div className="relative z-10 pl-8">
                            <EditableText
                                id="about-content"
                                value={content}
                                onChange={(_, value) => onUpdate(value)}
                                className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light break-words"
                                as="p"
                                multiline
                            />
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute bottom-6 right-6 w-20 h-20">
                            <div className="absolute bottom-0 right-0 w-16 h-[1px] bg-gradient-to-l from-zinc-600 to-transparent" />
                            <div className="absolute bottom-0 right-0 h-16 w-[1px] bg-gradient-to-t from-zinc-600 to-transparent" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
