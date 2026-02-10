'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { Download, Github, Mail, Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProgressBar } from '@/components/ProgressBar';
import { useHydrated } from '@/hooks/useHydrated';
import { ContactData, HeroData } from '@/types';
import {
    createResumeDownloadHandler,
    formatResumeFileName,
    getResumeDownloadUrl,
} from '@/lib/resume';
import { trackCTAClick, trackExternalLink, trackResumeDownload } from '@/lib/analytics';
import { useScrollPastThreshold } from '@/lib/scroll-observer';
import { cn } from '@/lib/utils';

interface NavbarProps {
    heroData: HeroData;
    contactData: ContactData;
}

const navItems = [
    { name: '角色入口', href: '#audience' },
    { name: '影响力', href: '#impact' },
    { name: '经历', href: '#experience' },
    { name: '技能', href: '#skills' },
    { name: '联系', href: '#contact' },
];

export default function Navbar({ heroData, contactData }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const scrolled = useScrollPastThreshold(50);
    const isHydrated = useHydrated();

    const resumeFileName = formatResumeFileName(heroData.title, heroData.name);
    const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
    const resumeDownloadHandler = createResumeDownloadHandler(resumeFileName, resumeDownloadUrl);

    const scrollTo = (href: string) => {
        setIsOpen(false);
        if (typeof window === 'undefined') return;

        const targetId = href.startsWith('#') ? href.slice(1) : href;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const scrollBehavior: ScrollBehavior = prefersReducedMotion || coarsePointer ? 'auto' : 'smooth';
        const maxAttempts = 6;
        const attemptScroll = (attempt: number) => {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
                if (window.location.hash !== href) {
                    window.history.replaceState(null, '', href);
                }
                return;
            }

            if (attempt >= maxAttempts) return;
            window.setTimeout(() => attemptScroll(attempt + 1), 60);
        };

        attemptScroll(0);
    };

    const handleResumeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        trackCTAClick('resume_download', 'navbar');
        trackResumeDownload();
        resumeDownloadHandler?.(event);
    };

    const handleContactClick = () => {
        trackCTAClick('contact', 'navbar');
        scrollTo('#contact');
    };

    const handleGithubClick = () => {
        trackExternalLink(contactData.github, 'navbar_github');
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' },
        );

        navItems.forEach((item) => {
            const element = document.getElementById(item.href.slice(1));
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <nav
            data-print="hide"
            className={cn(
                'fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300',
                scrolled
                    ? 'border-slate-200/50 bg-glass-strong py-3 shadow-md backdrop-blur-md'
                    : 'border-transparent bg-transparent py-5',
            )}
        >
            <ProgressBar className={cn('opacity-0 transition-opacity duration-300', scrolled && 'opacity-100')} />
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-200/80 to-transparent opacity-0 transition-opacity duration-300',
                    scrolled && 'opacity-100',
                )}
            />

            <Container>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group flex items-center gap-3"
                    >
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md ring-1 ring-white/30 transition-transform group-hover:scale-105',
                                scrolled && 'scale-90',
                            )}
                        >
                            DXJ
                        </div>
                        <div className="hidden text-left sm:block">
                            <div className="mb-1 font-semibold leading-none text-slate-800">{heroData.name}</div>
                            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] animate-pulse" />
                                Available
                            </div>
                            <div className="text-xs font-medium text-slate-500">后端 / AI 工程师</div>
                        </div>
                    </button>

                    <div className="hidden items-center gap-1 rounded-full border border-slate-200/50 bg-slate-100/50 p-1 md:flex">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.href.slice(1);
                            return (
                                <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => scrollTo(item.href)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        'link-underline rounded-full px-5 py-2 text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900',
                                    )}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        <a
                            href={contactData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleGithubClick}
                            className="rounded-full p-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Visit GitHub profile"
                        >
                            <Github size={20} />
                        </a>

                        <a
                            href={resumeDownloadUrl}
                            download={resumeFileName}
                            onClick={handleResumeClick}
                            className="btn btn-secondary gap-2 px-5 py-2.5 text-sm font-semibold"
                            aria-label="Download resume PDF"
                        >
                            <Download size={16} />
                            下载简历
                        </a>

                        <button
                            type="button"
                            onClick={handleContactClick}
                            className="btn btn-primary gap-2 px-5 py-2.5 text-sm font-semibold"
                            aria-label="Contact"
                        >
                            <Mail size={16} />
                            联系我
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => {
                                trackCTAClick('contact', 'navbar_mobile_quick');
                                scrollTo('#contact');
                            }}
                            disabled={!isHydrated}
                            aria-label="Contact"
                            className={cn(
                                'inline-flex rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60',
                                isOpen && 'hidden',
                            )}
                        >
                            <Mail size={18} />
                            <span className="sr-only">联系</span>
                        </button>

                        <button
                            type="button"
                            className="p-3 text-slate-600"
                            disabled={!isHydrated}
                            onClick={() => setIsOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </Container>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm md:hidden"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 right-0 top-0 z-50 flex w-3/4 max-w-sm flex-col bg-white shadow-2xl md:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 p-5">
                                <span className="text-lg font-bold text-slate-800">菜单</span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-2 overflow-y-auto p-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => scrollTo(item.href)}
                                        className="w-full rounded-xl px-4 py-4 text-left text-base font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-slate-100 p-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        trackCTAClick('contact', 'navbar_mobile_menu');
                                        scrollTo('#contact');
                                    }}
                                    className="btn btn-primary w-full py-3.5 font-bold"
                                >
                                    <Mail size={18} />
                                    联系我
                                </button>

                                <a
                                    href={resumeDownloadUrl}
                                    download={resumeFileName}
                                    onClick={handleResumeClick}
                                    className="btn btn-secondary w-full py-3.5 font-semibold"
                                >
                                    下载简历
                                </a>

                                <div className="flex justify-center gap-4">
                                    <a
                                        href={contactData.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleGithubClick}
                                        className="rounded-full bg-slate-100 p-3 text-slate-600"
                                        aria-label="Open GitHub"
                                    >
                                        <Github size={20} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
