import { describe, expect, it } from 'vitest';
import { defaultPortfolioData } from '@/data';

describe('site links', () => {
    it('uses the canonical self-hosted domain in contact links', () => {
        const selfHostedLink = defaultPortfolioData.contact.websiteLinks?.find((item) =>
            item.label.includes('自托管'),
        );

        expect(selfHostedLink?.url).toBe('https://www.byted.online/');
    });
});
