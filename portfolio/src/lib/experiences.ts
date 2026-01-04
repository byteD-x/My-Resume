import { defaultPortfolioData } from '@/data';
import { TimelineItem, ProjectItem } from '@/types';

export function getExperience(slug: string): TimelineItem | ProjectItem | undefined {
    const timelineItem = defaultPortfolioData.timeline.find(item => item.id === slug);
    if (timelineItem) return timelineItem;

    const projectItem = defaultPortfolioData.projects.find(item => item.id === slug);
    return projectItem;
}

export function getAllExperienceSlugs() {
    return [
        ...defaultPortfolioData.timeline.map(item => ({ slug: item.id })),
        ...defaultPortfolioData.projects.map(item => ({ slug: item.id })),
    ];
}
