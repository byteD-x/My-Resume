"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import {
  createResumeDownloadHandler,
  formatResumeFileName,
  getResumeDownloadUrl,
} from "@/lib/resume";
import { trackCTAClick, trackResumeDownload } from "@/lib/analytics";
import { scrollToSection } from "@/lib/section-scroll";
import { useScrollPastThreshold } from "@/lib/scroll-observer";
import { cn } from "@/lib/utils";

type DesktopVariant = "fixed" | "dock" | "hidden";
type MobileVariant = "bar" | "inline" | "hidden";

interface FloatingResumeButtonProps {
  resumeOwnerName: string;
  resumeOwnerTitle: string;
  desktopVariant?: DesktopVariant;
  mobileVariant?: MobileVariant;
  className?: string;
  mobileClassName?: string;
  extraMobileAction?: React.ReactNode;
  mobileShowContactAction?: boolean;
}

export default function FloatingResumeButton({
  resumeOwnerName,
  resumeOwnerTitle,
  desktopVariant = "fixed",
  mobileVariant = "bar",
  className,
  mobileClassName,
  extraMobileAction,
  mobileShowContactAction = true,
}: FloatingResumeButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isVisible = useScrollPastThreshold(400);

  const resumeFileName = formatResumeFileName(resumeOwnerTitle, resumeOwnerName);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
  const resumeDownloadHandler = useMemo(
    () => createResumeDownloadHandler(resumeFileName, resumeDownloadUrl),
    [resumeDownloadUrl, resumeFileName],
  );

  const handleResumeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    trackCTAClick("resume_download", "floating");
    trackResumeDownload();
    resumeDownloadHandler?.(event);
  };

  const handleContactClick = () => {
    trackCTAClick("contact", "floating");
    scrollToSection("contact");
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncMobileState = () => setIsMobile(media.matches);
    syncMobileState();
    media.addEventListener("change", syncMobileState);
    return () => media.removeEventListener("change", syncMobileState);
  }, []);

  if (!isVisible) {
    return null;
  }

  if (isMobile) {
    if (mobileVariant === "hidden") {
      return null;
    }

    const mobileActions = (
      <>
        {extraMobileAction}
        <a
          href={resumeDownloadUrl}
          download={resumeFileName}
          onClick={handleResumeClick}
          className="btn btn-primary pointer-events-auto flex-1 py-3"
        >
          <Download size={16} />
          下载简历
        </a>
        {mobileShowContactAction ? (
          <button
            type="button"
            onClick={handleContactClick}
            className="btn btn-secondary pointer-events-auto flex-1 py-3"
          >
            <Mail size={16} />
            联系我
          </button>
        ) : null}
      </>
    );

    if (mobileVariant === "inline") {
      return (
        <motion.div
          data-print="hide"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "pointer-events-none flex w-full items-center gap-2.5",
            mobileClassName,
          )}
        >
          {mobileActions}
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          data-print="hide"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex gap-2.5 p-3",
            mobileClassName,
          )}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderTop: "1px solid var(--border-default)",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
          {mobileActions}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (desktopVariant === "hidden") {
    return null;
  }

  const desktopButton = (
    <>
      <span className="inline-flex min-w-0 items-center gap-2">
        <Download size={16} />
        <span className="text-balance leading-5">下载简历</span>
      </span>
      {desktopVariant === "dock" ? (
        <span className="theme-floating-meta text-left leading-5">
          PDF · 当前版本
        </span>
      ) : null}
    </>
  );

  return (
    <AnimatePresence>
      <motion.a
        href={resumeDownloadUrl}
        download={resumeFileName}
        onClick={handleResumeClick}
        data-print="hide"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: desktopVariant === "dock" ? 1.01 : 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          desktopVariant === "dock"
            ? "theme-floating-trigger motion-chip pointer-events-auto flex w-full flex-col items-start gap-2 rounded-[1.15rem] px-4 py-3.5 text-sm font-semibold"
            : "btn btn-primary pointer-events-auto fixed right-4 bottom-4 z-50 flex items-center gap-2 px-5 py-3 font-medium shadow-lg transition-shadow hover:shadow-xl",
          className,
        )}
      >
        {desktopButton}
      </motion.a>
    </AnimatePresence>
  );
}
