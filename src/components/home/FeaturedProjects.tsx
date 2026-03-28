"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Layers3,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { saveScrollRestore } from "@/lib/scroll-restore";
import { scrollToSection } from "@/lib/section-scroll";
import { HomepageFeaturedCard } from "@/lib/home-highlights";

interface FeaturedProjectsProps {
  items: HomepageFeaturedCard[];
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
    <Section className="theme-grid-section theme-section-dense relative scroll-mt-24 border-y section-divider !py-8 sm:!py-10 lg:!py-12">
      <Container>
        <div className="theme-section-header !mb-5 grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-5 sm:!mb-6 lg:!mb-7">
          <div>
            <p className="theme-kicker mb-2">精选案例</p>
            <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
              精选工程实践
            </h2>
            <p className="theme-section-copy">
              以下案例展示职责范围、交付结果与关键实现。
            </p>
          </div>
          <button
            type="button"
            onClick={handleJumpToProjects}
            className="theme-card-muted theme-card-interactive group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-[color:var(--text-primary)] sm:w-auto"
          >
            探索更多项目
            <ArrowRight
              size={16}
              className="motion-arrow-shift"
            />
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {items.map((item, index) => {
            const Icon = iconByIndex[index] ?? Layers3;

            return (
              <Link
                key={item.id}
                href={item.href}
                scroll={false}
                onClick={handleOpen}
                className="theme-card theme-card-interactive group flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)] sm:p-4 md:rounded-[1.6rem] md:p-5 md:shadow-[0_18px_38px_rgba(15,23,42,0.06)]"
              >
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-5 sm:gap-3.5 sm:pb-4">
                  <div className="theme-icon-box theme-icon-box-sm motion-chip">
                    <Icon size={18} strokeWidth={2} className="motion-icon-float" />
                  </div>
                  <div className="theme-chip-strong max-w-[10rem] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-right md:max-w-[11rem] md:text-[10px] md:tracking-[0.18em]">
                    {item.focus}
                  </div>
                </div>

                <div className="flex-1 space-y-4 sm:space-y-5">
                  <div>
                    <h3 className="theme-card-title text-[1.3rem] sm:text-[1.42rem]">
                      {item.name}
                    </h3>
                  </div>

                  <div className="theme-card-muted rounded-[1.1rem] border-[rgba(148,163,184,0.14)] p-3.5 sm:rounded-[1.2rem] sm:p-4">
                    <p className="theme-card-kicker mb-2.5">
                      内容定位
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                      {item.contentSummary}
                    </p>
                  </div>

                  <div className="theme-card-muted rounded-[1.1rem] border-[rgba(148,163,184,0.14)] p-3.5 sm:rounded-[1.2rem] sm:p-4">
                    <p className="theme-card-kicker mb-2.5">
                      功能描述
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                      {item.capabilitySummary}
                    </p>
                  </div>

                  <div className="border-t border-[color:var(--border-default)] pt-4 sm:pt-5">
                    <p className="theme-card-kicker mb-2.5">
                      技术描述
                    </p>
                    <p className="text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                      {item.technicalSummary}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[color:var(--border-default)] pt-3.5 sm:mt-5 sm:pt-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {item.techTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="theme-chip px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] md:text-[10px] md:tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[color:var(--text-primary)]">
                    查看案例拆解
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
