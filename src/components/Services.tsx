'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Bot, Zap, Workflow } from 'lucide-react';
import { ServiceItem } from '@/types';
import { Section } from './ui/Section';
import { Container } from './ui/Container';

// Map icon strings to components
const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Layout,
    Bot,
    Zap,
    Workflow,
};

interface ServicesProps {
    services: ServiceItem[];
}

export default function Services({ services }: ServicesProps) {
    if (!services || services.length === 0) return null;

    return (
        <Section id="services" className="bg-slate-50/50 dark:bg-slate-900/20">
            <Container>
                <div className="mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            技术服务
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                            以工程化思维解决复杂问题，提供从架构设计到落地的全栈解决方案。
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => {
                        const Icon = IconMap[service.icon] || Layout;
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700 hover:border-blue-500/20 dark:hover:border-blue-500/30 flex flex-col h-full"
                            >
                                {/* Background Gradient Hover Effect */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient || 'from-blue-500/5 to-indigo-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center mb-6 text-slate-700 dark:text-slate-300 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300">
                                        <Icon size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                                        {service.description}
                                    </p>

                                    {service.techStack && (
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                            {service.techStack.map(tech => (
                                                <span
                                                    key={tech}
                                                    className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
}
