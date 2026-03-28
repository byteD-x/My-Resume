"use client";

import { m as motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
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
      className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-row sm:flex-wrap sm:gap-4"
      data-print="hide"
    >
      <a
        href={downloadUrl}
        download={downloadName}
        onClick={handleDownloadClick}
        className="btn btn-primary min-w-0 px-3.5 text-[13px] sm:min-w-[12.5rem] sm:px-5 sm:text-[0.9375rem]"
        aria-label="下载简历 PDF"
      >
        <Download size={16} />
        下载简历
      </a>

      <button
        type="button"
        onClick={handleViewProjects}
        disabled={!isHydrated}
        className="btn btn-secondary min-w-0 px-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[12.5rem] sm:px-5 sm:text-[0.9375rem]"
        aria-label="查看项目证据"
      >
        <ArrowRight size={16} />
        查看项目
      </button>
    </motion.div>
  );
}
