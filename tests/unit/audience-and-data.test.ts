import { describe, it, expect } from 'vitest';
import { mapAudienceTagsToSections, getAudienceTargetSection } from '@/lib/audience';
import { allCoreImpactHasStrictVerification, getCoreImpactWithoutVerification } from '@/lib/data-validation';
import { defaultPortfolioData } from '@/data';
import {
    getGroupedChildren,
    getVisibleSectionItems,
} from '@/lib/experience-presentation';

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

describe('grouped experience presentation', () => {
    it('keeps grouped child experiences out of the top-level timeline list', () => {
        const visibleItems = getVisibleSectionItems(defaultPortfolioData.timeline);

        expect(visibleItems.some((item) => item.id === 'exp-independent-developer')).toBe(true);
        expect(visibleItems.some((item) => item.id === 'exp-rentbox')).toBe(false);
        expect(
            visibleItems.some((item) => item.id === 'exp-paper-retrieval-platform'),
        ).toBe(false);
        expect(
            visibleItems.some((item) => item.id === 'exp-customer-ai-runtime'),
        ).toBe(false);
        expect(visibleItems.some((item) => item.id === 'exp-wechat-bot')).toBe(false);
    });

    it('returns grouped children in the declared childIds order', () => {
        const parent = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-independent-developer',
        );

        expect(parent).toBeDefined();
        expect(getGroupedChildren(parent!, defaultPortfolioData.timeline).map((item) => item.id)).toEqual([
            'exp-rentbox',
            'exp-paper-retrieval-platform',
            'exp-customer-ai-runtime',
            'exp-wechat-bot',
        ]);
    });
});
