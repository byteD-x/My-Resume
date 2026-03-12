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
      className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white/96 p-5 shadow-sm shadow-zinc-900/4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 md:p-8 lg:p-9"
    >
      <div className="relative z-10">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Selected Work
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            近期核心实践
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {items.map((item) => {
            const content = (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {item.focus}
                </p>
                <div className="mt-2.5 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </h3>
                  <ArrowUpRight
                    size={14}
                    className="mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-700 transition-colors duration-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                  />
                </div>
                <p className="mt-2.5 text-[13px] leading-7 text-zinc-700 dark:text-zinc-300 line-clamp-3">
                  {item.summary}
                </p>
                {item.detail ? (
                  <p className="mt-4 border-t border-zinc-100 pt-3 text-[12px] leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 line-clamp-2">
                    {item.detail}
                  </p>
                ) : null}
              </>
            );

            const cardClasses =
              "group flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition-colors duration-200 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600 sm:min-h-[13.5rem] sm:p-5";

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
