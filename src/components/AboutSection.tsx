'use client';

import { m as motion } from 'framer-motion';
import { Lightbulb, Target, Wrench } from 'lucide-react';
import type { DualLensCopy } from '@/types';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface AboutSectionProps {
    lenses?: DualLensCopy;
}

export default function AboutSection({ lenses }: AboutSectionProps) {
    if (!lenses?.business && !lenses?.engineering) return null;

    return (
        <Section id="about" className="scroll-mt-20 bg-white/60 backdrop-blur-sm">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="mb-10 md:mb-12"
                >
                    <h2 className="mb-4 text-3xl font-bold text-slate-900">你可以快速怎么读我</h2>
                    <p className="max-w-3xl text-base text-slate-600 md:text-lg">
                        左边看业务结果，右边看工程实现。每一条都尽量给出可复核的指标或证据入口。
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {lenses.business && (
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-700">
                                    <Target size={22} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">非技术视角</h3>
                            </div>
                            <MarkdownRenderer tone="default">{lenses.business}</MarkdownRenderer>
                        </motion.article>
                    )}

                    {lenses.engineering && (
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.06 }}
                            className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-6 shadow-sm"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/70 text-blue-700">
                                    <Wrench size={22} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">工程视角</h3>
                            </div>
                            <MarkdownRenderer tone="default">{lenses.engineering}</MarkdownRenderer>
                        </motion.article>
                    )}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <Lightbulb size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">工作方式</div>
                                <div className="text-sm text-slate-600">先基线，后优化；先证据，后结论；先可回滚，再上线。</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">指标可复核</span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">交付可回滚</span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">质量门禁</span>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

