'use client';

import React from 'react';
import { Github, Heart, Calendar } from 'lucide-react';

interface FooterProps {
    name: string;
    githubUrl?: string;
}

export default function Footer({ name, githubUrl }: FooterProps) {
    // Use static year to avoid hydration mismatch
    const currentYear = 2026;
    const lastUpdated = '2026年1月';

    return (
        <footer
            data-print="hide"
            className="border-t"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-default)'
            }}
        >
            <div className="container py-8 md:py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h3
                            className="text-base font-semibold mb-1"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {name}
                        </h3>
                        <p
                            className="text-sm flex items-center gap-1.5 justify-center md:justify-start"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            用代码与 AI 创造价值
                            <Heart size={12} className="text-red-500" />
                        </p>
                    </div>

                    {/* Last updated */}
                    <div
                        className="flex items-center gap-2 text-sm"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        <Calendar size={14} />
                        <span>最后更新：{lastUpdated}</span>
                    </div>

                    {/* Links & Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {githubUrl && (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                <Github size={16} />
                                <span>GitHub</span>
                            </a>
                        )}

                        <div
                            className="hidden md:block w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--border-strong)' }}
                        />

                        <p
                            className="text-sm"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            © {currentYear} {name}
                        </p>
                    </div>
                </div>

                {/* Tech stack badge */}
                <div
                    className="mt-6 pt-6 border-t text-center"
                    style={{ borderColor: 'var(--border-default)' }}
                >
                    <p
                        className="text-xs"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        Built with Next.js + Tailwind CSS + Framer Motion
                    </p>
                </div>
            </div>
        </footer>
    );
}
