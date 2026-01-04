'use client';

import { motion } from 'framer-motion';
import { ProjectItem } from '@/types';
import { ExperienceCard } from './ExperienceCard';

interface ProjectListProps {
    items: ProjectItem[];
}

export function ProjectList({ items }: ProjectListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ExperienceCard item={item} type="project" />
                </motion.div>
            ))}
        </div>
    );
}
