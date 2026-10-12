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
            'exp-sustech',
            'exp-customer-ai-runtime',
            'exp-wechat-bot',
        ]);
    });

    it('keeps at least three resume-led technical outcomes for every grouped project', () => {
        const parent = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-independent-developer',
        );

        expect(parent).toBeDefined();
        for (const child of getGroupedChildren(parent!, defaultPortfolioData.timeline)) {
            expect(child.keyOutcomes?.filter(Boolean).length, child.id).toBeGreaterThanOrEqual(3);
        }
    });

    it('keeps every rendered timeline record at three or more outcomes', () => {
        const groupedChildIds = new Set(
            defaultPortfolioData.timeline.flatMap((item) => item.childIds ?? []),
        );
        const renderedItems = defaultPortfolioData.timeline.filter(
            (item) => !item.hideFromSection || !groupedChildIds.has(item.id),
        );

        for (const item of renderedItems) {
            expect(item.keyOutcomes?.filter(Boolean).length, item.id).toBeGreaterThanOrEqual(3);
        }
    });

    it('keeps timeline dates and current runtime labels aligned with the latest resume', () => {
        const independent = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-independent-developer',
        );
        const paper = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-paper-retrieval-platform',
        );
        const rentbox = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-rentbox',
        );
        const ipa = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-sustech',
        );
        const wechat = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-wechat-bot',
        );
        const education = defaultPortfolioData.timeline.find(
            (item) => item.id === 'exp-education',
        );

        expect(independent?.year).toBe('2025.09 - 至今');
        expect(paper?.year).toBe('2026.01 - 2026.05');
        expect(rentbox?.company).toContain('简租科技');
        expect(ipa?.company).toContain('数阁科技（深圳）');
        expect(wechat?.techTags).toContain('OpenAI-compatible API');
        expect(wechat?.techTags).not.toContain('LangGraph');
        expect(wechat?.techTags).not.toContain('ChromaDB');
        expect(education?.keyOutcomes).not.toContain(expect.stringContaining('10s+'));
        expect(education?.keyOutcomes).not.toContain(expect.stringContaining('CI/CD'));
    });
});
