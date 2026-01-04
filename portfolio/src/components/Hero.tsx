'use client';

import { HeroData } from '@/types';
import { motion } from 'framer-motion';
import EditableText from './EditableText';

interface HeroProps {
    data: HeroData;
    onUpdate: (field: keyof HeroData, value: string) => void;
}

export default function Hero({ data, onUpdate }: HeroProps) {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 pt-32 relative overflow-hidden">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-600/25 via-sky-600/15 to-transparent rounded-full blur-3xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-600/12 via-fuchsia-600/8 to-transparent rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-emerald-400'
                            }`}
                        style={{
                            left: `${20 + i * 12}%`,
                            top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Main Title */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <EditableText
                        id="hero-title"
                        value={data.title}
                        onChange={(_, value) => onUpdate('title', value)}
                        className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-tight leading-[1.05] mb-6 break-words"
                        as="h1"
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <EditableText
                        id="hero-subtitle"
                        value={data.subtitle}
                        onChange={(_, value) => onUpdate('subtitle', value)}
                        className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto break-words"
                        as="p"
                    />
                </motion.div>

                {/* Decorative Gradient Line */}
                <motion.div
                    className="mt-10 mx-auto h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Tech Stack Pills */}
                <motion.div
                    className="mt-10 flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    {['Python', 'AI', 'Backend', 'Cloud'].map((tech, i) => (
                        <motion.span
                            key={tech}
                            className="px-4 py-2 text-sm text-zinc-400 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 cursor-default"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + i * 0.1 }}
                            whileHover={{ y: -2 }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
            >
                <motion.div
                    className="w-6 h-10 rounded-full border-2 border-zinc-600/50 flex items-start justify-center p-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <motion.div
                        className="w-1 h-2 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
