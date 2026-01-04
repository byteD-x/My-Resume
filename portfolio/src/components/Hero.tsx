'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Github, MapPin, Briefcase, Calendar, ChevronDown } from 'lucide-react';
import { HeroData, ContactData } from '@/types';
import EditableText from './EditableText';

interface HeroProps {
    data: HeroData;
    contactData?: ContactData;
    isEditorActive?: boolean;
}

// Animation config
const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' as const }
};

// Quick Facts data (derived from hero data)
const quickFacts = {
    position: '后端/全栈/AI 工程方向',
    locations: ['深圳', '南京', '西安', '杭州', '成都'],
    remote: '优先远程（也接受到岗/混合）',
    availability: '可立即入职',
    coreStack: ['Java', 'Spring', 'Python', 'MySQL', 'Redis', 'LLM API'],
};

export default function Hero({ data, contactData, isEditorActive = false }: HeroProps) {

    return (
        <section
            className="section pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20"
            style={{ backgroundColor: 'var(--bg-page)' }}
        >
            <div className="container">
                {/* Two-column layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column: Value Proposition */}
                    <div className="lg:col-span-7 xl:col-span-7">
                        {/* Status badges */}
                        <motion.div
                            {...fadeIn}
                            className="flex flex-wrap items-center gap-2 mb-6"
                        >
                            {/* Open to work badge */}
                            <span
                                className="badge badge-success"
                                style={{ gap: '6px' }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: 'var(--color-success)' }}
                                />
                                可立即入职
                            </span>

                            {/* Location */}
                            <span
                                className="badge"
                                style={{ gap: '4px' }}
                            >
                                <MapPin size={12} />
                                深圳/南京/西安/杭州/成都
                            </span>
                        </motion.div>

                        {/* H1: Value proposition */}
                        <motion.h1
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 0.05 }}
                            className="text-display mb-6 text-balance"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <EditableText
                                id="hero-title"
                                value={data.title}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </motion.h1>

                        {/* Core capabilities - 3 bullets */}
                        <motion.div
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 0.1 }}
                            className="space-y-3 mb-8"
                        >
                            {data.bullets.map((bullet, index) => (
                                <div
                                    key={bullet.id}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    />
                                    <div className="text-base leading-relaxed">
                                        <span
                                            className="font-semibold"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            <EditableText
                                                id={`hero-bullet-${index}-title`}
                                                value={bullet.title}
                                                onChange={() => { }}
                                                as="span"
                                                isEditorActive={isEditorActive}
                                            />
                                        </span>
                                        <span style={{ color: 'var(--text-tertiary)' }}>：</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            <EditableText
                                                id={`hero-bullet-${index}-desc`}
                                                value={bullet.description}
                                                onChange={() => { }}
                                                as="span"
                                                isEditorActive={isEditorActive}
                                            />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Button Group */}
                        <motion.div
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 0.15 }}
                            className="flex flex-wrap gap-3"
                        >
                            {/* Primary: Download PDF */}
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className="btn btn-primary"
                            >
                                <Download size={18} />
                                下载简历 PDF
                            </a>

                            {/* Secondary: Email */}
                            {contactData && (
                                <a
                                    href={`mailto:${contactData.email}`}
                                    className="btn btn-secondary"
                                >
                                    <Mail size={18} />
                                    发送邮件
                                </a>
                            )}

                            {/* Tertiary: GitHub */}
                            {contactData && (
                                <a
                                    href={contactData.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-tertiary"
                                >
                                    <Github size={18} />
                                    GitHub
                                </a>
                            )}
                        </motion.div>

                        {/* Editor-only: Name display */}
                        {isEditorActive && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-6 mt-8 border-t"
                                style={{ borderColor: 'var(--border-default)' }}
                            >
                                <span
                                    className="text-sm mr-2"
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    姓名：
                                </span>
                                <EditableText
                                    id="hero-name"
                                    value={data.name}
                                    onChange={() => { }}
                                    as="span"
                                    className="font-medium"
                                    style={{ color: 'var(--text-primary)' }}
                                    isEditorActive={isEditorActive}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Quick Facts Card */}
                    <motion.div
                        {...fadeIn}
                        transition={{ ...fadeIn.transition, delay: 0.2 }}
                        className="lg:col-span-5 xl:col-span-5"
                    >
                        <div
                            className="card p-6"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <h2
                                className="text-sm font-semibold uppercase tracking-wide mb-5"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Recruiter Quick Facts
                            </h2>

                            <div className="space-y-4">
                                {/* Position */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className="p-2 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: 'var(--bg-muted)' }}
                                    >
                                        <Briefcase size={16} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-0.5"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            岗位方向
                                        </div>
                                        <div
                                            className="font-medium"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {quickFacts.position}
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className="p-2 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: 'var(--bg-muted)' }}
                                    >
                                        <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-0.5"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            地点偏好
                                        </div>
                                        <div
                                            className="font-medium"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {quickFacts.remote}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="flex items-start gap-3">
                                    <div
                                        className="p-2 rounded-lg flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-success-light)' }}
                                    >
                                        <Calendar size={16} style={{ color: 'var(--color-success)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-0.5"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            入职时间
                                        </div>
                                        <div
                                            className="font-semibold"
                                            style={{ color: 'var(--color-success)' }}
                                        >
                                            {quickFacts.availability}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div
                                    className="border-t my-4"
                                    style={{ borderColor: 'var(--border-default)' }}
                                />

                                {/* Core Tech Stack */}
                                <div>
                                    <div
                                        className="text-xs uppercase tracking-wide mb-3"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        核心技术栈
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quickFacts.coreStack.map((tech) => (
                                            <span key={tech} className="tag">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    {...fadeIn}
                    transition={{ ...fadeIn.transition, delay: 0.3 }}
                    className="hidden lg:flex justify-center mt-12"
                >
                    <a
                        href="#impact"
                        className="flex flex-col items-center gap-2 text-sm transition-opacity hover:opacity-70"
                        style={{ color: 'var(--text-tertiary)' }}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span>向下探索</span>
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
