
'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Globe, Phone, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { ContactData } from '@/types';
import { ToastTrigger } from './Toast';
import { Section } from './ui/Section';
import { Container } from './ui/Container';

interface ContactProps {
    contactData: ContactData;
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

    const contactItems = [
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
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                {/* Left Side: Text & Primary Action */}
                                <div className="flex-1 text-center md:text-left space-y-8">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                                            准备好一起 <span className="text-indigo-300">创造价值</span> 了吗？
                                        </h2>
                                        <p className="text-indigo-100/80 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                                            无论是项目合作、全职机会，还是技术交流，我都期待与您的对话。
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                                        <a
                                            href={mailtoHref}
                                            className="inline-flex items-center gap-2.5 bg-white text-indigo-950 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/20"
                                        >
                                            <Mail size={20} />
                                            <span>发送邮件</span>
                                        </a>
                                        <p className="text-sm text-indigo-300 font-medium flex items-center gap-2">
                                            <MessageCircle size={16} />
                                            通常在 24 小时内回复
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Contact Details */}
                                <div className="w-full md:w-auto flex flex-col gap-4 min-w-[300px]">
                                    {contactItems.map((item) => {
                                        const Icon = item.icon;
                                        const isCopied = copiedField === item.id;

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-indigo-200">
                                                    <Icon size={20} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-0.5">
                                                        {item.label}
                                                    </div>
                                                    <a
                                                        href={item.href}
                                                        target={item.external ? '_blank' : undefined}
                                                        rel={item.external ? 'noopener noreferrer' : undefined}
                                                        className="text-white font-medium truncate block hover:text-indigo-200 transition-colors"
                                                    >
                                                        {item.value}
                                                    </a>
                                                </div>

                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                                    {item.canCopy && (
                                                        <button
                                                            onClick={() => handleCopy(item.value, item.id)}
                                                            className="p-3 hover:bg-white/20 rounded-lg text-indigo-200 hover:text-white transition-colors"
                                                            title="复制"
                                                            aria-label={`复制 ${item.label}`}
                                                        >
                                                            {isCopied ? <Check size={16} /> : <Copy size={16} />}
                                                        </button>
                                                    )}
                                                    {item.external && (
                                                        <a
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-3 hover:bg-white/20 rounded-lg text-indigo-200 hover:text-white transition-colors"
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
