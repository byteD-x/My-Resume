'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
    { label: '关于', href: '#about' },
    { label: '经历', href: '#experience' },
    { label: '项目', href: '#projects' },
    { label: '技能', href: '#skills' },
    { label: '联系', href: '#contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        setIsMobileOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                className={`
                    fixed top-0 left-0 right-0 z-50
                    transition-all duration-500
                    ${isScrolled
                        ? 'py-3 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5'
                        : 'py-6 bg-transparent'
                    }
                `}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <motion.a
                        href="#"
                        className="text-xl font-bold font-heading bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        DXJ
                    </motion.a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item, index) => (
                            <motion.button
                                key={item.href}
                                onClick={() => scrollToSection(item.href)}
                                className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-full transition-all duration-300 hover:bg-white/5"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -2 }}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-[#0a0a0f]/95 backdrop-blur-xl" />
                        <motion.div
                            className="relative flex flex-col items-center justify-center h-full gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.1 }}
                        >
                            {navItems.map((item, index) => (
                                <motion.button
                                    key={item.href}
                                    onClick={() => scrollToSection(item.href)}
                                    className="text-2xl text-zinc-300 hover:text-white transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
