"use client";

import React from "react";
import { m as motion, Variants } from "framer-motion";
import { HeroData } from "@/types";
import { Container } from "./ui/Container";
import { HeroStatusBadges } from "./Hero/HeroStatusBadges";
import { HeroBullets } from "./Hero/HeroBullets";
import { HeroCTA } from "./Hero/HeroCTA";
import { HeroProofPanel } from "./Hero/HeroProofPanel";
import type { HeroSpotlightItem } from "@/lib/home-highlights";
import {
  createResumeDownloadHandler,
  formatResumeFileName,
  getResumeDownloadUrl,
} from "@/lib/resume";
import {
  getPreferredScrollBehavior,
  scrollToSection,
} from "@/lib/section-scroll";

interface HeroProps {
  data: HeroData;
  proofItems: HeroSpotlightItem[];
}

function splitHeroTitle(title: string) {
  const match = title.match(/^(.*?)\uFF08(.+)\uFF09$/);

  return {
    mainTitle: match?.[1]?.trim() || title,
    focusTitle: match?.[2]?.trim(),
  };
}

export default function Hero({ data, proofItems }: HeroProps) {
  const resumeFileName = formatResumeFileName(data.title, data.name);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
  const resumeDownloadHandler = createResumeDownloadHandler(
    resumeFileName,
    resumeDownloadUrl,
  );
  const { mainTitle, focusTitle } = splitHeroTitle(data.title);

  const handleViewProjects = () => {
    if (typeof window === "undefined") return;

    scrollToSection("projects", {
      behavior: getPreferredScrollBehavior(),
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden border-b section-divider bg-white pb-7 pt-[4.6rem] sm:pb-10 sm:pt-22 md:pb-12 md:pt-24">
      <div className="hero-grid-bg hero-grid-fade pointer-events-none absolute inset-0 z-0 opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-20 top-10 h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.65),transparent_72%)] blur-3xl md:h-[28rem] md:w-[28rem]" />
        <div className="absolute right-[4%] top-[8%] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.95),transparent_76%)] blur-3xl md:h-[24rem] md:w-[24rem]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(246,248,251,0.9))]" />
      </div>
      <Container className="relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <motion.div
            className="flex flex-col items-start lg:col-span-7 xl:col-span-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-3.5 sm:mb-5">
              <HeroStatusBadges location={data.location} />
            </motion.div>

            {focusTitle ? (
              <motion.div
                variants={itemVariants}
                className="theme-pill mb-2.5 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase"
              >
                {focusTitle}
              </motion.div>
            ) : null}

            <motion.h1
              variants={itemVariants}
              className="theme-title mb-3 max-w-[11ch] text-balance text-[2.16rem] font-bold leading-[1] sm:mb-3.5 sm:text-[3.15rem] sm:leading-[0.96] md:text-[4.35rem]"
            >
              {mainTitle}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="theme-copy mb-5 max-w-[38rem] text-[14px] leading-[1.8] sm:mb-6 sm:text-[15px] sm:leading-[1.9] md:mb-7 md:text-[1.02rem] md:leading-[1.94]"
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="theme-card-muted mb-5 w-full rounded-[1.2rem] border-[rgba(148,163,184,0.16)] p-3 shadow-[0_16px_32px_rgba(15,23,42,0.05)] sm:mb-7 sm:rounded-[1.5rem] sm:p-4 md:p-5"
            >
              <p className="theme-card-kicker mb-3">价值主线</p>
              <div className="mb-4 border-b border-[color:var(--border-default)] pb-3.5">
                <HeroBullets bullets={data.bullets} />
              </div>

              <HeroCTA
                onViewProjects={handleViewProjects}
                downloadName={resumeFileName}
                downloadUrl={resumeDownloadUrl}
                onDownloadClick={resumeDownloadHandler}
              />

              <p className="theme-copy-subtle mt-3.5 text-[13px] leading-6 sm:mt-4 sm:text-[0.92rem] sm:leading-7">
                以上指标均可在项目详情与仓库中复核。
              </p>
            </motion.div>
          </motion.div>

          <div className="relative lg:col-span-5 xl:col-span-6 lg:pt-2 xl:pl-3">
            <HeroProofPanel items={proofItems} />
          </div>
        </div>
      </Container>
    </section>
  );
}
