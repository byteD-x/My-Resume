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
      className="theme-card relative overflow-hidden rounded-[1.95rem] border-[rgba(148,163,184,0.16)] p-5 shadow-[0_20px_42px_rgba(15,23,42,0.08)] sm:p-6 md:p-8 lg:p-9"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(219,234,254,0.78),transparent)]" />
      <div className="relative z-10">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-[color:var(--border-default)] pb-6">
          <div>
            <p className="theme-card-kicker">Selected Work</p>
            <h2 className="theme-title mt-2 text-[1.35rem] font-bold tracking-tight">
              近期核心实战
            </h2>
          </div>
          <div className="theme-chip-strong px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]">
            Evidence First
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {items.map((item) => {
            const content = (
              <>
                <p className="theme-card-kicker">
                  {item.focus}
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h3 className="theme-card-title pr-2 text-[1.02rem]">
                    {item.name}
                  </h3>
                  <span className="motion-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,99,235,0.14)] bg-white/80 text-[color:var(--text-tertiary)] transition-colors duration-200 group-hover:border-[rgba(37,99,235,0.24)] group-hover:text-[color:var(--brand-gold)]">
                    <ArrowUpRight size={14} className="motion-arrow-shift" />
                  </span>
                </div>
                <p className="theme-copy mt-4 line-clamp-3 text-[13px] leading-7">
                  {item.summary}
                </p>
                {item.detail ? (
                  <p className="theme-copy mt-5 line-clamp-2 border-t border-[color:var(--border-default)] pt-4 text-[12px] leading-6">
                    {item.detail}
                  </p>
                ) : null}
              </>
            );

            const cardClasses =
              "theme-card-muted theme-card-interactive group flex flex-col rounded-[1.35rem] border-[rgba(148,163,184,0.14)] p-4 sm:min-h-[14.5rem] sm:p-5";

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
