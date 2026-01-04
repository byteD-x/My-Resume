'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Download } from 'lucide-react';
import { HeroData, ContactData } from '@/types';

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
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll spy with IntersectionObserver
    useEffect(() => {
        const sections = ['impact', 'experience', 'skills', 'contact'];

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    // Close mobile menu on navigation
    const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsOpen(false);

        // Smooth scroll
        const targetId = href.replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all border-b"
                style={{
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(16px)' : 'none',
                    borderColor: isScrolled ? 'var(--border-default)' : 'transparent',
                    transitionDuration: 'var(--duration-normal)',
                }}
            >
                <div className="container">
                    <div
                        className="flex items-center justify-between transition-all"
                        style={{
                            height: isScrolled ? 'var(--header-height-mobile)' : 'var(--header-height-desktop)',
                            // Use CSS variable fallback if needed in JS runtime, but relying on CSS class is safer
                            // Explicit heights for js-side transitions if desired, but CSS vars are cleaner.
                            // Let's stick to the CSS vars defined in globals.
                        }}
                    >
                        {/* Logo */}
                        <a
                            href="#"
                            className="flex items-center gap-3 group px-1 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            aria-label="返回顶部"
                        >
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105 shadow-sm"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                DXJ
                            </div>
                            <div className="hidden sm:block">
                                <div
                                    className="font-semibold text-sm leading-none mb-1"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {heroData.name}
                                </div>
                                <div
                                    className="text-xs leading-none"
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    后端 / AI 工程师
                                </div>
                            </div>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Flex gap increased to gap-6 (24px) */}
                            {navItems.map((item) => {
                                const isActive = `#${activeSection}` === item.href;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="relative flex items-center justify-center px-4 font-medium transition-colors rounded-lg hover:bg-slate-50"
                                        style={{
                                            height: '44px', // Touch target
                                            fontSize: '15px',
                                            color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navIndicator"
                                                className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full"
                                                style={{ backgroundColor: 'var(--color-primary)' }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </a>
                                );
                            })}

                            <div
                                className="h-6 w-px mx-4"
                                style={{ backgroundColor: 'var(--border-default)' }}
                            />

                            <div className="flex items-center gap-4">
                                <a
                                    href={contactData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg transition-colors hover:bg-slate-100 flex items-center justify-center"
                                    style={{
                                        color: 'var(--text-secondary)',
                                        width: '44px',
                                        height: '44px'
                                    }}
                                    aria-label="GitHub"
                                >
                                    <Github size={22} />
                                </a>

                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    className="btn btn-primary"
                                    style={{ height: '44px', paddingLeft: '24px', paddingRight: '24px', fontSize: '15px' }}
                                >
                                    <Download size={18} className="mr-2" />
                                    <span>下载简历</span>
                                </a>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg transition-colors flex items-center justify-center"
                            style={{
                                color: 'var(--text-secondary)',
                                backgroundColor: isOpen ? 'var(--bg-muted)' : 'transparent',
                                width: '44px', /* Touch target */
                                height: '44px'
                            }}
                            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed top-0 right-0 bottom-0 w-[280px] z-50 md:hidden overflow-y-auto shadow-2xl"
                        style={{
                            backgroundColor: 'var(--bg-surface)',
                        }}
                    >
                        {/* Mobile menu header */}
                        <div
                            className="flex items-center justify-between p-5 border-b"
                            style={{
                                borderColor: 'var(--border-default)',
                                height: 'var(--header-height-mobile)'
                            }}
                        >
                            <span
                                className="font-semibold text-lg"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                导航
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg flex items-center justify-center hover:bg-slate-100"
                                style={{
                                    color: 'var(--text-secondary)',
                                    width: '44px',
                                    height: '44px'
                                }}
                                aria-label="关闭菜单"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Mobile nav items */}
                        <div className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = `#${activeSection}` === item.href;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="flex items-center px-4 text-base font-medium rounded-xl transition-colors"
                                        style={{
                                            color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                                            backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                                            height: '48px' /* High touch area */
                                        }}
                                    >
                                        {item.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Mobile CTA */}
                        <div
                            className="p-5 border-t space-y-4"
                            style={{ borderColor: 'var(--border-default)', marginTop: 'auto' }}
                        >
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className="btn btn-primary w-full"
                                style={{ height: '48px', fontSize: '16px' }}
                            >
                                <Download size={18} />
                                下载简历 PDF
                            </a>
                            <a
                                href={contactData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary w-full"
                                style={{ height: '48px', fontSize: '16px' }}
                            >
                                <Github size={18} />
                                GitHub
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
