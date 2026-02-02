'use client';

import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HeroData, ContactData } from '@/types';
import EditableText from './EditableText';
import { Container } from './ui/Container';
import { AppointmentModal } from './AppointmentModal';
import { HeroStatusBadges } from './Hero/HeroStatusBadges';
import { HeroQuickFacts } from './Hero/HeroQuickFacts';
import { HeroBullets } from './Hero/HeroBullets';
import { HeroCTA } from './Hero/HeroCTA';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';

// 懒加载背景动画组件，减少首屏负担
const HeroBackground = lazy(() => import('./HeroBackground'));

interface HeroProps {
    data: HeroData;
    contactData?: ContactData;
    isEditorActive?: boolean;
}

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { 
        duration: HERO_ANIMATION.FADE_IN.duration, 
        ease: EASING_CURVES.OUT_EXPO 
    }
};

export default function Hero({ data, contactData, isEditorActive = false }: HeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="relative pt-20 pb-20 min-[380px]:pt-24 md:pt-32 lg:pt-48 md:pb-32 overflow-hidden hero-grid noise-layer">
                {/* Background Decor - 懒加载减少首屏负担 */}
                <Suspense fallback={
                    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-40 -translate-x-1/4 translate-y-1/4" />
                    </div>
                }>
                    <HeroBackground />
                </Suspense>

                <Container className="relative">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                        {/* Left Content */}
                        <div className="lg:col-span-7 flex flex-col items-start">
                            {/* Status Badges */}
                            <HeroStatusBadges location={data.location} />

                            {/* Heading */}
                            <motion.h1
                                {...fadeIn}
                                transition={{ 
                                    ...fadeIn.transition,
                                    delay: HERO_ANIMATION.DELAY_TITLE 
                                }}
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
                                transition={{ 
                                    ...fadeIn.transition,
                                    delay: HERO_ANIMATION.DELAY_PROPOSITION 
                                }}
                                className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl"
                            >
                                打造高性能、可访问的全栈产品
                            </motion.p>

                            {/* Bullets */}
                            <HeroBullets bullets={data.bullets} isEditorActive={isEditorActive} />

                            {/* CTAs */}
                            <HeroCTA onOpenModal={() => setIsModalOpen(true)} />
                        </div>

                        {/* Right Card (Quick Facts) */}
                        <div className="lg:col-span-5 w-full relative">
                            <HeroQuickFacts quickFacts={data.quickFacts} />
                        </div>
                    </div>

                    {/* Scroll Hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: HERO_ANIMATION.DELAY_SCROLL }}
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
