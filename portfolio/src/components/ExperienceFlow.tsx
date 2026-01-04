import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Building2, ChevronRight, Briefcase, FolderGit2 } from 'lucide-react';
import { TimelineItem, ProjectItem } from '@/types';
import EditableText from './EditableText';

interface ExperienceFlowProps {
    timeline: TimelineItem[];
    projects: ProjectItem[];
    onUpdateTimeline: (index: number, field: string, value: string) => void;
    onUpdateTimelineDetail: (index: number, detailIndex: number, value: string) => void;
    onUpdateProject: (index: number, field: string, value: string) => void;
    onUpdateProjectDetail: (index: number, detailIndex: number, value: string) => void;
}

export default function ExperienceFlow({
    timeline,
    projects,
    onUpdateTimeline,
    onUpdateTimelineDetail,
    onUpdateProject,
    onUpdateProjectDetail
}: ExperienceFlowProps) {
    const [activeTab, setActiveTab] = useState<'work' | 'projects'>('work');

    return (
        <section className="py-24 relative bg-zinc-50" id="experience">
            <div className="container-padding">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
                            Career <span className="text-zinc-400">Trajectory</span>
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-xl">
                            From building enterprise systems to crafting AI-native applications.
                        </p>
                    </motion.div>

                    {/* New Tab Switcher */}
                    <div className="flex gap-2 p-1 bg-zinc-200/50 rounded-full border border-zinc-200">
                        <button
                            onClick={() => setActiveTab('work')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'work'
                                ? 'bg-white text-zinc-900 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            <Briefcase size={14} /> Work
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'projects'
                                ? 'bg-white text-zinc-900 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            <FolderGit2 size={14} /> Projects
                        </button>
                    </div>
                </div>

                <div className="relative min-h-[600px]">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 -translate-x-1/2 hidden md:block" />

                    <AnimatePresence mode="wait">
                        {activeTab === 'work' && (
                            <motion.div
                                key="work"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-12"
                            >
                                {timeline.map((item, index) => (
                                    <TimelineCard
                                        key={index}
                                        item={item}
                                        index={index}
                                        onUpdate={onUpdateTimeline}
                                        onUpdateDetail={onUpdateTimelineDetail}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {projects.map((project, index) => (
                                    <ProjectCard
                                        key={index}
                                        project={project}
                                        index={index}
                                        onUpdate={onUpdateProject}
                                        onUpdateDetail={onUpdateProjectDetail}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function TimelineCard({
    item,
    index,
    onUpdate,
    onUpdateDetail
}: {
    item: TimelineItem;
    index: number;
    onUpdate: (index: number, field: string, value: string) => void;
    onUpdateDetail: (index: number, detailIndex: number, value: string) => void;
}) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col md:flex-row gap-8 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
        >
            {/* Date (Desktop) */}
            <div className={`hidden md:flex w-1/2 justify-end px-8 ${isEven ? 'text-right' : 'text-left flex-row-reverse'}`}>
                <div className={`flex flex-col ${isEven ? 'items-end' : 'items-start'}`}>
                    <span className="text-2xl font-bold text-zinc-900 tracking-tight">{item.year}</span>
                    <span className="text-zinc-500 font-medium flex items-center gap-2 mt-1">
                        <Building2 size={14} />
                        <EditableText
                            id={`timeline-${index}-company-desk`}
                            value={item.company}
                            onChange={(_, val) => onUpdate(index, 'company', val)}
                            as="span"
                        />
                    </span>
                </div>
            </div>

            {/* Axis Node */}
            <div className={`absolute left-8 md:left-1/2 w-4 h-4 bg-white rounded-full border-4 border-zinc-200 z-10 -translate-x-1/2 hidden md:block transition-colors duration-500 hover:border-zinc-400`} />

            {/* Content Card */}
            <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                <div className="bento-card p-8 bg-white relative overflow-hidden group">
                    <div className="flex flex-col gap-4">
                        <div className="md:hidden mb-2">
                            <span className="text-sm font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded inline-block mb-2">{item.year}</span>
                            <div className="text-zinc-500 text-sm flex items-center gap-2">
                                <Building2 size={14} />
                                <EditableText
                                    id={`timeline-${index}-company-mobile`}
                                    value={item.company}
                                    onChange={(_, val) => onUpdate(index, 'company', val)}
                                    as="span"
                                />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                            <EditableText
                                id={`timeline-${index}-role`}
                                value={item.role}
                                onChange={(_, val) => onUpdate(index, 'role', val)}
                                as="span"
                            />
                        </h3>

                        <div className="text-zinc-600 leading-relaxed text-sm">
                            <EditableText
                                id={`timeline-${index}-summary`}
                                value={item.summary}
                                onChange={(_, val) => onUpdate(index, 'summary', val)}
                                as="div"
                                multiline
                            />
                        </div>

                        <ul className="space-y-3 mt-2">
                            {item.details.map((detail: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-zinc-500">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                                    <span className="leading-relaxed">
                                        <EditableText
                                            id={`timeline-${index}-detail-${i}`}
                                            value={detail}
                                            onChange={(_, val) => onUpdateDetail(index, i, val)}
                                            as="span"
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ProjectCard({
    project,
    index,
    onUpdate,
    onUpdateDetail
}: {
    project: ProjectItem;
    index: number;
    onUpdate: (index: number, field: string, value: string) => void;
    onUpdateDetail: (index: number, detailIndex: number, value: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bento-card p-6 md:p-8 group flex flex-col h-full bg-white"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors text-zinc-900">
                        <EditableText
                            id={`project-${index}-name`}
                            value={project.name}
                            onChange={(_, val) => onUpdate(index, 'name', val)}
                            as="span"
                        />
                    </h3>
                    <p className="text-xs font-mono text-zinc-400">{project.year} · {project.impact}</p>
                </div>
                <div className="flex gap-2">
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                            <ArrowUpRight size={18} />
                        </a>
                    )}
                </div>
            </div>

            <div className="text-zinc-600 mb-6 text-sm leading-relaxed flex-grow">
                <EditableText
                    id={`project-${index}-summary`}
                    value={project.summary}
                    onChange={(_, val) => onUpdate(index, 'summary', val)}
                    as="div"
                    multiline
                />
            </div>

            <div className="space-y-4 mb-6">
                {project.details.map((detail: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-zinc-500">
                        <ChevronRight size={14} className="mt-1 text-zinc-300 shrink-0" />
                        <span className="flex-1">
                            <EditableText
                                id={`project-${index}-detail-${i}`}
                                value={detail}
                                onChange={(_, val) => onUpdateDetail(index, i, val)}
                                as="span"
                            />
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-zinc-100">
                {project.tech.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 text-xs rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600">
                        {t}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
