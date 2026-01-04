'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, CheckCircle } from 'lucide-react';
import { HeroData } from '@/types';
import EditableText from './EditableText';

interface HeroProps {
    data: HeroData;
    isEditorActive?: boolean;
}

export default function Hero({ data, isEditorActive = false }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 bg-[#FAFAFA]">
            {/* 柔和渐变背景 */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-zinc-100 to-transparent z-0 pointer-events-none" />

            <div className="container-padding w-full relative z-10">
                <div className="max-w-4xl space-y-10">
                    {/* 状态标签 */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="h-[1px] w-12 bg-zinc-900/20"></div>
                        <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            可立即入职
                        </span>
                    </motion.div>

                    {/* 主标题 */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-display text-zinc-900 leading-[1.1]">
                                <EditableText
                                    id="hero-title"
                                    value={data.title}
                                    onChange={() => { }}
                                    as="span"
                                    className="block"
                                    isEditorActive={isEditorActive}
                                />
                            </h1>
                        </motion.div>

                        {/* 副标题 */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-zinc-500 font-light tracking-tight"
                        >
                            <EditableText
                                id="hero-subtitle"
                                value={data.subtitle}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </motion.h2>
                    </div>

                    {/* 3 个核心能力点 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {data.bullets.map((bullet, index) => (
                            <div
                                key={bullet.id}
                                className="flex items-start gap-3 text-zinc-600"
                            >
                                <CheckCircle size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-semibold text-zinc-900">
                                        <EditableText
                                            id={`hero-bullet-${index}-title`}
                                            value={bullet.title}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </span>
                                    <span className="text-zinc-500">：</span>
                                    <span className="text-zinc-600">
                                        <EditableText
                                            id={`hero-bullet-${index}-desc`}
                                            value={bullet.description}
                                            onChange={() => { }}
                                            as="span"
                                            isEditorActive={isEditorActive}
                                        />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="btn-primary flex items-center justify-center gap-2 group"
                        >
                            下载简历 PDF
                            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                        </a>
                        <a
                            href="#experience"
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors"
                        >
                            查看案例
                            <ArrowRight size={18} />
                        </a>
                    </motion.div>

                    {/* 姓名（编辑器可见） */}
                    {isEditorActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-4 border-t border-zinc-200"
                        >
                            <span className="text-sm text-zinc-400 mr-2">姓名：</span>
                            <EditableText
                                id="hero-name"
                                value={data.name}
                                onChange={() => { }}
                                as="span"
                                className="text-zinc-900 font-medium"
                                isEditorActive={isEditorActive}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* 装饰性网格 */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
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
