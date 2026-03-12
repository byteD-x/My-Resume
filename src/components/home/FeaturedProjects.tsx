"use client";

import Link from "next/link";
import { ArrowRight, Gauge, Layers3, MessageSquareMore, ShieldCheck } from "lucide-react";
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
    <Section className="relative scroll-mt-24 border-y border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 md:py-32">
      <Container>
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
              Featured Work
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl mb-4">
              精选工程实践
            </h2>
            <p className="text-[15px] leading-8 text-zinc-700 dark:text-zinc-300">
              深入拆解复杂业务场景与系统设计，展示我如何从需求分析、架构选型到最终落地，实现端到端的生产级工程交付闭环。
            </p>
          </div>
          <button
            type="button"
            onClick={handleJumpToProjects}
            className="group inline-flex items-center justify-center gap-1.5 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:text-zinc-600 dark:hover:text-zinc-400"
          >
            探索更多项目
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
                className="group flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-5 transition-colors duration-200 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 md:p-8"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Priority
                  </span>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {item.name}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                      Core Challenge
                    </p>
                    <p className="text-[14px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {item.keyOutcomes?.[0] ?? item.impact ?? "深入项目详情，了解完整的架构决策与技术难点攻克过程。"}
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                      Business Value
                    </p>
                    <p className="text-[14px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {item.keyOutcomes?.[1] ?? "完整的业务收益与验证结果，请参阅项目详情页中的详细说明。"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.techTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                    Case Study
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
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
