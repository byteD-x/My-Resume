import { describe, it, expect } from 'vitest';
import { defaultPortfolioData } from '@/data';
import { evaluateVerificationConfidence } from '@/lib/verification';
import type { VerificationInfo } from '@/types';

describe('verification confidence assessment', () => {
    it('builds explicit basis and reason for high confidence evidence', () => {
        const verification: VerificationInfo = {
            sourceType: 'repo',
            sourceLabel: 'GitHub Stars',
            sourceUrl: 'https://github.com/byteD-x/wechat-bot',
            verifiedAt: '2026-02-10',
            confidence: 'high',
            level: 'strict',
        };

        const assessment = evaluateVerificationConfidence(verification, new Date('2026-02-10T00:00:00.000Z'));

        expect(assessment.confidenceText).toBe('high（高）');
        expect(assessment.basis).toEqual(
            expect.arrayContaining([
                expect.stringContaining('证据口径：strict'),
                expect.stringContaining('来源类型：仓库/代码记录'),
                expect.stringContaining('已提供公开链接'),
            ]),
        );
        expect(assessment.reason).toContain('判定为高置信度');
        expect(assessment.reason).toContain('可回溯到仓库或代码记录');
    });

    it('builds explicit basis and reason for medium confidence evidence', () => {
        const verification: VerificationInfo = {
            sourceType: 'manual',
            sourceLabel: '项目合集与履历交叉验证',
            verifiedAt: '2026-02-10',
            confidence: 'medium',
            level: 'strict',
        };

        const assessment = evaluateVerificationConfidence(verification, new Date('2026-02-10T00:00:00.000Z'));

        expect(assessment.confidenceText).toBe('medium（中）');
        expect(assessment.basis).toEqual(
            expect.arrayContaining([
                expect.stringContaining('来源类型：人工整理与交叉校对'),
                expect.stringContaining('未提供公开链接'),
            ]),
        );
        expect(assessment.reason).toContain('判定为中置信度');
        expect(assessment.reason).toContain('人工整理');
    });

    it('uses explicit manual basis and reason when provided in data', () => {
        const verification: VerificationInfo = {
            sourceType: 'experience',
            sourceLabel: '交付记录',
            verifiedAt: '2026-02-10',
            confidence: 'medium',
            level: 'strict',
            confidenceBasis: ['依据 A', '依据 B'],
            confidenceReason: '该指标来自阶段性复核，先保持中置信度。',
        };

        const assessment = evaluateVerificationConfidence(verification, new Date('2026-02-10T00:00:00.000Z'));

        expect(assessment.basis).toEqual(['依据 A', '依据 B']);
        expect(assessment.reason).toBe('该指标来自阶段性复核，先保持中置信度。');
    });

    it('ensures every verification entry can output non-empty basis and reason', () => {
        const impactVerifications = defaultPortfolioData.impact
            .map((item) => item.verification)
            .filter((entry): entry is VerificationInfo => Boolean(entry));
        const timelineVerifications = defaultPortfolioData.timeline.flatMap((item) => item.verification ?? []);
        const projectVerifications = defaultPortfolioData.projects.flatMap((item) => item.verification ?? []);

        const allEntries = [...impactVerifications, ...timelineVerifications, ...projectVerifications];
        expect(allEntries.length).toBeGreaterThan(0);

        allEntries.forEach((entry) => {
            const assessment = evaluateVerificationConfidence(entry, new Date('2026-02-10T00:00:00.000Z'));
            expect(assessment.basis.length).toBeGreaterThan(0);
            expect(assessment.reason.trim().length).toBeGreaterThan(0);
        });
    });
});
