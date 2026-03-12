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

  const conciseSummary =
    "专注于将前沿 AI 技术转化为稳定、可控、高 ROI 的生产级系统。我不只搭建复杂的检索与代理链路，更通过严格的质量门禁和性能治理，确保每一行代码都能真实交付业务价值。";
  const titleParts = {
    primary: "AI 应用工程师",
    secondary: "RAG 检索增强 / Agent 运行时 / 业务系统集成",
  };
  const conciseBullets = [
    {
      id: "hero-proof-1",
      title: "企业级 RAG 与多路检索",
      description:
        "构建支持多路召回、引用溯源与持续评估的复杂问答链路，确保 AI 输出可解释、可追溯、防幻觉。",
    },
    {
      id: "hero-proof-2",
      title: "Agent 编排与多模态互联",
      description:
        "设计灵活的运行时架构，打通文本、语音、RTC 通道，无缝接入业务工具、宿主鉴权与人工干预闭环。",
    },
    {
      id: "hero-proof-3",
      title: "全栈交付与可复核基线",
      description:
        "将性能优化、成本治理、自动化测试与 CI/CD 深度结合，让 AI 方案脱离“玩具阶段”，实现真正的工业级高可用。",
    },
  ];

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
              <span className="block mb-3">{titleParts.primary}</span>
              <span className="block text-lg font-medium leading-8 text-zinc-600 dark:text-zinc-300 sm:text-[1.35rem]">
                {titleParts.secondary}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mb-10 max-w-[42rem] text-base leading-8 text-zinc-700 dark:text-zinc-300 md:mb-12 md:text-[1.05rem]"
            >
              {conciseSummary}
            </motion.p>

            <motion.div variants={itemVariants} className="w-full mb-12">
              <HeroBullets bullets={conciseBullets} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <HeroCTA
                onViewProjects={handleViewProjects}
                downloadName={resumeFileName}
                downloadUrl={resumeDownloadUrl}
                onDownloadClick={resumeDownloadHandler}
              />
            </motion.div>
          </motion.div>

          <div className="relative lg:col-span-5 xl:col-span-6 lg:pt-2 xl:pl-4">
            <HeroProofPanel items={proofItems} />
          </div>
        </div>
      </Container>
    </section>
  );
}
