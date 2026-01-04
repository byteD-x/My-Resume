'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    Building2,
    ChevronDown,
    ChevronRight,
    Briefcase,
    FolderGit2,
    ChevronUp,
    ExternalLink,
    Download
} from 'lucide-react';
import { TimelineItem, ProjectItem } from '@/types';
import EditableText from './EditableText';

interface ExperienceFlowProps {
    timeline: TimelineItem[];
    projects: ProjectItem[];
    isEditorActive?: boolean;
    highlightedId?: string | null;
    onClearHighlight?: () => void;
}

// 简洁动画配置
const fadeVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
};

export default function ExperienceFlow({
    timeline,
    projects,
    isEditorActive = false,
    highlightedId = null,
    onClearHighlight
}: ExperienceFlowProps) {
    const [activeTab, setActiveTab] = useState<'work' | 'projects'>('work');
    const [showMoreExperiences, setShowMoreExperiences] = useState(false);

    // 分离 highlighted 和 non-highlighted 经历
    const highlightedExperiences = timeline.filter(item => item.highlighted);
    const otherExperiences = timeline.filter(item => !item.highlighted);

    // 默认展开最近 2-3 条高亮经历
    const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
        const defaultExpanded = timeline.filter(item => item.highlighted).slice(0, 3).map(e => e.id);
        return new Set(defaultExpanded);
    });

    // 滚动到被高亮的项目
    useEffect(() => {
        if (highlightedId) {
            const element = document.getElementById(`timeline-${highlightedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                requestAnimationFrame(() => {
                    setExpandedItems(prev => new Set([...prev, highlightedId]));
                    if (otherExperiences.find(e => e.id === highlightedId)) {
                        setShowMoreExperiences(true);
                    }
                });
            }

            const timer = setTimeout(() => {
                onClearHighlight?.();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [highlightedId, onClearHighlight, otherExperiences]);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allIds = timeline.map(item => item.id);
        setExpandedItems(new Set(allIds));
        setShowMoreExperiences(true);
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    return (
        <section className="section" id="experience" style={{ backgroundColor: 'var(--bg-page)' }}>
            <div className="container">
                {/* Header */}
                <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div {...fadeVariants} viewport={{ once: true }}>
                        <h2 className="section-title">职业履历</h2>
                        <p className="section-subtitle">从企业级系统到 AI 原生应用的成长轨迹</p>
                    </motion.div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* 展开/收起全部 */}
                        <div className="flex gap-2">
                            <button
                                onClick={expandAll}
                                className="btn btn-tertiary text-xs h-8"
                                style={{ paddingLeft: '8px', paddingRight: '8px' }}
                            >
                                <ChevronDown size={14} />
                                展开全部
                            </button>
                            <button
                                onClick={collapseAll}
                                className="btn btn-tertiary text-xs h-8"
                                style={{ paddingLeft: '8px', paddingRight: '8px' }}
                            >
                                <ChevronUp size={14} />
                                收起全部
                            </button>
                        </div>

                        {/* Tab 切换 */}
                        <div
                            className="flex gap-1 p-1 rounded-xl"
                            style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-default)' }}
                        >
                            <button
                                onClick={() => setActiveTab('work')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
                                style={activeTab === 'work' ? {
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-xs)'
                                } : {
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                <Briefcase size={14} />
                                工作经历
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
                                style={activeTab === 'projects' ? {
                                    backgroundColor: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'var(--shadow-xs)'
                                } : {
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                <FolderGit2 size={14} />
                                项目经历
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'work' && (
                            <motion.div
                                key="work"
                                variants={fadeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                {/* 时间线轴 */}
                                <div
                                    className="absolute left-3 md:left-6 top-2 bottom-6 w-px"
                                    style={{ backgroundColor: 'var(--border-default)' }}
                                />

                                {/* 重点经历 */}
                                <div className="space-y-6"> {/* Increased vertical gap */}
                                    {highlightedExperiences.map((item, index) => (
                                        <TimelineCard
                                            key={item.id}
                                            item={item}
                                            index={index}
                                            isExpanded={expandedItems.has(item.id)}
                                            onToggle={() => toggleExpand(item.id)}
                                            isHighlighted={highlightedId === item.id}
                                            isEditorActive={isEditorActive}
                                        />
                                    ))}
                                </div>

                                {/* 更多经历 */}
                                {otherExperiences.length > 0 && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => setShowMoreExperiences(!showMoreExperiences)}
                                            className="flex items-center gap-2 transition-colors mb-6 ml-10 md:ml-16 text-sm py-2"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {showMoreExperiences ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            <span className="font-medium">
                                                {showMoreExperiences ? '收起更多经历' : `更多经历 (${otherExperiences.length})`}
                                            </span>
                                        </button>

                                        <AnimatePresence>
                                            {showMoreExperiences && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="space-y-6 overflow-hidden"
                                                >
                                                    {otherExperiences.map((item, index) => (
                                                        <TimelineCard
                                                            key={item.id}
                                                            item={item}
                                                            index={highlightedExperiences.length + index}
                                                            isExpanded={expandedItems.has(item.id)}
                                                            onToggle={() => toggleExpand(item.id)}
                                                            isHighlighted={highlightedId === item.id}
                                                            isEditorActive={isEditorActive}
                                                        />
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                variants={fadeVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {projects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index}
                                        isEditorActive={isEditorActive}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p
                        className="text-sm mb-6"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        网页为精选版，完整经历/项目细节见 PDF
                    </p>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="btn btn-primary"
                        style={{ minWidth: '180px' }}
                    >
                        <Download size={18} />
                        查看完整 PDF
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

// 时间线卡片组件
function TimelineCard({
    item,
    index,
    isExpanded,
    onToggle,
    isHighlighted,
    isEditorActive
}: {
    item: TimelineItem;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    isHighlighted: boolean;
    isEditorActive: boolean;
}) {
    return (
        <motion.div
            id={`timeline-${item.id}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className={`relative pl-10 md:pl-16 transition-all duration-300 ${isHighlighted ? 'ring-2 ring-offset-4 rounded-xl' : ''}`}
            style={isHighlighted ? {
                '--tw-ring-color': 'var(--color-primary)',
                '--tw-ring-offset-color': 'var(--bg-page)'
            } as React.CSSProperties : undefined}
        >
            {/* 时间线节点 */}
            <div
                className="absolute left-1.5 md:left-4 top-6 w-3.5 h-3.5 rounded-full border-[3px] z-10"
                style={item.highlighted ? {
                    backgroundColor: 'var(--bg-page)',
                    borderColor: 'var(--color-primary)'
                } : {
                    backgroundColor: 'var(--bg-page)',
                    borderColor: 'var(--border-strong)'
                }}
            />

            {/* 卡片 - Interactive Header */}
            <div
                className="card transition-all group hover:border-blue-200"
                style={isExpanded ? {
                    borderColor: 'var(--border-strong)',
                    boxShadow: 'var(--shadow-md)'
                } : undefined}
            >
                {/* 头部 - Min height 48px+ for accessibility */}
                <button
                    onClick={onToggle}
                    className="w-full p-5 md:p-6 text-left flex flex-col md:flex-row md:items-start gap-4 focus-visible:ring-inset"
                    style={{ minHeight: '80px' }}
                >
                    <div className="flex-1 space-y-3">
                        {/* 1. Header Row: Role & Company & Year */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-wrap">
                            <span
                                className="text-xs font-mono font-medium px-2 py-0.5 rounded border self-start md:self-auto"
                                style={{
                                    backgroundColor: 'var(--bg-muted)',
                                    color: 'var(--text-secondary)',
                                    borderColor: 'var(--border-default)'
                                }}
                            >
                                {item.year}
                            </span>

                            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <EditableText
                                    id={`timeline-${item.id}-role`}
                                    value={item.role}
                                    onChange={() => { }}
                                    as="span"
                                    isEditorActive={isEditorActive}
                                />
                            </h3>

                            <span className="hidden md:inline text-slate-300">|</span>

                            <span
                                className="flex items-center gap-1.5 text-sm font-medium"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <Building2 size={14} />
                                {item.company}
                            </span>
                        </div>

                        {/* 2. Summary (Value Prop) */}
                        {item.summary && (
                            <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                                <EditableText
                                    id={`timeline-${item.id}-summary`}
                                    value={item.summary}
                                    onChange={() => { }}
                                    as="span"
                                    isEditorActive={isEditorActive}
                                />
                            </p>
                        )}

                        {/* 3. ✅ Key Outcomes (The "Result" hook) */}
                        {item.keyOutcomes && item.keyOutcomes.length > 0 && (
                            <ul className="space-y-1 mt-2">
                                {item.keyOutcomes.map((outcome, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                                        <span className="text-green-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                        <span style={{ color: 'var(--text-primary)' }}>{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 4. Tech Tags (Condensed) */}
                        {item.techTags && item.techTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.techTags.slice(0, 5).map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-medium border bg-slate-50 text-slate-500 border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                                {item.techTags.length > 5 && (
                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400">
                                        +{item.techTags.length - 5}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 展开/收起图标 */}
                    <div className="flex flex-col items-center justify-center gap-1 pl-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            {isExpanded ? 'Fold' : 'More'}
                        </span>
                        <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-100 rotate-180' : 'bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600'}`}
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </button>

                {/* 展开内容：问题-行动-结果结构 */}
                <AnimatePresence>
                    {isExpanded && item.expandedDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <div
                                className="px-5 md:px-6 pb-8 pt-4 space-y-6 border-t bg-slate-50/50"
                                style={{ borderColor: 'var(--border-default)' }}
                            >
                                {/* Context / Problem / Solution Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {item.expandedDetails.problem && (
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">背景与挑战</h4>
                                            <p className="text-sm leading-relaxed text-slate-600">
                                                {item.expandedDetails.problem}
                                            </p>
                                        </div>
                                    )}
                                    {item.expandedDetails.solution && (
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">行动与方案</h4>
                                            <p className="text-sm leading-relaxed text-slate-600">
                                                {item.expandedDetails.solution}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Full Result (if different from key outcomes) */}
                                {item.expandedDetails.result && (
                                    <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">最终成效</h4>
                                        <p className="text-sm leading-relaxed text-emerald-900">
                                            {item.expandedDetails.result}
                                        </p>
                                    </div>
                                )}

                                {/* Role & Links */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                    {item.expandedDetails.role && (
                                        <div className="text-xs text-slate-500">
                                            <span className="font-semibold text-slate-700">我的角色：</span>
                                            {item.expandedDetails.role}
                                        </div>
                                    )}

                                    {item.expandedDetails.links && item.expandedDetails.links.length > 0 && (
                                        <div className="flex gap-2">
                                            {item.expandedDetails.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                                                >
                                                    <ExternalLink size={12} />
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// 详情块组件：问题-行动-结果
function DetailBlock({ label, content, color }: { label: string; content: string; color: string }) {
    return (
        <div className="flex gap-4">
            <div
                className="w-1 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: color, height: 'auto', minHeight: '1.5rem' }}
            />
            <div>
                <span
                    className="text-xs font-bold uppercase tracking-wider block mb-1"
                    style={{ color: color, opacity: 0.9 }}
                >
                    {label}
                </span>
                <p className="text-sm leading-7 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                    {content}
                </p>
            </div>
        </div>
    );
}

// 项目卡片组件
function ProjectCard({
    project,
    index,
    isEditorActive
}: {
    project: ProjectItem;
    index: number;
    isEditorActive: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className="card p-6 flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <EditableText
                            id={`project-${project.id}-name`}
                            value={project.name}
                            onChange={() => { }}
                            as="span"
                            isEditorActive={isEditorActive}
                        />
                    </h3>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {project.year} {project.impact && `· ${project.impact}`}
                    </p>
                </div>
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
                        style={{
                            color: 'var(--text-secondary)'
                        }}
                        aria-label="查看项目"
                    >
                        <ArrowUpRight size={20} />
                    </a>
                )}
            </div>

            <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                <EditableText
                    id={`project-${project.id}-summary`}
                    value={project.summary}
                    onChange={() => { }}
                    as="span"
                    isEditorActive={isEditorActive}
                />
            </p>

            <div className="space-y-3 mb-6">
                {project.details.slice(0, 3).map((detail, i) => (
                    <div key={i} className="flex gap-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        <ChevronRight size={16} className="mt-0.5 flex-shrink-0 text-slate-300" />
                        <span className="leading-relaxed">{detail}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t mt-auto" style={{ borderColor: 'var(--border-default)' }}>
                {project.tech.map((t, i) => (
                    <span key={i} className="tag text-xs">
                        {t}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
