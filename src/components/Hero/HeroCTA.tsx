"use client";

import { ArrowRight, Download } from "lucide-react";
import { useHydrated } from "@/hooks/useHydrated";
import {
  trackCTAClick,
  trackProjectEvidenceClick,
  trackResumeDownload,
} from "@/lib/analytics";
import {
  createResumeDownloadHandler,
  type ResumeDownloadClickEvent,
} from "@/lib/resume";
import {
  getPreferredScrollBehavior,
  scrollToSection,
} from "@/lib/section-scroll";
import { useUiCopy } from "@/lib/LocaleProvider";

interface HeroCTAProps {
  downloadName: string;
  downloadUrl: string;
}

export function HeroCTA({ downloadName, downloadUrl }: HeroCTAProps) {
  const copy = useUiCopy();
  const isHydrated = useHydrated();
  const handleStaticDownload = createResumeDownloadHandler(
    downloadName,
    downloadUrl,
  );

  const handleDownloadClick = (event: ResumeDownloadClickEvent) => {
    trackCTAClick("resume_download", "hero");
    trackResumeDownload();
    handleStaticDownload?.(event);
  };

  const handleViewProjects = () => {
    trackCTAClick("project_evidence_click", "hero");
    trackProjectEvidenceClick("hero");
    scrollToSection("projects", {
      behavior: getPreferredScrollBehavior(),
    });
  };

  return (
    <div
      className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-row sm:flex-wrap sm:gap-4"
      data-print="hide"
    >
      <a
        href={downloadUrl}
        download={downloadName}
        onClick={handleDownloadClick}
        className="btn btn-primary min-w-0 px-3.5 text-[13px] sm:min-w-[12.5rem] sm:px-5 sm:text-[0.9375rem]"
        aria-label={copy.hero.resumeAria}
      >
        <Download size={16} />
        {copy.hero.resume}
      </a>

      <button
        type="button"
        onClick={handleViewProjects}
        disabled={!isHydrated}
        className="btn btn-secondary min-w-0 px-3 text-[13px] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[12.5rem] sm:px-5 sm:text-[0.9375rem]"
        aria-label={copy.hero.projectsAria}
      >
        <ArrowRight size={16} />
        {copy.hero.projects}
      </button>
    </div>
  );
}
