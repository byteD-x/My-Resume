'use client';

import React, { Suspense, lazy, useState } from 'react';
import { m as motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HeroData } from '@/types';
import { Container } from './ui/Container';
import { AppointmentModal } from './AppointmentModal';
import { HeroStatusBadges } from './Hero/HeroStatusBadges';
import { HeroQuickFacts } from './Hero/HeroQuickFacts';
import { HeroBullets } from './Hero/HeroBullets';
import { HeroCTA } from './Hero/HeroCTA';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';
import { createResumeDownloadHandler, formatResumeFileName, getResumeDownloadUrl } from '@/lib/resume';

const HeroBackground = lazy(() => import('./HeroBackground'));

interface HeroProps {
    data: HeroData;
}

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: HERO_ANIMATION.FADE_IN.duration,
        ease: EASING_CURVES.OUT_EXPO,
    },
};

export default function Hero({ data }: HeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const resumeFileName = formatResumeFileName(data.title, data.name);
    const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
    const resumeDownloadHandler = createResumeDownloadHandler(resumeFileName, resumeDownloadUrl);

    return (
        <>
            <section className="hero-grid noise-layer relative overflow-hidden pt-20 pb-20 min-[380px]:pt-24 md:pt-32 md:pb-32 lg:pt-48">
                <Suspense
                    fallback={
                        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                            <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 opacity-40 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20" />
                            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 opacity-40 blur-3xl dark:from-emerald-900/20 dark:to-teal-900/20" />
                        </div>
                    }
                >
                    <HeroBackground />
                </Suspense>

                <Container className="relative">
                    <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
                        <div className="flex flex-col items-start lg:col-span-7">
                            <HeroStatusBadges location={data.location} />

                            <motion.h1
                                {...fadeIn}
                                transition={{
                                    ...fadeIn.transition,
                                    delay: HERO_ANIMATION.DELAY_TITLE,
                                }}
                                className="mb-6 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 min-[380px]:text-4xl md:text-5xl lg:text-6xl"
                            >
                                {data.title}
                            </motion.h1>

                            {data.subtitle && (
                                <motion.p
                                    {...fadeIn}
                                    transition={{
                                        ...fadeIn.transition,
                                        delay: HERO_ANIMATION.DELAY_PROPOSITION,
                                    }}
                                    className="mb-4 max-w-2xl text-sm text-slate-500 md:text-base"
                                >
                                    {data.subtitle}
                                </motion.p>
                            )}

                            <motion.p
                                {...fadeIn}
                                transition={{
                                    ...fadeIn.transition,
                                    delay: HERO_ANIMATION.DELAY_PROPOSITION,
                                }}
                                className="mb-8 max-w-2xl text-lg text-slate-600 md:text-xl"
                            >
                                打造高性能、可访问的全栈产品
                            </motion.p>

                            <HeroBullets bullets={data.bullets} />

                            <HeroCTA
                                onOpenModal={() => setIsModalOpen(true)}
                                downloadName={resumeFileName}
                                downloadUrl={resumeDownloadUrl}
                                onDownloadClick={resumeDownloadHandler}
                            />
                        </div>

                        <div className="relative w-full lg:col-span-5">
                            <HeroQuickFacts quickFacts={data.quickFacts} />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: HERO_ANIMATION.DELAY_SCROLL }}
                        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 md:flex"
                    >
                        <span className="text-xs font-medium uppercase tracking-widest">向下探索</span>
                        <ChevronDown className="animate-bounce" />
                    </motion.div>
                </Container>
            </section>

            <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
