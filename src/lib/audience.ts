import { AudienceType } from '@/types';

export type AudienceTargetSection = 'experience' | 'projects' | 'services' | 'contact';

const audienceSectionMap: Record<AudienceType, AudienceTargetSection> = {
    hr: 'experience',
    jobSeeker: 'projects',
    partner: 'services',
    client: 'contact',
};

export function getAudienceTargetSection(role: AudienceType): AudienceTargetSection {
    return audienceSectionMap[role];
}

export function mapAudienceTagsToSections(tags: AudienceType[]): AudienceTargetSection[] {
    return Array.from(new Set(tags.map((tag) => audienceSectionMap[tag])));
}
