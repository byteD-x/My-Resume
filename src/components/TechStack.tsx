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
    <Section className="border-y border-zinc-200 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-950 md:py-32">
      <Container>
        <div
          className="mb-16 max-w-3xl scroll-mt-28"
          data-scroll-target="skills"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Technology Arsenal
          </p>
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            技术栈与能力边界
          </h2>
          <p className="text-[15px] leading-8 text-zinc-700 dark:text-zinc-300">
            工具只是手段，解决复杂问题才是目的。这里不堆砌名词，而是按照我在不同场景下的掌控力对技术栈分层，方便快速判断我能独立负责什么、能协作补位什么。
          </p>
        </div>

        <div className="mb-12 rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/30 md:p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              <BrainCircuit size={22} strokeWidth={2} />
            </div>
            <div className="max-w-4xl">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Working Style
              </p>
              <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {vibeCoding.title}
              </h3>
              <p className="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                {vibeCoding.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
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
              className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Capability Layer
              </p>
              <h3 className="mb-3 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {card.title}
              </h3>
              <p className="mb-4 flex-grow text-[13px] leading-7 text-zinc-700 dark:text-zinc-300">
                {card.description}
              </p>
              <div className="mt-auto">
                <p className="mb-5 border-b border-zinc-100 pb-5 text-[13px] leading-relaxed text-zinc-700 dark:border-zinc-800/80 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    承担方式：
                  </span>
                  {card.emphasis}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <span
                      key={item.raw}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-3 xl:[grid-auto-rows:1fr]">
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
                className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 lg:p-8"
              >
                <div className="mb-6 flex min-h-[7.5rem] items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex min-h-[7.5rem] flex-col">
                    <h3 className="text-[17px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      {category.category}
                    </h3>
                    {category.description ? (
                      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid flex-grow auto-rows-fr gap-3 sm:grid-cols-2">
                  {displayItems.map((item) => (
                    <article
                      key={item.raw}
                      className="flex h-full flex-col rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"
                    >
                      <p className="text-[14px] font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                        {item.label}
                      </p>
                      {item.detail ? (
                        <p className="mt-2 text-[12px] leading-6 text-zinc-600 dark:text-zinc-300">
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
                    className="mt-6 inline-flex self-start items-center gap-1.5 text-[13px] font-semibold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
