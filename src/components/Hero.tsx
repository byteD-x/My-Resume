'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Download, Calendar as CalendarIcon, ChevronDown, MapPin, Briefcase, Calendar
} from 'lucide-react';
import { HeroData, ContactData } from '@/types';
import EditableText from './EditableText';
import { Container } from './ui/Container';
import { Badge } from './ui/Badge';
import { AppointmentModal } from './AppointmentModal';

interface HeroProps {
    data: HeroData;
    contactData?: ContactData;
    isEditorActive?: boolean;
}

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
};

export default function Hero({ data, contactData, isEditorActive = false }: HeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="relative pt-20 pb-20 min-[380px]:pt-24 md:pt-32 lg:pt-48 md:pb-32 overflow-hidden hero-grid noise-layer">
                {/* Background Decor */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/60 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50/60 dark:bg-fuchsia-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
                </div>

                <Container className="relative">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                        {/* Left Content */}
                        <div className="lg:col-span-7 flex flex-col items-start">
                            {/* Status Badges */}
                            <motion.div
                                {...fadeIn}
                                className="flex flex-wrap items-center gap-3 mb-6"
                            >
                                <Badge variant="accent" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3.5 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                                    可立即入职
                                </Badge>
                                <Badge variant="outline" className="py-1.5 px-3.5 text-sm font-normal text-slate-500 bg-white shadow-sm">
                                    <MapPin size={14} className="mr-1.5 opacity-70" />
                                    {data.location || "深圳 / 南京 / 西安 / 杭州 / 成都"}
                                </Badge>
                            </motion.div>

                            {/* Heading */}
                            <motion.h1
                                {...fadeIn}
                                transition={{ delay: 0.1 }}
                                className="text-3xl min-[380px]:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] text-balance"
                            >
                                <EditableText
                                    id="hero-title"
                                    value={data.title}
                                    onChange={() => { }}
                                    isEditorActive={isEditorActive}
                                />
                            </motion.h1>

                            {/* Value Proposition */}
                            <motion.p
                                {...fadeIn}
                                transition={{ delay: 0.15 }}
                                className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl"
                            >
                                打造高性能、可访问的全栈产品
                            </motion.p>

                            {/* Bullets */}
                            <motion.div
                                {...fadeIn}
                                transition={{ delay: 0.2 }}
                                className="space-y-4 mb-10 max-w-2xl"
                            >
                                {data.bullets.map((bullet, index) => (
                                    <div key={bullet.id} className="flex gap-4 group">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                                        <div className="text-lg text-slate-600 leading-relaxed">
                                            <strong className="font-semibold text-slate-900 mr-2">
                                                <EditableText
                                                    id={`hero-bullet-${index}-title`}
                                                    value={bullet.title}
                                                    onChange={() => { }}
                                                    as="span"
                                                    isEditorActive={isEditorActive}
                                                />
                                            </strong>
                                            <EditableText
                                                id={`hero-bullet-${index}-desc`}
                                                value={bullet.description}
                                                onChange={() => { }}
                                                as="span"
                                                isEditorActive={isEditorActive}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                {...fadeIn}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap gap-4"
                                data-print="hide"
                            >
                                <a
                                    href="/resume.pdf"
                                    download
                                    data-print="hide"
                                    className="btn btn-primary px-8 py-3.5 text-base font-bold"
                                    aria-label="下载 PDF 简历"
                                >
                                    <Download size={20} className="mr-2.5" />
                                    下载 PDF 简历
                                </a>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn btn-secondary px-8 py-3.5 text-base font-semibold"
                                    aria-label="预约面谈"
                                >
                                    <CalendarIcon size={20} className="mr-2.5" />
                                    预约面谈
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Card (Quick Facts) */}
                        <div className="lg:col-span-5 w-full relative">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="glass-light rounded-2xl shadow-2xl shadow-slate-200/50 p-6 md:p-8"
                            >
                                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-200" />
                                    核心信息
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-slate-50 text-slate-600 shrink-0">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-slate-400 font-semibold mb-1">岗位方向</div>
                                            <div className="text-lg font-bold text-slate-900">
                                                {data.quickFacts?.role || "后端 / 全栈 / AI 工程"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-slate-400 font-semibold mb-1">入职时间</div>
                                            <div className="text-lg font-bold text-emerald-600">
                                                {data.quickFacts?.availability || "可立即入职"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="text-xs uppercase text-slate-400 font-semibold mb-3">核心技术栈</div>
                                        <div className="flex flex-wrap gap-2">
                                            {(data.quickFacts?.techStack || ['Java', 'Spring', 'Python', 'LLM API', 'MySQL', 'Redis']).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-full border border-slate-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-400"
                    >
                        <span className="text-xs font-medium tracking-widest uppercase">向下探索</span>
                        <ChevronDown className="animate-bounce" />
                    </motion.div>
                </Container>
            </section>

            {/* Appointment Modal */}
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
