
'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Globe, Phone, Copy, Check, ExternalLink, MessageCircle, MessageSquare } from 'lucide-react';
import { ContactData } from '@/types';
import { ToastTrigger } from './Toast';
import { Section } from './ui/Section';
import { Container } from './ui/Container';

interface ContactProps {
    contactData: ContactData;
}

interface ContactItem {
    id: string;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    value: string;
    href: string;
    canCopy?: boolean;
    external?: boolean;
    note?: string;
}

export default function Contact({ contactData }: ContactProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = useCallback(async (value: string, field: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    const websiteUrls = contactData.websites && contactData.websites.length > 0
        ? contactData.websites
        : (contactData.website ? [contactData.website] : []);
    const emailSubject = '应聘(后端工程师)-杜旭嘉';
    const resumeLinks = websiteUrls.map((url) => `在线简历: ${url}`).join('\n');
    const emailBody = `你好，我对您的项目/经历非常感兴趣。\n\n我的 GitHub: https://github.com/icefunicu${resumeLinks ? `\n${resumeLinks}` : ''}\n简历 PDF: (请见附件)\n\n期待回复！`;
    const mailtoHref = `mailto:${contactData.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const contactItems: ContactItem[] = [
        {
            id: 'email',
            icon: Mail,
            label: '邮箱',
            value: contactData.email,
            href: mailtoHref,
            canCopy: true,
        },
        {
            id: 'phone',
            icon: Phone,
            label: '电话',
            value: contactData.phone,
            href: `tel:${contactData.phone.replace(/\s+/g, '')}`,
            canCopy: true,
        },
        {
            id: 'wechat',
            icon: MessageSquare,
            label: '微信',
            value: 'w2041487752',
            href: '#',
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
        // { ... } // Removed website/personal blog if "under maintenance" logic is not strictly needed or kept simple. 
        // Keeping it if user data has it, but streamlining.
        ...websiteUrls.map((url, index) => ({
            id: `website-${index + 1}`,
            icon: Globe,
            label: '个人站',
            value: url.replace(/^https?:\/\//, ''),
            href: url,
            external: true,
            note: '维护中',
        })),
    ];

    return (
        <>
            <Section id="contact" className="bg-white" data-print="hide">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Main Card */}
                        <div className="group relative bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/5 dark:shadow-black/50 overflow-hidden">
                            {/* Tech Background Grid */}
                            <div
                                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
                                    backgroundSize: '32px 32px',
                                    maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
                                }}
                            />

                            {/* Decorative Background Glows - Adjusted for Light Mode */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                {/* Left Side: Text & Primary Action */}
                                <div className="flex-1 text-center md:text-left space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 hidden md:block opacity-50" />
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white font-heading leading-tight">
                                            准备好一起 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">创造价值</span> 了吗
                                        </h2>
                                        <p className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                                            无论是项目合作、全职机会，还是技术交流，我都期待与您的对话。
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                        <a
                                            href={mailtoHref}
                                            className="inline-flex items-center gap-2.5 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 text-base"
                                        >
                                            <Mail size={18} className="text-white" />
                                            <span>发送邮件</span>
                                        </a>
                                        {/* Fixed Hydration Bug: Changed p to div */}
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            通常在 24 小时内回复
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Contact Details */}
                                <div className="w-full md:w-auto flex flex-col gap-3 min-w-[320px]">
                                    {contactItems.map((item) => {
                                        const Icon = item.icon;
                                        const isCopied = copiedField === item.id;

                                        return (
                                            <div
                                                key={item.id}
                                                className="group/item bg-zinc-50 dark:bg-zinc-800/40 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex items-center gap-4 hover:bg-white dark:hover:bg-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                                            >
                                                {/* Hover Highlight Bar */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300" />

                                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors border border-zinc-100 dark:border-zinc-800">
                                                    <Icon size={18} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                                                        {item.label}
                                                    </div>
                                                    <a
                                                        href={item.href}
                                                        target={item.external ? '_blank' : undefined}
                                                        rel={item.external ? 'noopener noreferrer' : undefined}
                                                        onClick={(e) => {
                                                            if (item.href === '#') {
                                                                e.preventDefault();
                                                                handleCopy(item.value, item.id);
                                                            }
                                                        }}
                                                        className={`text-base text-zinc-900 dark:text-zinc-100 font-semibold truncate block transition-colors font-sans
                                                            ${item.href === '#' ? 'cursor-pointer hover:text-green-600 dark:hover:text-green-500' : 'hover:text-blue-600 dark:hover:text-blue-400'}
                                                        `}
                                                        title={item.href === '#' ? '点击复制' : ''}
                                                    >
                                                        {item.value}
                                                    </a>
                                                </div>

                                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity focus-within:opacity-100">
                                                    {item.canCopy && (
                                                        <button
                                                            onClick={() => handleCopy(item.value, item.id)}
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                            title="复制"
                                                            aria-label={`复制 ${item.label}`}
                                                        >
                                                            {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                        </button>
                                                    )}
                                                    {item.external && (
                                                        <a
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                            title="打开"
                                                            aria-label={`打开 ${item.label}`}
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </Section>

            <ToastTrigger
                show={copiedField !== null}
                message="已复制到剪贴板！"
                type="success"
                onHide={() => setCopiedField(null)}
            />
        </>
    );
}
