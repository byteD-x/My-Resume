'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Globe, Phone, Copy, Check, ArrowRight, Download } from 'lucide-react';
import { ContactData, HeroData } from '@/types';

interface ContactProps {
    contactData: ContactData;
    heroData: HeroData;
    isEditorActive?: boolean;
}

export default function Contact({ contactData, heroData, isEditorActive = false }: ContactProps) {
    const [copied, setCopied] = useState(false);
    const email = contactData.email;

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 relative bg-zinc-50" id="contact">
            <div className="container-padding max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* 主卡片 - 使用柔和边框而非深色背景 */}
                    <div className="bg-white p-10 md:p-16 text-center rounded-3xl border border-zinc-200 shadow-lg relative">
                        {/* 装饰渐变 - 使用 pointer-events-none 避免遮挡 */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

                        {/* 内容层 - 确保在装饰层上方 */}
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">
                                准备好一起 <span className="text-blue-600">创造价值</span> 了吗？
                            </h2>
                            <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                                无论是项目合作、技术咨询，还是只是想打个招呼，我都期待与您交流。
                            </p>

                            {/* 行动按钮组 */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                                {/* 邮箱复制 */}
                                <button
                                    onClick={handleCopy}
                                    className="group relative flex items-center gap-3 px-6 py-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl transition-all w-full md:w-auto justify-center"
                                >
                                    <Mail className="text-blue-600" size={20} />
                                    <span className="font-medium text-zinc-900">{email}</span>
                                    <div className="ml-2 p-1.5 rounded-lg bg-white group-hover:bg-zinc-100 transition-colors">
                                        {copied ? (
                                            <Check size={16} className="text-green-600" />
                                        ) : (
                                            <Copy size={16} className="text-zinc-400 group-hover:text-zinc-600" />
                                        )}
                                    </div>

                                    {copied && (
                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg">
                                            已复制！
                                        </span>
                                    )}
                                </button>

                                {/* GitHub */}
                                <a
                                    href={contactData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-6 py-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all w-full md:w-auto justify-center"
                                >
                                    <Github size={20} />
                                    <span>GitHub</span>
                                    <ArrowRight size={16} />
                                </a>
                            </div>

                            {/* 次要链接 */}
                            <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-zinc-200">
                                <a
                                    href={`tel:${contactData.phone}`}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
                                >
                                    <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <span>{contactData.phone}</span>
                                </a>
                                <a
                                    href={contactData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
                                >
                                    <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
                                        <Globe size={16} />
                                    </div>
                                    <span>{contactData.website}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 底部 CTA 按钮 */}
                    <div className="mt-8 text-center">
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <Download size={18} />
                            {contactData.resumeButtonText || '下载简历 PDF'}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
