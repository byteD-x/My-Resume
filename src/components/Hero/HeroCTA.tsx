'use client';

import { m as motion } from 'framer-motion';
import { ArrowDownToLine, Download } from 'lucide-react';
import { EASING_CURVES, HERO_ANIMATION } from '@/config/animation';
import { useHydrated } from '@/hooks/useHydrated';
import {
    trackProjectEvidenceClick,
    trackCTAClick,
    trackResumeDownload,
} from '@/lib/analytics';
import type { ResumeDownloadClickEvent } from '@/lib/resume';

interface HeroCTAProps {
    onViewProjects: () => void;
    downloadName: string;
    downloadUrl: string;
    onDownloadClick?: (event: ResumeDownloadClickEvent) => void;
}

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: HERO_ANIMATION.FADE_IN.duration,
        ease: EASING_CURVES.OUT_EXPO,
    },
};

export function HeroCTA({ onViewProjects, downloadName, downloadUrl, onDownloadClick }: HeroCTAProps) {
    const isHydrated = useHydrated();

    const handleDownloadClick = (event: ResumeDownloadClickEvent) => {
        trackCTAClick('resume_download', 'hero');
        trackResumeDownload();
        onDownloadClick?.(event);
    };

    const handleViewProjects = () => {
        trackCTAClick('project_evidence_click', 'hero');
        trackProjectEvidenceClick('hero');
        onViewProjects();
    };

    return (
        <motion.div
            {...fadeIn}
            transition={{
                ...fadeIn.transition,
                delay: HERO_ANIMATION.DELAY_CTA,
            }}
            className="flex flex-wrap gap-4"
            data-print="hide"
        >
            <a
                href={downloadUrl}
                download={downloadName}
                onClick={handleDownloadClick}
                data-print="hide"
                className="btn btn-primary px-8 py-3.5 text-base font-bold"
                aria-label="Download resume PDF"
            >
                <Download size={20} className="mr-2.5" />
                下载简历 PDF
            </a>

            <button
                type="button"
                onClick={handleViewProjects}
                disabled={!isHydrated}
                className="btn btn-secondary px-8 py-3.5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="View project evidence / 查看项目证据"
            >
                <ArrowDownToLine size={20} className="mr-2.5" />
                查看项目证据
            </button>
        </motion.div>
    );
}
