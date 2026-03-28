"use client";

import React, { useState } from "react";
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
  "核心栈": BrainCircuit,
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
  "扩展栈": Terminal,
  "扩展栈 (Proficient)": Terminal,
  Frontend: Layout,
  "前端 & 全栈": Layout,
  "前端与全栈": Layout,
  "协作栈": Layout,
  "周边栈 (Familiar)": Layout,
};

interface TechStackProps {
  skills: SkillCategory[];
  vibeCoding: VibeCodingData;
  techOverview?: Array<{
    id: string;
    label: string;
    items: string[];
  }>;
}

interface ParsedSkillItem {
  label: string;
  detail: string | null;
  raw: string;
}

const DEFAULT_VISIBLE_SKILL_ITEMS = 4;

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

export default function TechStack({
  skills,
  vibeCoding,
  techOverview = [],
}: TechStackProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Section className="theme-grid-section theme-section-balanced relative border-y section-divider">
      <Container>
        <div
          className="theme-section-header scroll-mt-28"
          data-scroll-target="skills"
        >
          <p className="theme-kicker mb-3">技术版图</p>
          <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
            技术栈与能力边界
          </h2>
          <p className="theme-section-copy">
            按承担范围分层展示技术栈与协作边界。
          </p>
        </div>

        <div className="theme-card-muted mb-6 rounded-2xl border-[rgba(148,163,184,0.14)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] sm:mb-7 sm:p-4 md:rounded-[1.45rem] md:p-5">
          <div className="flex items-start gap-4">
            <div className="theme-icon-box theme-icon-box-md">
              <BrainCircuit size={22} strokeWidth={2} />
            </div>
            <div className="max-w-4xl pt-0.5">
              <p className="theme-card-kicker mb-2">工程方法</p>
              <h3 className="theme-card-title mb-2.5 text-[1.04rem]">
                {vibeCoding.title}
              </h3>
              <p className="theme-card-body text-[14px]">
                {vibeCoding.description}
              </p>
            </div>
          </div>
        </div>

        {techOverview.length > 0 ? (
          <div className="theme-card-muted mb-6 rounded-[1.45rem] border-[rgba(148,163,184,0.14)] p-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:mb-7 sm:p-4 md:p-5">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {techOverview.map((group) => (
                <div
                  key={group.id}
                  className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-[rgba(255,255,255,0.72)] p-3"
                >
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-gold)]" />
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-[color:var(--text-tertiary)]">
                      {group.label}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((tag) => (
                      <span
                        key={`${group.id}-${tag}`}
                        className="theme-chip bg-[rgba(255,255,255,0.88)] px-2.5 py-1 text-[11px] font-semibold leading-5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3.5 lg:gap-4 xl:grid-cols-3 sm:gap-4">
          {skills.map((category, index) => {
            const Icon = categoryIcons[category.category] ?? Code2;
            const isExpanded = expandedCategories[category.id];
            const parsedItems = category.items.map(parseSkillItem);
            const displayItems = isExpanded
              ? parsedItems
              : parsedItems.slice(0, DEFAULT_VISIBLE_SKILL_ITEMS);
            const remainingCount = Math.max(
              parsedItems.length - DEFAULT_VISIBLE_SKILL_ITEMS,
              0,
            );

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
                className="theme-card theme-card-interactive flex flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-4 sm:p-4 md:rounded-[1.45rem] md:p-5 lg:p-5"
              >
                <div className="mb-4 flex items-start gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-5 sm:gap-3.5 sm:pb-4">
                  <div className="theme-icon-box theme-icon-box-sm">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h3 className="theme-card-title text-[1.02rem]">
                      {category.category}
                    </h3>
                    {category.description ? (
                      <p className="theme-card-body mt-1.5 text-[13px]">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid auto-rows-fr gap-2 sm:grid-cols-2 sm:gap-2.5">
                  {displayItems.map((item) => (
                    <article
                      key={item.raw}
                      className="theme-card-muted flex h-full flex-col rounded-[1rem] p-3"
                    >
                      <p className="theme-title text-[13px] font-semibold leading-6">
                        {item.label}
                      </p>
                      {item.detail ? (
                        <p className="theme-copy mt-1.5 text-[12px] leading-6">
                          {item.detail}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>

                <p className="theme-copy mt-3.5 border-t border-[color:var(--border-default)] pt-3 text-[12px] leading-6 sm:mt-4 sm:pt-3.5">
                  <span className="font-semibold text-[color:var(--text-primary)]">
                    承担方式：
                  </span>
                  {index === 0
                    ? "可独立负责方案设计、核心实现与结果复核。"
                    : index === 1
                      ? "可负责落地实施、联调部署与质量控制。"
                      : "可在协作场景中快速接手并补位。"}
                </p>

                {remainingCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="theme-link mt-4 inline-flex self-start items-center gap-1.5 text-[13px] font-semibold sm:mt-5"
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
