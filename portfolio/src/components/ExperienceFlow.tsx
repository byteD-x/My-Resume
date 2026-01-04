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
                className="card transition-all"
                style={isExpanded ? {
                    borderColor: 'var(--border-strong)',
                    boxShadow: 'var(--shadow-md)'
                } : undefined}
            >
                {/* 头部 - Min height 48px+ for accessibility */}
                <button
                    onClick={onToggle}
                    className="w-full p-6 text-left flex flex-col md:flex-row md:items-start gap-4 focus-visible:ring-inset"
                    style={{ minHeight: '80px' }}
                >
                    <div className="flex-1">
                        {/* 时间和公司 - Aligned */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span
                                className="text-xs font-mono font-medium px-2 py-1 rounded"
                                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                            >
                                {item.year}
                            </span>
                            <span
                                className="flex items-center gap-1.5 text-sm font-medium"
                                style={{ color: 'var(--text-tertiary)' }}
                            >
                                <Building2 size={14} />
                                {item.company}
                            </span>
                        </div>

                        {/* 职位标题 */}
                        <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            <EditableText
                                id={`timeline-${item.id}-role`}
                                value={item.role}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </h3>

                        {/* 摘要 - Limited width for reading */}
                        <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                            <EditableText
                                id={`timeline-${item.id}-summary`}
                                value={item.summary}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </p>

                        {/* 技术标签 - Only show when collapsed or always? Spec says concise. Keeping it. */}
                        {item.techTags && item.techTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.techTags.map((tag, i) => (
                                    <span key={i} className="tag text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 展开/收起图标 - 44x44 area */}
                    <div
                        className={`w-11 h-11 flex items-center justify-center rounded-lg transition-transform ${isExpanded ? 'rotate-180 bg-slate-100' : ''}`}
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        <ChevronDown size={20} />
                    </div>
                </button>

                {/* 展开内容：问题-行动-结果结构 */}
                <AnimatePresence>
                    {isExpanded && item.expandedDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div
                                className="px-6 pb-8 pt-2 space-y-6 border-t"
                                style={{ borderColor: 'var(--border-default)' }}
                            >
                                {/* 问题 */}
                                {item.expandedDetails.problem && (
                                    <DetailBlock
                                        label="问题 / 挑战"
                                        content={item.expandedDetails.problem}
                                        color="var(--color-primary)"
                                    />
                                )}

                                {/* 行动/方案 */}
                                {item.expandedDetails.solution && (
                                    <DetailBlock
                                        label="行动 / 方案"
                                        content={item.expandedDetails.solution}
                                        color="var(--text-secondary)"
                                    />
                                )}

                                {/* 结果 */}
                                {item.expandedDetails.result && (
                                    <DetailBlock
                                        label="最终结果"
                                        content={item.expandedDetails.result}
                                        color="var(--color-success)"
                                    />
                                )}

                                {/* 我的角色 */}
                                {item.expandedDetails.role && (
                                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="font-semibold mr-2" style={{ color: 'var(--text-primary)' }}>我的角色：</span>
                                            {item.expandedDetails.role}
                                        </p>
                                    </div>
                                )}

                                {/* 技术栈详情 */}
                                {item.expandedDetails.techStack && item.expandedDetails.techStack.length > 0 && (
                                    <div className="pt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {item.expandedDetails.techStack.map((tech, i) => (
                                                <span key={i} className="tag">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 链接 */}
                                {item.expandedDetails.links && item.expandedDetails.links.length > 0 && (
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {item.expandedDetails.links.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary text-xs h-8 px-3"
                                            >
                                                <ExternalLink size={14} className="mr-1.5" />
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
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
