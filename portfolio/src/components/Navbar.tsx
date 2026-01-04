import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';
import { HeroData, ContactData } from '@/types';

interface NavbarProps {
    heroData: HeroData;
    contactData: ContactData;
}

const navItems = [
    { name: 'Impact', href: '#impact' },
    { name: 'Experience', href: '#experience' },
    { name: 'Stack', href: '#skills' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar({ heroData, contactData }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-panel border-b border-white/5 py-4' : 'bg-transparent py-6'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container-padding flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
                            DXJ
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden md:block group-hover:text-white transition-colors">
                            {heroData.name}
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all group-hover:w-full" />
                            </a>
                        ))}

                        <div className="h-4 w-px bg-white/10 mx-2" />

                        <div className="flex items-center gap-4">
                            <a
                                href={contactData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Scroll Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 origin-left"
                    style={{ scaleX }}
                />
            </motion.nav>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                className="fixed top-[70px] left-0 right-0 z-40 bg-[#0B0F14]/95 backdrop-blur-xl border-b border-white/10 md:hidden overflow-hidden"
            >
                <div className="px-6 py-8 space-y-6">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium text-gray-300 hover:text-cyan-400"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
