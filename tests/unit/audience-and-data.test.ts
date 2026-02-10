import { describe, it, expect } from 'vitest';
import { mapAudienceTagsToSections, getAudienceTargetSection } from '@/lib/audience';
import { allCoreImpactHasStrictVerification, getCoreImpactWithoutVerification } from '@/lib/data-validation';
import { defaultPortfolioData } from '@/data';

describe('audience mapping', () => {
    it('maps audience tags to unique target sections', () => {
        const sections = mapAudienceTagsToSections(['hr', 'jobSeeker', 'hr', 'client']);
        expect(sections).toEqual(['experience', 'projects', 'contact']);
    });

    it('returns stable target section for each audience role', () => {
        expect(getAudienceTargetSection('hr')).toBe('experience');
        expect(getAudienceTargetSection('jobSeeker')).toBe('projects');
        expect(getAudienceTargetSection('partner')).toBe('services');
        expect(getAudienceTargetSection('client')).toBe('contact');
    });
});

describe('impact verification policy', () => {
    it('ensures core impact cards include strict verification', () => {
        expect(allCoreImpactHasStrictVerification(defaultPortfolioData.impact)).toBe(true);
        expect(getCoreImpactWithoutVerification(defaultPortfolioData.impact)).toEqual([]);
    });
});
