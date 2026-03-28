"use client";

import React, { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import {
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  Layout,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { SkillCategory, VibeCodingData } from "@/types";
import { Container } from "./ui/Container";
import { Section } from "./ui/Section";

const categoryIcons: Record<string, LucideIcon> = {
  Backend: Code2,
  "后端开发": Code2,
  "后端架构": Code2,
  "核心栈 (Primary)": BrainCircuit,
  Data: Database,
  "数据存储": Database,
  "数据与中间件": Database,
  "了解（可协作落地）": Database,
  "AI Engineering": BrainCircuit,
  "AI 工程化": BrainCircuit,
  Engineering: Terminal,
  "工程 & 运维": Terminal,
  "DevOps 与云原生": Terminal,
  "扩展栈 (Proficient)": Terminal,
  Frontend: Layout,
  "前端 & 全栈": Layout,
  "前端与全栈": Layout,
  "周边栈 (Familiar)": Layout,
};

interface TechStackProps {
  skills: SkillCategory[];
  vibeCoding: VibeCodingData;
}

interface ParsedSkillItem {
  label: string;
  detail: string | null;
  raw: string;
}

function parseSkillItem(item: string): ParsedSkillItem {
  const normalized = item.trim();
  const match = normalized.match(/^(.*?)\s*[（(]([^（）()]+)[）)]$/);

  if (!match) {
    return {
      label: normalized,
      detail: null,
      raw: normalized,
    };
  }

  return {
    label: match[1].trim(),
    detail: match[2].trim(),
    raw: normalized,
  };
}

export default function TechStack({ skills, vibeCoding }: TechStackProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const strategyCards = useMemo(() => {
    return skills.slice(0, 3).map((category, index) => ({
      id: category.id,
      title: category.category,
      description: category.description,
      emphasis:
        index === 0
          ? "负责方案设计、核心实现和结果复核。"
          : index === 1
            ? "负责落地、联调、部署和质量门禁。"
            : "作为扩展能力快速接手和协作落地。",
      items: category.items.slice(0, 4).map(parseSkillItem),
    }));
  }, [skills]);

  return (
    <Section className="theme-grid-section theme-section-balanced relative border-y section-divider">
      <Container>
        <div
          className="theme-section-header scroll-mt-28"
          data-scroll-target="skills"
        >
          <p className="theme-kicker mb-3">
            Technology Arsenal
          </p>
          <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
            技术栈与能力边界
          </h2>
          <p className="theme-section-copy">
            工具只是手段，解决复杂问题才是目的。这里不堆砌名词，而是按照我在不同场景下的掌控力对技术栈分层，方便快速判断我能独立负责什么、能协作补位什么。
          </p>
        </div>

        <div className="theme-card-muted mb-9 rounded-2xl border-[rgba(148,163,184,0.14)] p-[1.125rem] shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:mb-12 sm:p-6 md:rounded-[1.6rem] md:p-8">
          <div className="flex items-start gap-5">
            <div className="theme-icon-box theme-icon-box-md">
              <BrainCircuit size={22} strokeWidth={2} />
            </div>
            <div className="max-w-4xl pt-0.5">
              <p className="theme-card-kicker mb-2">
                Working Style
              </p>
              <h3 className="theme-card-title mb-3.5 text-[1.1rem]">
                {vibeCoding.title}
              </h3>
              <p className="theme-card-body text-[14px]">
                {vibeCoding.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-9 grid gap-[1.125rem] lg:grid-cols-3 lg:[grid-auto-rows:1fr] lg:gap-6 sm:mb-12 sm:gap-5">
          {strategyCards.map((card, index) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: index * 0.06,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="theme-card theme-card-interactive flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-[1.125rem] transition-colors hover:border-[rgba(37,99,235,0.22)] sm:p-6 md:rounded-[1.6rem]"
            >
              <p className="theme-card-kicker mb-3">
                Capability Layer
              </p>
              <h3 className="theme-card-title mb-3 text-[1.06rem] sm:text-[1.08rem]">
                {card.title}
              </h3>
              <p className="theme-card-body mb-[1.125rem] flex-grow text-[13px] sm:mb-5">
                {card.description}
              </p>
              <div className="mt-auto">
                <p className="theme-copy mb-[1.125rem] border-b border-[color:var(--border-default)] pb-[1.125rem] text-[13px] leading-7 sm:mb-5 sm:pb-5">
                  <span className="font-semibold text-[color:var(--text-primary)]">
                    承担方式：
                  </span>
                  {card.emphasis}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <span
                      key={item.raw}
                      className="theme-chip px-3 py-1.5 text-[11px] font-semibold"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:gap-8 xl:grid-cols-3 xl:[grid-auto-rows:1fr]">
          {skills.map((category, index) => {
            const Icon = categoryIcons[category.category] ?? Code2;
            const isExpanded = expandedCategories[category.id];
            const parsedItems = category.items.map(parseSkillItem);
            const displayItems = isExpanded
              ? parsedItems
              : parsedItems.slice(0, 6);
            const remainingCount = Math.max(parsedItems.length - 6, 0);

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="theme-card theme-card-interactive flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-[1.125rem] sm:p-6 md:rounded-[1.6rem] lg:p-8"
              >
                <div className="mb-6 flex min-h-[7rem] items-start gap-3.5 border-b border-[color:var(--border-default)] pb-[1.125rem] sm:mb-7 sm:min-h-[7.75rem] sm:gap-4 sm:pb-5">
                  <div className="theme-icon-box theme-icon-box-sm">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex min-h-[6.75rem] flex-col pt-0.5 sm:min-h-[7.5rem]">
                    <h3 className="theme-card-title text-[1.05rem]">
                      {category.category}
                    </h3>
                    {category.description ? (
                      <p className="theme-card-body mt-2 text-[13px]">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid flex-grow auto-rows-fr gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {displayItems.map((item) => (
                    <article
                      key={item.raw}
                      className="theme-card-muted flex h-full flex-col rounded-[1.1rem] p-4"
                    >
                      <p className="theme-title text-[14px] font-semibold leading-6">
                        {item.label}
                      </p>
                      {item.detail ? (
                        <p className="theme-copy mt-2 text-[12px] leading-6">
                          {item.detail}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>

                {remainingCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="theme-link mt-5 inline-flex self-start items-center gap-1.5 text-[13px] font-semibold sm:mt-6"
                  >
                    {isExpanded ? "收起" : `查看全部 (+${remainingCount})`}
                    {isExpanded ? (
                      <ChevronUp size={14} strokeWidth={2.5} />
                    ) : (
                      <ChevronDown size={14} strokeWidth={2.5} />
                    )}
                  </button>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
