"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Layers3,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import { ProjectItem } from "@/types";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { saveScrollRestore } from "@/lib/scroll-restore";
import { scrollToSection } from "@/lib/section-scroll";

interface FeaturedProjectsProps {
  items: ProjectItem[];
}

const iconByIndex = [Layers3, Gauge, ShieldCheck, MessageSquareMore];

export function FeaturedProjects({ items }: FeaturedProjectsProps) {
  const handleOpen = () => {
    if (typeof window === "undefined") return;
    const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    saveScrollRestore({
      path,
      y: window.scrollY,
      section: "projects",
      ts: Date.now(),
    });
  };

  const handleJumpToProjects = () => {
    scrollToSection("projects");
  };

  return (
    <Section className="theme-grid-section relative scroll-mt-24 border-y section-divider py-20 md:py-32">
      <Container>
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
          <div className="max-w-3xl">
            <p className="theme-kicker mb-3">Featured Work</p>
            <h2 className="theme-title mb-4 text-3xl font-bold md:text-4xl">
              精选工程实践
            </h2>
            <p className="theme-copy text-[15px] leading-8">
              深入拆解复杂业务场景与系统设计，展示我如何从需求分析、架构选型到最终落地，实现端到端的生产级工程交付闭环。
            </p>
          </div>
          <button
            type="button"
            onClick={handleJumpToProjects}
            className="theme-card-muted theme-card-interactive group inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-[color:var(--text-primary)]"
          >
            探索更多项目
            <ArrowRight
              size={16}
              className="motion-arrow-shift"
            />
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {items.map((item, index) => {
            const Icon = iconByIndex[index] ?? Layers3;

            return (
              <Link
                key={item.id}
                href={`/experiences/${item.id}`}
                scroll={false}
                onClick={handleOpen}
                className="theme-card theme-card-interactive group flex h-full flex-col rounded-[1.75rem] border-[rgba(148,163,184,0.16)] p-6 shadow-[0_18px_38px_rgba(15,23,42,0.06)] md:p-8"
              >
                <div className="mb-9 flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] pb-6">
                  <div className="theme-icon-box theme-icon-box-sm motion-chip">
                    <Icon size={18} strokeWidth={2} className="motion-icon-float" />
                  </div>
                  <div className="theme-chip-strong px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]">
                    Priority 0{index + 1}
                  </div>
                </div>

                <div className="flex-1 space-y-7">
                  <div>
                    <h3 className="theme-card-title text-[1.42rem]">
                      {item.name}
                    </h3>
                    <p className="theme-card-body mt-4 text-[14px]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="theme-card-muted rounded-[1.3rem] border-[rgba(148,163,184,0.14)] p-5">
                    <p className="theme-card-kicker mb-2.5">
                      Core Challenge
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                      {item.keyOutcomes?.[0] ??
                        item.impact ??
                        "深入项目详情，了解完整的架构决策与技术难点攻克过程。"}
                    </p>
                  </div>

                  <div className="border-t border-[color:var(--border-default)] pt-6">
                    <p className="theme-card-kicker mb-2.5">
                      Business Value
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                      {item.keyOutcomes?.[1] ??
                        "完整的业务收益与验证结果，请参阅项目详情页中的详细说明。"}
                    </p>
                  </div>
                </div>

                <div className="mt-9 flex items-center justify-between border-t border-[color:var(--border-default)] pt-6">
                  <div className="flex flex-wrap gap-2">
                    {item.techTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="theme-chip px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--text-primary)]">
                    Case Study
                    <ArrowRight
                      size={14}
                      className="motion-arrow-shift"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
