'use client';

import { useEffect, useMemo, useRef } from 'react';
import { m as motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Building2, Handshake, UserRoundSearch, type LucideIcon } from 'lucide-react';
import { AudienceCard } from '@/types';
import { Container } from './ui/Container';
import { Section } from './ui/Section';
import { trackAudiencePathSelect, trackRoleSectionView } from '@/lib/analytics';

interface AudienceHubProps {
    cards: AudienceCard[];
}

const iconMap: Record<AudienceCard['id'], LucideIcon> = {
    hr: BriefcaseBusiness,
    jobSeeker: UserRoundSearch,
    partner: Handshake,
    client: Building2,
};

function smoothScrollToSection(sectionId: AudienceCard['targetSection']): boolean {
    if (typeof window === 'undefined') return false;
    const target = document.getElementById(sectionId);
    if (!target) return false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
    });

    const hash = `#${sectionId}`;
    if (window.location.hash !== hash) {
        window.history.replaceState(null, '', hash);
    }
    return true;
}

export default function AudienceHub({ cards }: AudienceHubProps) {
    const seenRoleExposure = useRef<Set<AudienceCard['id']>>(new Set());
    const cardRefs = useRef<Record<string, HTMLElement | null>>({});

    const validCards = useMemo(
        () => cards.filter((card) => Boolean(card?.id && card?.targetSection && card?.title)),
        [cards],
    );

    useEffect(() => {
        if (validCards.length === 0) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const role = entry.target.getAttribute('data-role') as AudienceCard['id'] | null;
                    if (!role || seenRoleExposure.current.has(role)) return;
                    seenRoleExposure.current.add(role);
                    trackRoleSectionView(role, 'audience');
                });
            },
            { threshold: 0.25 },
        );

        validCards.forEach((card) => {
            const el = cardRefs.current[card.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [validCards]);

    return (
        <Section id="audience" className="scroll-mt-20 bg-white/60 backdrop-blur-sm">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="mb-10 md:mb-12"
                >
                    <h2 className="mb-4 text-3xl font-bold text-slate-900">按角色快速进入</h2>
                    <p className="max-w-3xl text-base text-slate-600 md:text-lg">
                        面向 HR、求职者、合作伙伴与客户，提供最短信息路径与可验证证据入口。
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {validCards.map((card, index) => {
                        const Icon = iconMap[card.id] || BriefcaseBusiness;
                        return (
                            <motion.article
                                key={card.id}
                                ref={(el) => {
                                    cardRefs.current[card.id] = el;
                                }}
                                data-role={card.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.4 }}
                                className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-colors hover:border-blue-200"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                                </div>

                                <p className="mb-4 text-sm leading-relaxed text-slate-600 md:text-base">{card.focus}</p>

                                <ul className="mb-5 space-y-2">
                                    {card.highlightMetrics.map((item) => (
                                        <li key={item} className="text-sm text-slate-700">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        aria-label={`${card.title} 快速路径`}
                                        onClick={() => {
                                            const success = smoothScrollToSection(card.targetSection);
                                            trackAudiencePathSelect(card.id, card.targetSection, success);
                                            if (success) {
                                                window.setTimeout(() => {
                                                    trackRoleSectionView(card.id, card.targetSection);
                                                }, 280);
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        {card.primaryCTA}
                                        <ArrowRight size={16} />
                                    </button>

                                    {card.secondaryCTA && (
                                        <span className="text-xs font-medium text-slate-500">{card.secondaryCTA}</span>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
}
