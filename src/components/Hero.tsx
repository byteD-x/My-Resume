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

export default function Hero({ data, proofItems }: HeroProps) {
  const resumeFileName = formatResumeFileName(data.title, data.name);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
  const resumeDownloadHandler = createResumeDownloadHandler(
    resumeFileName,
    resumeDownloadUrl,
  );

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
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white pb-14 pt-22 dark:border-zinc-800 dark:bg-zinc-950 sm:pb-16 sm:pt-24 md:pb-24 md:pt-32">
      <Container className="relative">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <motion.div
            className="flex flex-col items-start lg:col-span-7 xl:col-span-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <HeroStatusBadges location={data.location} />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-balance font-heading text-[2.2rem] font-bold leading-[1.08] text-zinc-950 dark:text-zinc-50 sm:mb-8 sm:text-5xl md:text-[4rem]"
            >
              {data.title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-10 max-w-[42rem] text-base leading-8 text-zinc-700 dark:text-zinc-300 md:mb-12 md:text-[1.05rem]"
            >
              {data.subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="mb-12 w-full">
              <HeroBullets bullets={data.bullets} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <HeroCTA
                onViewProjects={handleViewProjects}
                downloadName={resumeFileName}
                downloadUrl={resumeDownloadUrl}
                onDownloadClick={resumeDownloadHandler}
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-7 text-zinc-500 dark:text-zinc-400"
            >
              以上指标均可在项目详情与仓库中复核。
            </motion.p>
          </motion.div>

          <div className="relative lg:col-span-5 xl:col-span-6 lg:pt-2 xl:pl-4">
            <HeroProofPanel items={proofItems} />
          </div>
        </div>
      </Container>
    </section>
  );
}
