"use client";

import { m as motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { HeroData } from "@/types";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";

interface HeroQuickFactsProps {
  quickFacts?: HeroData["quickFacts"];
  roleSnapshot?: HeroData["roleSnapshot"];
}

/**
 * Hero 快速信息卡片组件
 * 显示角色、在岗状态、技术栈等核心信息
 */
export function HeroQuickFacts({
  quickFacts,
  roleSnapshot,
}: HeroQuickFactsProps) {
  const defaultQuickFacts = {
    role: "后端 / 全栈 / AI 工程",
    availability: "远程优先",
    techStack: ["Java", "Spring", "Python", "LLM API", "MySQL", "Redis"],
  };

  const facts = quickFacts || defaultQuickFacts;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: HERO_ANIMATION.DELAY_CARD,
        duration: 0.6,
        ease: EASING_CURVES.OUT_EXPO,
      }}
      className="theme-card relative overflow-hidden rounded-[1.5rem] p-6 shadow-[var(--shadow-md)] md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(219,234,254,0.55)] via-transparent to-[rgba(191,219,254,0.16)]" />

      <div className="theme-kicker relative z-10 mb-6 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <span className="h-[1px] w-8 bg-[rgba(37,99,235,0.22)]" />
        核心信息
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl border border-[color:var(--border-default)] bg-[rgba(var(--surface-muted-rgb),0.78)] p-3 text-[color:var(--text-secondary)]">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="theme-copy-subtle mb-1 text-xs font-semibold uppercase">
              岗位方向
            </div>
            <div className="theme-title text-lg font-bold">
              {roleSnapshot?.primaryRole || facts.role}
            </div>
            {roleSnapshot?.secondaryRole && (
              <div className="theme-copy mt-1 text-sm">
                {roleSnapshot.secondaryRole}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-emerald-50 p-3 text-emerald-600">
            <Calendar size={20} />
          </div>
          <div>
            <div className="theme-copy-subtle mb-1 text-xs font-semibold uppercase">
              在岗状态
            </div>
            <div className="text-lg font-bold text-emerald-600">
              {roleSnapshot?.availability || facts.availability}
            </div>
            {roleSnapshot?.location && (
              <div className="theme-copy mt-1 text-xs">
                {roleSnapshot.location}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[color:var(--border-default)] pt-6">
          <div className="theme-copy-subtle mb-3 text-xs font-semibold uppercase">
            核心技术栈
          </div>
          <div className="flex flex-wrap gap-2">
            {facts.techStack.map((tag) => (
              <span
                key={tag}
                className="theme-chip px-3 py-1 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {roleSnapshot?.updatedAt && (
          <div className="theme-copy-subtle border-t border-[color:var(--border-default)] pt-4 text-xs">
            数据更新：{roleSnapshot.updatedAt}
          </div>
        )}
      </div>
    </motion.div>
  );
}
