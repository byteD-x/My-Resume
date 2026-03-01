"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { defaultPortfolioData } from "@/data";
import {
  createResumeDownloadHandler,
  formatResumeFileName,
  getResumeDownloadUrl,
} from "@/lib/resume";
import { trackCTAClick, trackResumeDownload } from "@/lib/analytics";
import { useScrollPastThreshold } from "@/lib/scroll-observer";

export default function FloatingResumeButton() {
  const [isMobile, setIsMobile] = useState(false);
  const isVisible = useScrollPastThreshold(400);

  const resumeFileName = formatResumeFileName(
    defaultPortfolioData.hero.title,
    defaultPortfolioData.hero.name,
  );
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
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncMobileState = () => setIsMobile(media.matches);
    syncMobileState();
    media.addEventListener("change", syncMobileState);
    return () => media.removeEventListener("change", syncMobileState);
  }, []);

  if (isMobile) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            data-print="hide"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-0 bottom-0 left-0 z-50 flex gap-2 p-3"
            style={{
              backgroundColor: "rgba(248, 250, 252, 0.95)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid var(--border-default)",
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
            }}
          >
            <a
              href={resumeDownloadUrl}
              download={resumeFileName}
              onClick={handleResumeClick}
              className="btn btn-primary flex-1 py-3"
            >
              <Download size={16} />
              下载简历
            </a>
            <a
              href="#contact"
              onClick={handleContactClick}
              className="btn btn-secondary flex-1 py-3"
            >
              <Mail size={16} />
              联系我
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={resumeDownloadUrl}
          download={resumeFileName}
          onClick={handleResumeClick}
          data-print="hide"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary fixed right-4 bottom-4 z-50 flex items-center gap-2 px-5 py-3 font-medium shadow-lg transition-shadow hover:shadow-xl"
        >
          <Download size={18} />
          <span>下载简历</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
