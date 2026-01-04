'use client';

import React from 'react';
import { Github, Heart } from 'lucide-react';

interface FooterProps {
    name: string;
    githubUrl?: string;
}

export default function Footer({ name, githubUrl }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-16 border-t border-zinc-200 bg-zinc-50">
            <div className="container-padding py-12 md:py-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* 品牌标识 */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-zinc-900">
                            {name}
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1 justify-center md:justify-start">
                            用代码与 AI 创造价值
                            <Heart size={14} className="text-red-500" />
                        </p>
                    </div>

                    {/* GitHub 链接 */}
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            <Github size={20} />
                            <span className="text-sm">GitHub</span>
                        </a>
                    )}

                    {/* 版权和技术栈 */}
                    <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-zinc-500">
                        <p>© {currentYear} {name}</p>
                        <div className="hidden md:block w-1 h-1 bg-zinc-300 rounded-full" />
                        <p>Next.js + Tailwind CSS</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
