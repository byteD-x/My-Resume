'use client';

import { ContactInfo } from '@/types';
import { Mail, Phone, Github, Globe, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactProps {
    contact: ContactInfo;
}

const contactStyles = [
    {
        gradient: 'from-emerald-500 to-teal-500',
        bgGradient: 'from-emerald-500/10 to-teal-500/10',
        border: 'border-emerald-500/20',
        glow: 'hover:shadow-emerald-500/20',
    },
    {
        gradient: 'from-blue-500 to-indigo-500',
        bgGradient: 'from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-500/20',
        glow: 'hover:shadow-blue-500/20',
    },
    {
        gradient: 'from-zinc-400 to-zinc-600',
        bgGradient: 'from-zinc-500/10 to-zinc-700/10',
        border: 'border-zinc-500/20',
        glow: 'hover:shadow-zinc-500/20',
    },
    {
        gradient: 'from-violet-500 to-purple-500',
        bgGradient: 'from-violet-500/10 to-purple-500/10',
        border: 'border-violet-500/20',
        glow: 'hover:shadow-violet-500/20',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

export default function Contact({ contact }: ContactProps) {
    const contactItems = [
        { icon: Phone, label: '电话', value: contact.phone, href: `tel:${contact.phone}` },
        { icon: Mail, label: '邮箱', value: contact.email, href: `mailto:${contact.email}` },
        { icon: Github, label: 'GitHub', value: 'GitHub', href: contact.github },
        { icon: Globe, label: '个人网站', value: 'Website', href: contact.website },
    ];

    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-float-slow" />
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-float-delayed" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.h2
                    className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-14 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    联系方式
                </motion.h2>

                <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Glow Border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-blue-500/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                    {/* Card */}
                    <div className="relative bg-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.06] overflow-hidden">
                        {/* Inner Glow */}
                        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {contactItems.map((item, index) => {
                                const style = contactStyles[index];

                                return (
                                    <motion.a
                                        key={index}
                                        href={item.href}
                                        target={item.href.startsWith('http') ? '_blank' : undefined}
                                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        variants={itemVariants}
                                        className={`
                                            relative flex items-center gap-4 p-5 rounded-2xl
                                            bg-gradient-to-br ${style.bgGradient}
                                            border ${style.border}
                                            ${style.glow}
                                            hover:bg-white/[0.04]
                                            transition-all duration-300
                                            group/item overflow-hidden
                                        `}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Hover Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />

                                        {/* Icon */}
                                        <motion.div
                                            className={`
                                                w-12 h-12 rounded-xl
                                                bg-gradient-to-br ${style.gradient}
                                                flex items-center justify-center
                                                shadow-lg group-hover/item:shadow-xl
                                                transition-all duration-300 relative
                                            `}
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                        >
                                            <item.icon className="w-5 h-5 text-white" />
                                        </motion.div>

                                        <div className="relative min-w-0">
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className="text-white font-medium group-hover/item:text-zinc-200 transition-colors break-all">
                                                {item.value}
                                            </p>
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="flex flex-col items-center justify-center gap-4 mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-4 h-4 text-violet-400" />
                        </motion.div>
                        <p className="text-zinc-500 text-sm">
                            Built with
                        </p>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        </motion.div>
                        <p className="text-zinc-500 text-sm">
                            using Next.js & Tailwind CSS
                        </p>
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            <Sparkles className="w-4 h-4 text-violet-400" />
                        </motion.div>
                    </div>
                    <p className="text-zinc-600 text-sm">
                        © {new Date().getFullYear()} 杜旭嘉. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
