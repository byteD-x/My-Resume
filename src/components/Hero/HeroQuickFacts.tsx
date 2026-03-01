"use client";

import { m as motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { HeroData } from "@/types";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";
import { use3DTilt } from "@/hooks/use3DTilt";

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
  const { ref, tiltStyle, glareStyle } = use3DTilt<HTMLDivElement>({
    maxTilt: 10,
    perspective: 1200,
    scale: 1.02,
    speed: 280,
    glare: true,
    glareOpacity: 0.12,
  });

  const defaultQuickFacts = {
    role: "后端 / 全栈 / AI 工程",
    availability: "远程优先",
    techStack: ["Java", "Spring", "Python", "LLM API", "MySQL", "Redis"],
  };

  const facts = quickFacts || defaultQuickFacts;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: HERO_ANIMATION.DELAY_CARD,
        duration: 0.6,
        ease: EASING_CURVES.OUT_EXPO,
      }}
      className="relative overflow-hidden rounded-2xl border border-white/50 bg-glass-strong p-6 shadow-2xl shadow-slate-200/50 backdrop-blur-xl md:p-8"
      style={tiltStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-cyan-500/10" />
      <div style={glareStyle} />

      <div className="relative z-10 mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
        <span className="h-[1px] w-8 bg-slate-200" />
        核心信息
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-slate-50 p-3 text-slate-600">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-slate-400 uppercase">
              岗位方向
            </div>
            <div className="text-lg font-bold text-slate-900">
              {roleSnapshot?.primaryRole || facts.role}
            </div>
            {roleSnapshot?.secondaryRole && (
              <div className="mt-1 text-sm text-slate-500">
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
            <div className="mb-1 text-xs font-semibold text-slate-400 uppercase">
              在岗状态
            </div>
            <div className="text-lg font-bold text-emerald-600">
              {roleSnapshot?.availability || facts.availability}
            </div>
            {roleSnapshot?.location && (
              <div className="mt-1 text-xs text-slate-500">
                {roleSnapshot.location}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="mb-3 text-xs font-semibold text-slate-400 uppercase">
            核心技术栈
          </div>
          <div className="flex flex-wrap gap-2">
            {facts.techStack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {roleSnapshot?.updatedAt && (
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
            数据更新：{roleSnapshot.updatedAt}
          </div>
        )}
      </div>
    </motion.div>
  );
}
