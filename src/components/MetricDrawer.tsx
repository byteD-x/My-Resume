'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { ImpactItem, TimelineItem } from '@/types';

interface MetricDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    metric: ImpactItem | null;
    linkedExperience?: TimelineItem | null;
}

export default function MetricDrawer({ isOpen, onClose, metric, linkedExperience }: MetricDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus trap and ESC handler
    useEffect(() => {
        if (!isOpen) return;

        // Focus the close button when drawer opens
        closeButtonRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }

            // Focus trap
            if (e.key === 'Tab' && drawerRef.current) {
                const focusableElements = drawerRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        // Prevent body scroll when drawer is open
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!metric) return null;

    const details = linkedExperience?.expandedDetails;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50"
                        style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }}
                        onClick={handleBackdropClick}
                        aria-hidden="true"
                    />

                    {/* Drawer - Right side on desktop, bottom on mobile */}
                    <motion.div
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-title"
                        className="fixed z-50 bg-white overflow-y-auto
                            inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
                            md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-lg md:rounded-none md:rounded-l-2xl md:max-h-none"
                        initial={{
                            y: '100%',
                            x: 0,
                        }}
                        animate={{
                            y: 0,
                            x: 0,
                        }}
                        exit={{
                            y: '100%',
                            x: 0,
                        }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300
                        }}
                        style={{
                            boxShadow: 'var(--shadow-xl)',
                        }}
                    >
                        {/* Handle bar for mobile */}
                        <div className="md:hidden flex justify-center pt-3 pb-2">
                            <div
                                className="w-10 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--border-strong)' }}
                            />
                        </div>

                        {/* Header */}
                        <div
                            className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b"
                            style={{
                                backgroundColor: 'var(--bg-surface)',
                                borderColor: 'var(--border-default)'
                            }}
                        >
                            <h2
                                id="drawer-title"
                                className="text-lg md:text-xl font-semibold"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {metric.title}
                            </h2>
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                className="p-2 rounded-lg transition-colors"
                                style={{ color: 'var(--text-tertiary)' }}
                                aria-label="关闭"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 md:p-6 space-y-6">
                            {/* Metric highlight */}
                            <div
                                className="p-6 rounded-xl text-center"
                                style={{ backgroundColor: 'var(--bg-muted)' }}
                            >
                                <div
                                    className="text-4xl md:text-5xl font-bold mb-2"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    {metric.value}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {metric.label}
                                </div>
                            </div>

                            {/* Description */}
                            {metric.description && (
                                <div>
                                    <h3
                                        className="text-sm font-semibold mb-2 uppercase tracking-wide"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        概述
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {metric.description}
                                    </p>
                                </div>
                            )}

                            {/* Linked experience details */}
                            {details && (
                                <>
                                    {/* Background */}
                                    {details.background && (
                                        <div>
                                            <h3
                                                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                背景
                                            </h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>
                                                {details.background}
                                            </p>
                                        </div>
                                    )}

                                    {/* Solution / Actions */}
                                    {details.solution && (
                                        <div>
                                            <h3
                                                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                我的行动
                                            </h3>
                                            <ul className="space-y-2">
                                                {details.solution.split('；').filter(Boolean).map((action, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                                            style={{ backgroundColor: 'var(--color-primary)' }}
                                                        />
                                                        <span style={{ color: 'var(--text-secondary)' }}>
                                                            {action.trim()}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Result */}
                                    {details.result && (
                                        <div>
                                            <h3
                                                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                成果
                                            </h3>
                                            <p
                                                className="font-medium"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {details.result}
                                            </p>
                                        </div>
                                    )}

                                    {/* Tech Stack */}
                                    {details.techStack && details.techStack.length > 0 && (
                                        <div>
                                            <h3
                                                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                技术要点
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {details.techStack.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="tag"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    {details.links && details.links.length > 0 && (
                                        <div>
                                            <h3
                                                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                                                style={{ color: 'var(--text-tertiary)' }}
                                            >
                                                查看证据
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {details.links.map((link, i) => (
                                                    <a
                                                        key={i}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary"
                                                    >
                                                        {link.label}
                                                        <ExternalLink size={14} />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Company info if linked */}
                            {linkedExperience && (
                                <div
                                    className="pt-4 border-t"
                                    style={{ borderColor: 'var(--border-default)' }}
                                >
                                    <div
                                        className="text-xs uppercase tracking-wide mb-1"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        来源
                                    </div>
                                    <div
                                        className="font-medium"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {linkedExperience.company}
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {linkedExperience.role} · {linkedExperience.year}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
