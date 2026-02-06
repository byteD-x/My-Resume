'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Download, Mail } from 'lucide-react';
import { ContactData, HeroData } from '@/types';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createResumeDownloadHandler, formatResumeFileName, getResumeDownloadUrl } from '@/lib/resume';
import { trackCTAClick, trackExternalLink, trackResumeDownload } from '@/lib/analytics';

interface NavbarProps {
    heroData: HeroData;
    contactData: ContactData;
}

const navItems = [
    { name: '量化成果', href: '#impact' },
    { name: '职业履历', href: '#experience' },
    { name: '技术栈', href: '#skills' },
    { name: '联系我', href: '#contact' },
];

export default function Navbar({ heroData, contactData }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const resumeFileName = formatResumeFileName(heroData.title, heroData.name);
    const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
    const resumeDownloadHandler = createResumeDownloadHandler(resumeFileName, resumeDownloadUrl);

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
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll spy
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        navItems.forEach(item => {
            const el = document.getElementById(item.href.substring(1));
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (href: string) => {
        setIsOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            data-print="hide"
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-glass-strong backdrop-blur-md border-slate-200/50 py-3 shadow-md"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <ProgressBar className={cn("opacity-0 transition-opacity duration-300", scrolled && "opacity-100")} />
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-200/80 to-transparent opacity-0 transition-opacity duration-300",
                    scrolled && "opacity-100"
                )}
            />
            <Container>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 group"
                    >
                        <div
                            className={cn(
                                "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-1 ring-white/30 transition-transform group-hover:scale-105",
                                scrolled && "scale-90"
                            )}
                        >
                            DXJ
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="font-semibold text-slate-800 leading-none mb-1">{heroData.name}</div>
                            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] animate-pulse" />
                                Available
                            </div>
                            <div className="text-xs text-slate-500 font-medium">后端 / AI 工程师</div>
                        </div>
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.href.substring(1);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => scrollTo(item.href)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-medium transition-all link-underline",
                                        isActive
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                    )}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href={contactData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleGithubClick}
                            className="p-3 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            aria-label="访问我的 GitHub 主页"
                        >
                            <Github size={20} />
                        </a>
                        <ThemeToggle />
                        <a
                            href={resumeDownloadUrl}
                            download={resumeFileName}
                            onClick={handleResumeClick}
                            className="btn btn-secondary gap-2 px-5 py-2.5 text-sm font-semibold"
                            aria-label="下载简历 PDF"
                        >
                            <Download size={16} />
                            简历 PDF
                        </a>
                        <button
                            onClick={handleContactClick}
                            className="btn btn-primary gap-2 px-5 py-2.5 text-sm font-semibold"
                            aria-label="立即联系"
                        >
                            <Mail size={16} />
                            立即联系
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-3 text-slate-600"
                        onClick={() => setIsOpen(true)}
                        aria-label="打开菜单"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-slate-100">
                                <span className="font-bold text-lg text-slate-800">导航</span>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                                {navItems.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => scrollTo(item.href)}
                                        className="w-full text-left px-4 py-4 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                            <div className="p-5 border-t border-slate-100 space-y-3">
                                <button
                                    onClick={handleContactClick}
                                    className="btn btn-primary w-full py-3.5 font-bold"
                                >
                                    <Mail size={18} />
                                    立即联系
                                </button>
                                <a
                                    href={resumeDownloadUrl}
                                    download={resumeFileName}
                                    onClick={handleResumeClick}
                                    className="btn btn-secondary w-full py-3.5 font-semibold"
                                >
                                    下载简历 PDF
                                </a>
                                <div className="flex gap-4 justify-center">
                                    <a
                                        href={contactData.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleGithubClick}
                                        className="p-3 bg-slate-100 rounded-full text-slate-600"
                                        aria-label="访问 GitHub"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <ThemeToggle className="bg-slate-100" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
