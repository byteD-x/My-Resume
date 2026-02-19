'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { defaultPortfolioData } from '@/data';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import Footer from '@/components/Footer';
import FloatingResumeButton from '@/components/FloatingResumeButton';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { DarkModeCursorGlow } from '@/components/ui/CursorGlow';
import { clearScrollRestore, readScrollRestore } from '@/lib/scroll-restore';
import { useLowPerformanceMode } from '@/hooks/useLowPerformanceMode';

const Services = dynamic(() => import('@/components/Services'), {
    loading: () => <div className="h-96 rounded-2xl bg-slate-50 animate-pulse" aria-hidden="true" />,
});

const ProjectList = dynamic(
    () => import('@/components/ProjectList').then((mod) => mod.ProjectList),
    {
        loading: () => <div className="h-96 rounded-2xl bg-slate-50 animate-pulse" aria-hidden="true" />,
    },
);

const TechStack = dynamic(() => import('@/components/TechStack'), {
    loading: () => <div className="h-96 rounded-2xl bg-slate-900 animate-pulse" aria-hidden="true" />,
});

const Timeline = dynamic(
    () => import('@/components/Timeline/TimelineNew').then((mod) => ({ default: mod.Timeline })),
    {
        ssr: true,
        loading: () => (
            <div className="space-y-6 animate-pulse" role="status" aria-label="加载中">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-36 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-100 to-slate-50"
                        style={{ animationDelay: `${i * 100}ms` }}
                        aria-hidden="true"
                    />
                ))}
                <span className="sr-only">正在加载职业履历...</span>
            </div>
        ),
    },
);

const HighlightDeck = dynamic(() => import('@/components/HighlightDeck'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-50/50" />,
});

const Contact = dynamic(() => import('@/components/Contact'), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-50/50" />,
});

const EngineeringCommandCenter = dynamic(() => import('@/components/EngineeringCommandCenter'), {
    ssr: false,
    loading: () => null,
});

function extractTimelineSortKey(period: string): number {
    const match = period.match(/(\d{4})(?:\.(\d{1,2}))?/);
    if (!match) return Number.NEGATIVE_INFINITY;

    const year = Number(match[1]);
    const month = Number(match[2] ?? '1');
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
        return Number.NEGATIVE_INFINITY;
    }

    return year * 100 + Math.min(Math.max(month, 1), 12);
}

export default function HomePageClient() {
    const data = defaultPortfolioData;
    const isLowPerformanceMode = useLowPerformanceMode();
    const timelineByDate = useMemo(() => {
        return [...data.timeline].sort((a, b) => extractTimelineSortKey(b.year) - extractTimelineSortKey(a.year));
    }, [data.timeline]);

    useEffect(() => {
        const state = readScrollRestore();
        if (!state || typeof window === 'undefined') return;

        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (state.path && state.path !== currentPath) return;

        const restoreScroll = () => {
            if (typeof state.y === 'number' && Number.isFinite(state.y)) {
                window.scrollTo({ top: state.y, behavior: 'smooth' });
            } else if (state.section) {
                const target = document.getElementById(state.section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            clearScrollRestore();
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(restoreScroll);
        });
    }, []);

    return (
        <main className="relative min-h-screen bg-slate-50/30">
            <Navbar heroData={data.hero} contactData={data.contact} />
            {!isLowPerformanceMode && <ScrollProgressBar />}
            {!isLowPerformanceMode && <DarkModeCursorGlow />}

            <Hero data={data.hero} />

            <MotionWrapper delay={0.1}>
                <Section id="impact" className="scroll-mt-20">
                    <Container>
                        <HighlightDeck items={data.impact} timeline={timelineByDate} />
                    </Container>
                </Section>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
                <Section id="experience" className="scroll-mt-20 bg-white/50 backdrop-blur-sm">
                    <Container>
                        <div className="mb-16">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900">职业履历</h2>
                            <p className="max-w-2xl text-lg text-slate-600">
                                优先展示 5 段核心经历，其余经历作为补充背景，便于快速判断岗位匹配度。
                            </p>
                        </div>
                        <Timeline items={timelineByDate} />
                    </Container>
                </Section>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
                <Section id="projects" className="scroll-mt-20 bg-slate-50/50">
                    <Container>
                        <div className="mb-12">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900">项目经历</h2>
                            <p className="max-w-2xl text-lg text-slate-600">
                                个人开源项目 / 创业项目 / 实验性产品。
                            </p>
                        </div>
                        <ProjectList items={data.projects} />
                    </Container>
                </Section>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
                <Services services={data.services} />
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
                <TechStack skills={data.skills} vibeCoding={data.vibeCoding} />
            </MotionWrapper>

            <MotionWrapper delay={0.1}>
                <Contact contactData={data.contact} />
            </MotionWrapper>

            <EngineeringCommandCenter />
            <FloatingResumeButton />

            <Footer name={data.hero.name} githubUrl={data.contact.github} />
        </main>
    );
}
