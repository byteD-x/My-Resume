'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    MapPin
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

export default function ExperienceFlow({
    timeline,
    projects,
    isEditorActive = false,
    highlightedId = null,
    onClearHighlight
}: ExperienceFlowProps) {
    const [activeTab, setActiveTab] = useState<'work' | 'projects'>('work');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [showMoreExperiences, setShowMoreExperiences] = useState(false);

    // 分离 highlighted 和 non-highlighted 经历
    const highlightedExperiences = timeline.filter(item => item.highlighted);
    const otherExperiences = timeline.filter(item => !item.highlighted);

    // 滚动到被高亮的项目
    useEffect(() => {
        if (highlightedId) {
            const element = document.getElementById(`timeline-${highlightedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // 自动展开被高亮的项目
                setExpandedItems(prev => new Set([...prev, highlightedId]));

                // 如果是在 "更多经历" 里，自动展开
                if (otherExperiences.find(e => e.id === highlightedId)) {
                    setShowMoreExperiences(true);
                }
            }

            // 2秒后清除高亮
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
        <section className="py-24 relative bg-zinc-50" id="experience">
            <div className="container-padding">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
                            职业 <span className="text-zinc-400">履历</span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-xl">
                            从企业级系统到 AI 原生应用的成长轨迹
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        {/* 展开/收起全部 */}
                        <div className="flex gap-2">
                            <button
                                onClick={expandAll}
                                className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <ChevronDown size={14} />
                                展开全部
                            </button>
                            <button
                                onClick={collapseAll}
                                className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <ChevronUp size={14} />
                                收起全部
                            </button>
                        </div>

                        {/* Tab 切换 */}
                        <div className="flex gap-2 p-1 bg-zinc-200/50 rounded-full border border-zinc-200">
                            <button
                                onClick={() => setActiveTab('work')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'work'
                                        ? 'bg-white text-zinc-900 shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                <Briefcase size={14} />
                                工作经历
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'projects'
                                        ? 'bg-white text-zinc-900 shadow-sm'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                <FolderGit2 size={14} />
                                项目经历
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'work' && (
                            <motion.div
                                key="work"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* 时间线轴 */}
                                <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-zinc-200" />

                                {/* 重点经历 */}
                                <div className="space-y-6">
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
                                            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-6 ml-12"
                                        >
                                            {showMoreExperiences ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
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

                {/* CTA 在时间线末尾 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors"
                    >
                        下载完整简历 PDF
                        <ArrowUpRight size={18} />
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative pl-12 md:pl-16 transition-all duration-500 ${isHighlighted ? 'ring-2 ring-blue-400 ring-offset-4 rounded-2xl' : ''
                }`}
        >
            {/* 时间线节点 */}
            <div className={`absolute left-2 md:left-6 top-6 w-4 h-4 rounded-full border-4 transition-colors ${item.highlighted
                    ? 'bg-blue-500 border-blue-200'
                    : 'bg-white border-zinc-300'
                }`} />

            {/* 卡片 */}
            <div
                className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-zinc-300 shadow-lg' : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                    }`}
            >
                {/* 头部（可点击展开） */}
                <button
                    onClick={onToggle}
                    className="w-full p-6 text-left flex flex-col md:flex-row md:items-start gap-4"
                >
                    <div className="flex-1">
                        {/* 时间和公司 */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-sm font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                                {item.year}
                            </span>
                            <span className="text-zinc-400 flex items-center gap-1 text-sm">
                                <Building2 size={14} />
                                {item.company}
                            </span>
                            {item.location && (
                                <span className="text-zinc-400 flex items-center gap-1 text-sm">
                                    <MapPin size={14} />
                                    {item.location}
                                </span>
                            )}
                        </div>

                        {/* 职位标题 */}
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">
                            <EditableText
                                id={`timeline-${item.id}-role`}
                                value={item.role}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </h3>

                        {/* 摘要 */}
                        <p className="text-zinc-600 leading-relaxed">
                            <EditableText
                                id={`timeline-${item.id}-summary`}
                                value={item.summary}
                                onChange={() => { }}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </p>

                        {/* 技术标签 */}
                        {item.techTags && item.techTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.techTags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 展开/收起图标 */}
                    <div className={`p-2 rounded-full transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-zinc-400" />
                    </div>
                </button>

                {/* 展开内容 */}
                <AnimatePresence>
                    {isExpanded && item.expandedDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 border-t border-zinc-100 pt-6 space-y-6">
                                {/* 背景 */}
                                {item.expandedDetails.background && (
                                    <DetailSection title="背景" content={item.expandedDetails.background} />
                                )}

                                {/* 问题 */}
                                {item.expandedDetails.problem && (
                                    <DetailSection title="问题" content={item.expandedDetails.problem} />
                                )}

                                {/* 方案 */}
                                {item.expandedDetails.solution && (
                                    <DetailSection title="方案" content={item.expandedDetails.solution} />
                                )}

                                {/* 结果 */}
                                {item.expandedDetails.result && (
                                    <DetailSection title="结果" content={item.expandedDetails.result} />
                                )}

                                {/* 我的角色 */}
                                {item.expandedDetails.role && (
                                    <DetailSection title="我的角色" content={item.expandedDetails.role} />
                                )}

                                {/* 技术栈 */}
                                {item.expandedDetails.techStack && item.expandedDetails.techStack.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-700 mb-2">技术栈</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.expandedDetails.techStack.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 text-sm rounded-lg bg-zinc-900 text-white"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 链接 */}
                                {item.expandedDetails.links && item.expandedDetails.links.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-700 mb-2">相关链接</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {item.expandedDetails.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    <ExternalLink size={14} />
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
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

// 详情区块组件
function DetailSection({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h4 className="text-sm font-semibold text-zinc-700 mb-2">{title}</h4>
            <p className="text-zinc-600 leading-relaxed">{content}</p>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 group hover:border-zinc-300 hover:shadow-lg transition-all flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-1">
                        <EditableText
                            id={`project-${project.id}-name`}
                            value={project.name}
                            onChange={() => { }}
                            as="span"
                            isEditorActive={isEditorActive}
                        />
                    </h3>
                    <p className="text-xs font-mono text-zinc-400">
                        {project.year} {project.impact && `· ${project.impact}`}
                    </p>
                </div>
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowUpRight size={18} />
                    </a>
                )}
            </div>

            <p className="text-zinc-600 text-sm leading-relaxed mb-4 flex-grow">
                <EditableText
                    id={`project-${project.id}-summary`}
                    value={project.summary}
                    onChange={() => { }}
                    as="span"
                    isEditorActive={isEditorActive}
                />
            </p>

            <div className="space-y-3 mb-6">
                {project.details.map((detail, i) => (
                    <div key={i} className="flex gap-2 text-sm text-zinc-500">
                        <ChevronRight size={14} className="mt-1 text-zinc-300 shrink-0" />
                        <span>{detail}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 mt-auto">
                {project.tech.map((t, i) => (
                    <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600"
                    >
                        {t}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
