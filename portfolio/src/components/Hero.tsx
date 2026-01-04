import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { HeroData } from '@/types';
import EditableText from './EditableText';

interface HeroProps {
    data: HeroData;
    onUpdate: (field: keyof HeroData, value: string) => void;
}

export default function Hero({ data, onUpdate }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden bg-[#FAFAFA]">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-zinc-100 to-transparent z-0" />

            <div className="container-padding w-full relative z-10">
                <div className="max-w-4xl space-y-12">
                    {/* Role / Availability - Editorial Layout */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="h-[1px] w-12 bg-zinc-900/20"></div>
                        <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                            Available for hire
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-display text-zinc-900 leading-[1.05]">
                                <EditableText
                                    id="hero-name"
                                    value={data.name}
                                    onChange={(_, val) => onUpdate('name', val)}
                                    as="span"
                                    className="block"
                                />
                            </h1>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-5xl text-zinc-400 font-light tracking-tight"
                        >
                            <EditableText
                                id="hero-title"
                                value={data.title}
                                onChange={(_, val) => onUpdate('title', val)}
                                as="span"
                            />
                        </motion.h2>
                    </div>

                    {/* Subtitle / Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-editorial max-w-2xl text-zinc-600"
                    >
                        <EditableText
                            id="hero-subtitle"
                            value={data.subtitle}
                            onChange={(_, val) => onUpdate('subtitle', val)}
                            as="span"
                        />
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6 pt-4"
                    >
                        <a
                            href="#contact"
                            className="btn-primary flex items-center justify-center gap-2 group"
                        >
                            Start a Project
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors"
                        >
                            Resume
                            <Download size={18} />
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Grid or Abstract Element */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                {/* Simple Geometric Texture */}
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                    <path d="M400 0H0V400H400V0Z" fill="url(#grid)" />
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M40 0H0V40" stroke="black" strokeWidth="1" />
                        </pattern>
                    </defs>
                </svg>
            </div>
        </section>
    );
}
