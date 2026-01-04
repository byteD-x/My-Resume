'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Globe, Phone, Copy, Check, ExternalLink, Download, MessageCircle } from 'lucide-react';
import { ContactData } from '@/types';
import { ToastTrigger } from './Toast';

interface ContactProps {
    contactData: ContactData;
}

export default function Contact({ contactData }: ContactProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = useCallback(async (value: string, field: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    }, []);

    const contactItems = [
        {
            id: 'email',
            icon: Mail,
            label: '邮箱',
            value: contactData.email,
            href: `mailto:${contactData.email}`,
            canCopy: true,
        },
        {
            id: 'phone',
            icon: Phone,
            label: '电话',
            value: contactData.phone,
            href: `tel:${contactData.phone}`,
            canCopy: true,
        },
        {
            id: 'github',
            icon: Github,
            label: 'GitHub',
            value: 'icefunicu',
            href: contactData.github,
            external: true,
        },
        {
            id: 'website',
            icon: Globe,
            label: '个人站',
            value: contactData.website.replace('https://', ''),
            href: contactData.website,
            external: true,
            note: '维护中',
        },
    ];

    return (
        <>
            <section
                className="section"
                id="contact"
                style={{ backgroundColor: 'var(--bg-page)' }}
            >
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Main Card */}
                        <div
                            className="card p-6 md:p-10"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2
                                    className="text-2xl md:text-3xl font-bold mb-3"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    准备好一起{' '}
                                    <span style={{ color: 'var(--color-primary)' }}>创造价值</span>
                                    {' '}了吗？
                                </h2>
                                <p
                                    className="text-base max-w-lg mx-auto"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    无论是项目合作、技术咨询，还是只是想打个招呼，我都期待与您交流。
                                </p>
                            </div>

                            {/* CTA Callout */}
                            <div
                                className="flex items-center justify-center gap-3 p-4 rounded-xl mb-8"
                                style={{ backgroundColor: 'var(--color-primary-light)' }}
                            >
                                <MessageCircle size={20} style={{ color: 'var(--color-primary)' }} />
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    可邮件约 15 分钟沟通，快速了解我能为您做什么
                                </span>
                            </div>

                            {/* Contact Items Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {contactItems.map((item) => {
                                    const Icon = item.icon;
                                    const isCopied = copiedField === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                                            style={{
                                                backgroundColor: 'var(--bg-muted)',
                                                border: '1px solid var(--border-default)',
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    backgroundColor: 'var(--bg-surface)',
                                                    color: 'var(--text-secondary)',
                                                }}
                                            >
                                                <Icon size={18} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-xs uppercase tracking-wide mb-0.5"
                                                    style={{ color: 'var(--text-tertiary)' }}
                                                >
                                                    {item.label}
                                                    {item.note && (
                                                        <span
                                                            className="ml-2 normal-case"
                                                            style={{ color: 'var(--text-tertiary)' }}
                                                        >
                                                            ({item.note})
                                                        </span>
                                                    )}
                                                </div>
                                                <a
                                                    href={item.href}
                                                    target={item.external ? '_blank' : undefined}
                                                    rel={item.external ? 'noopener noreferrer' : undefined}
                                                    className="font-medium text-sm truncate block transition-colors hover:underline"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {item.value}
                                                </a>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {item.canCopy && (
                                                    <button
                                                        onClick={() => handleCopy(item.value, item.id)}
                                                        className="p-2 rounded-lg transition-colors"
                                                        style={{
                                                            backgroundColor: isCopied ? 'var(--color-success-light)' : 'var(--bg-surface)',
                                                            color: isCopied ? 'var(--color-success)' : 'var(--text-tertiary)',
                                                        }}
                                                        aria-label={`复制${item.label}`}
                                                    >
                                                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                )}
                                                {item.external && (
                                                    <a
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg transition-colors"
                                                        style={{
                                                            backgroundColor: 'var(--bg-surface)',
                                                            color: 'var(--text-tertiary)',
                                                        }}
                                                        aria-label={`打开${item.label}`}
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Primary CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <a
                                    href="/resume.pdf"
                                    target="_blank"
                                    className="btn btn-primary w-full sm:w-auto"
                                >
                                    <Download size={18} />
                                    {contactData.resumeButtonText || '下载简历 PDF'}
                                </a>
                                <a
                                    href={`mailto:${contactData.email}?subject=合作咨询`}
                                    className="btn btn-secondary w-full sm:w-auto"
                                >
                                    <Mail size={18} />
                                    发送邮件
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Toast for copy feedback */}
            <ToastTrigger
                show={copiedField !== null}
                message="已复制到剪贴板！"
                type="success"
                onHide={() => setCopiedField(null)}
            />
        </>
    );
}
