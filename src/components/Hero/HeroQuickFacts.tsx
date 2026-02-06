'use client';

import { m as motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { HeroData } from '@/types';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';

interface HeroQuickFactsProps {
    quickFacts?: HeroData['quickFacts'];
}

/**
 * Hero 快速信息卡片组件
 * 显示角色、入职时间、技术栈等核心信息
 */
export function HeroQuickFacts({ quickFacts }: HeroQuickFactsProps) {
    const defaultQuickFacts = {
        role: "后端 / 全栈 / AI 工程",
        availability: "可立即入职",
        techStack: ['Java', 'Spring', 'Python', 'LLM API', 'MySQL', 'Redis']
    };

    const facts = quickFacts || defaultQuickFacts;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
                delay: HERO_ANIMATION.DELAY_CARD, 
                duration: 0.6,
                ease: EASING_CURVES.OUT_EXPO
            }}
            className="bg-glass-strong backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 p-6 md:p-8 border border-white/50"
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
                        <div className="text-lg font-bold text-slate-900">{facts.role}</div>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-xs uppercase text-slate-400 font-semibold mb-1">入职时间</div>
                        <div className="text-lg font-bold text-emerald-600">{facts.availability}</div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="text-xs uppercase text-slate-400 font-semibold mb-3">核心技术栈</div>
                    <div className="flex flex-wrap gap-2">
                        {facts.techStack.map(tag => (
                            <span 
                                key={tag} 
                                className="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-full border border-slate-100"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
