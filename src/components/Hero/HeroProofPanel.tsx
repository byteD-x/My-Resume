"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { m as motion } from "framer-motion";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";
import type { HeroSpotlightItem } from "@/lib/home-highlights";

interface HeroProofPanelProps {
  items: HeroSpotlightItem[];
}

export function HeroProofPanel({ items }: HeroProofPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: HERO_ANIMATION.DELAY_CARD,
        duration: 0.5,
        ease: EASING_CURVES.OUT_EXPO,
      }}
      className="theme-card relative overflow-hidden rounded-[1.25rem] border-[rgba(148,163,184,0.16)] p-3 shadow-[0_12px_28px_rgba(15,23,42,0.065)] sm:p-4 md:rounded-[1.6rem] md:p-5 md:shadow-[0_18px_36px_rgba(15,23,42,0.07)] lg:p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(219,234,254,0.62),transparent)]" />
      <div className="relative z-10">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-6 sm:pb-4">
          <div>
            <p className="theme-card-kicker">项目证据</p>
            <h2 className="theme-title mt-1 text-[1.08rem] font-bold tracking-tight sm:mt-1.5 sm:text-[1.3rem]">
              近期代表性项目
            </h2>
          </div>
          <div className="theme-chip-strong px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.24em]">
            可复核
          </div>
        </div>

        <div className="grid grid-flow-col auto-cols-[88%] gap-2 overflow-x-auto pb-1 pr-1 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:gap-3 md:gap-4">
          {items.map((item) => {
            const content = (
              <>
                <p className="theme-card-kicker">
                  {item.focus}
                </p>
                <div className="mt-2 flex items-start justify-between gap-2.5">
                  <h3 className="theme-card-title pr-2 text-[0.96rem] sm:text-[1.02rem]">
                    {item.name}
                  </h3>
                  <span className="motion-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,99,235,0.14)] bg-white/80 text-[color:var(--text-tertiary)] transition-colors duration-200 group-hover:border-[rgba(37,99,235,0.24)] group-hover:text-[color:var(--brand-gold)]">
                    <ArrowUpRight size={14} className="motion-arrow-shift" />
                  </span>
                </div>
                <p className="theme-copy mt-2.5 line-clamp-3 text-[12px] leading-5 sm:text-[13px] sm:leading-6">
                  {item.summary}
                </p>
                {item.detail ? (
                  <p className="theme-copy mt-3 line-clamp-2 border-t border-[color:var(--border-default)] pt-2.5 text-[11px] leading-5 sm:mt-3.5 sm:pt-3 sm:text-[12px] sm:leading-6">
                    {item.detail}
                  </p>
                ) : null}
              </>
            );

            const cardClasses =
              "theme-card-muted theme-card-interactive group flex min-h-[8.6rem] flex-col rounded-[1rem] border-[rgba(148,163,184,0.14)] p-3 sm:min-h-[10.5rem] sm:rounded-[1.25rem] sm:p-3.5";

            if (!item.href) {
              return (
                <article key={item.id} className={cardClasses}>
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                scroll={false}
                className={cardClasses}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
