'use client';

import { motion } from 'framer-motion';
import { ProjectItem } from '@/types';
import { ExperienceCard } from './ExperienceCard';

interface ProjectListProps {
    items: ProjectItem[];
}

export function ProjectList({ items }: ProjectListProps) {
    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 lg:gap-6 xl:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                stiffness: 50,
                                damping: 15
                            }
                        }
                    }}
                    className="h-full"
                >
                    <ExperienceCard item={item} type="project" />
                </motion.div>
            ))}
        </motion.div>
    );
}
