"use client";

import { m as motion } from "framer-motion";
import { ArrowDownToLine, Download } from "lucide-react";
import { EASING_CURVES, HERO_ANIMATION } from "@/config/animation";
import { useHydrated } from "@/hooks/useHydrated";
import {
  trackCTAClick,
  trackProjectEvidenceClick,
  trackResumeDownload,
} from "@/lib/analytics";
import type { ResumeDownloadClickEvent } from "@/lib/resume";

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

export function HeroCTA({
  onViewProjects,
  downloadName,
  downloadUrl,
  onDownloadClick,
}: HeroCTAProps) {
  const isHydrated = useHydrated();

  const handleDownloadClick = (event: ResumeDownloadClickEvent) => {
    trackCTAClick("resume_download", "hero");
    trackResumeDownload();
    onDownloadClick?.(event);
  };

  const handleViewProjects = () => {
    trackCTAClick("project_evidence_click", "hero");
    trackProjectEvidenceClick("hero");
    onViewProjects();
  };

  return (
    <motion.div
      {...fadeIn}
      transition={{
        ...fadeIn.transition,
        delay: HERO_ANIMATION.DELAY_CTA,
      }}
      className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
      data-print="hide"
    >
      <a
        href={downloadUrl}
        download={downloadName}
        onClick={handleDownloadClick}
        className="btn btn-primary sm:w-auto"
        aria-label="下载简历 PDF"
      >
        <Download size={18} className="opacity-90" />
        下载简历 PDF
      </a>

      <button
        type="button"
        onClick={handleViewProjects}
        disabled={!isHydrated}
        className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        aria-label="查看项目证据"
      >
        <ArrowDownToLine size={18} className="opacity-70" />
        查看项目证据
      </button>
    </motion.div>
  );
}
