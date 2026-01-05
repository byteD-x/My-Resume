'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail } from 'lucide-react';

export default function FloatingResumeButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 检测是否为移动端
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // 滚动检测
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 移动端：底部固定浮动 CTA 栏
    if (isMobile) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        data-print="hide"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-3 flex gap-2"
                        style={{
                            backgroundColor: 'rgba(248, 250, 252, 0.95)',
                            backdropFilter: 'blur(8px)',
                            borderTop: '1px solid var(--border-default)',
                            paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))'
                        }}
                    >
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="btn-primary flex-1 py-3"
                        >
                            <Download size={16} />
                            下载简历
                        </a>
                        <a
                            href="#contact"
                            className="btn-secondary flex-1 py-3"
                        >
                            <Mail size={16} />
                            联系我
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // 桌面端：右下角浮动按钮
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    data-print="hide"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-medium shadow-lg transition-shadow hover:shadow-xl"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white'
                    }}
                >
                    <Download size={18} />
                    <span>下载简历</span>
                </motion.a>
            )}
        </AnimatePresence>
    );
}
