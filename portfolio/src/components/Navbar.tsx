'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
            setIsScrolled(window.scrollY > 50);
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
                className="fixed top-0 left-0 right-0 z-50 transition-all"
                style={{
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                    borderBottom: isScrolled ? '1px solid var(--border-default)' : 'none',
                    transitionDuration: 'var(--duration-normal)',
                }}
            >
                <div className="container">
                    <div
                        className="flex items-center justify-between transition-all"
                        style={{
                            height: isScrolled ? '64px' : '80px',
                            transitionDuration: 'var(--duration-normal)',
                        }}
                    >
                        {/* Logo */}
                        <a
                            href="#"
                            className="flex items-center gap-3 group"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                                DXJ
                            </div>
                            <div className="hidden sm:block">
                                <div
                                    className="font-semibold text-sm"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {heroData.name}
                                </div>
                                <div
                                    className="text-xs"
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    后端 / AI 工程师
                                </div>
                            </div>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = `#${activeSection}` === item.href;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                                        style={{
                                            color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                                            backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                                        }}
                                    >
                                        {item.name}
                                    </a>
                                );
                            })}

                            <div
                                className="h-5 w-px mx-2"
                                style={{ backgroundColor: 'var(--border-default)' }}
                            />

                            <a
                                href={contactData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: 'var(--text-tertiary)' }}
                                aria-label="GitHub"
                            >
                                <Github size={18} />
                            </a>

                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className="btn btn-primary ml-2"
                                style={{ height: '40px', paddingLeft: '16px', paddingRight: '16px' }}
                            >
                                <Download size={16} />
                                <span className="hidden lg:inline">下载简历</span>
                            </a>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg transition-colors"
                            style={{
                                color: 'var(--text-secondary)',
                                backgroundColor: isOpen ? 'var(--bg-muted)' : 'transparent',
                            }}
                            aria-label={isOpen ? '关闭菜单' : '打开菜单'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)' }}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={{
                    x: isOpen ? 0 : '100%',
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                }}
                className="fixed top-0 right-0 bottom-0 w-[280px] z-50 md:hidden overflow-y-auto"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-xl)',
                }}
            >
                {/* Mobile menu header */}
                <div
                    className="flex items-center justify-between p-4 border-b"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <span
                        className="font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        导航
                    </span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="关闭菜单"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Mobile nav items */}
                <div className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = `#${activeSection}` === item.href;
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors"
                                style={{
                                    color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
                                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                                }}
                            >
                                {item.name}
                            </a>
                        );
                    })}
                </div>

                {/* Mobile CTA */}
                <div
                    className="p-4 border-t space-y-3"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="btn btn-primary w-full"
                    >
                        <Download size={18} />
                        下载简历 PDF
                    </a>
                    <a
                        href={contactData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary w-full"
                    >
                        <Github size={18} />
                        GitHub
                    </a>
                </div>
            </motion.div>
        </>
    );
}
