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
// Animation config
const fadeIn = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
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
            className="section pt-32 md:pt-48 pb-12 md:pb-24" // Increased top padding
            style={{ backgroundColor: 'var(--bg-page)' }}
        >
            <div className="container">
                {/* Two-column layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left Column: Value Proposition */}
                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start pt-2">
                        {/* Status badges */}
                        <motion.div
                            {...fadeIn}
                            className="flex flex-wrap items-center gap-3 mb-8"
                        >
                            {/* Open to work badge */}
                            <span
                                className="badge badge-success px-4"
                                style={{ height: '32px', borderRadius: '999px' }}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full animate-pulse mr-2"
                                    style={{ backgroundColor: 'var(--color-success)' }}
                                />
                                可立即入职
                            </span>

                            {/* Location */}
                            <span
                                className="badge px-4"
                                style={{ height: '32px', borderRadius: '999px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                            >
                                <MapPin size={14} className="mr-1.5" />
                                深圳/南京/西安/杭州/成都
                            </span>
                        </motion.div>

                        {/* H1: Value proposition */}
                        <motion.h1
                            {...fadeIn}
                            transition={{ ...fadeIn.transition, delay: 0.05 }}
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-balance leading-[1.15]"
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
                            className="space-y-5 mb-10 w-full"
                        >
                            {data.bullets.map((bullet, index) => (
                                <div
                                    key={bullet.id}
                                    className="flex items-start gap-4"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    />
                                    <div className="text-lg leading-relaxed max-w-2xl">
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
                                        <span style={{ color: 'var(--text-tertiary)', margin: '0 4px' }}>：</span>
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
                            className="flex flex-wrap gap-4"
                        >
                            {/* Primary: Download PDF - Min height 48px */}
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className="btn btn-primary text-base font-semibold shadow-lg shadow-blue-500/20"
                                style={{ minWidth: '160px', height: '52px', paddingLeft: '24px', paddingRight: '24px' }}
                            >
                                <Download size={20} className="mr-2" />
                                下载简历 PDF
                            </a>

                            {/* Secondary: Email (consolidated contact) */}
                            {contactData && (
                                <a
                                    href={`mailto:${contactData.email}`}
                                    className="btn btn-secondary text-base"
                                    style={{ height: '52px' }}
                                >
                                    <Mail size={20} />
                                    联系我
                                </a>
                            )}
                        </motion.div>

                        {/* Editor-only: Name display */}
                        {isEditorActive && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-6 mt-8 border-t w-full"
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
                        className="lg:col-span-5 xl:col-span-5 w-full"
                    >
                        <div
                            className="card p-6 md:p-8"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <h2
                                className="text-sm font-bold uppercase tracking-wide mb-6"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                Recruiter Quick Facts
                            </h2>

                            <div className="space-y-6">
                                {/* Position */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="p-3 rounded-xl flex-shrink-0"
                                        style={{ backgroundColor: 'var(--bg-muted)' }}
                                    >
                                        <Briefcase size={20} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-1"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            岗位方向
                                        </div>
                                        <div
                                            className="font-semibold text-lg"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {quickFacts.position}
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="p-3 rounded-xl flex-shrink-0"
                                        style={{ backgroundColor: 'var(--bg-muted)' }}
                                    >
                                        <MapPin size={20} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-1"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            地点偏好
                                        </div>
                                        <div
                                            className="font-medium text-base"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {quickFacts.remote}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className="p-3 rounded-xl flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-success-light)' }}
                                    >
                                        <Calendar size={20} style={{ color: 'var(--color-success)' }} />
                                    </div>
                                    <div>
                                        <div
                                            className="text-xs uppercase tracking-wide mb-1"
                                            style={{ color: 'var(--text-tertiary)' }}
                                        >
                                            入职时间
                                        </div>
                                        <div
                                            className="font-bold text-base"
                                            style={{ color: 'var(--color-success)' }}
                                        >
                                            {quickFacts.availability}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div
                                    className="border-t my-6"
                                    style={{ borderColor: 'var(--border-default)' }}
                                />

                                {/* Core Tech Stack */}
                                <div>
                                    <div
                                        className="text-xs uppercase tracking-wide mb-4"
                                        style={{ color: 'var(--text-tertiary)' }}
                                    >
                                        核心技术栈
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quickFacts.coreStack.map((tech) => (
                                            <span key={tech} className="tag px-3 py-1.5 text-sm">
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
                    className="hidden lg:flex justify-center mt-20"
                >
                    <a
                        href="#impact"
                        className="flex flex-col items-center gap-2 text-sm transition-opacity hover:opacity-70 p-4"
                        style={{ color: 'var(--text-tertiary)' }}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <span>向下探索</span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ChevronDown size={24} />
                        </motion.div>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
