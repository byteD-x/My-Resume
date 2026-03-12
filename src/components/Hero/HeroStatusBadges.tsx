"use client";

import { m as motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: HERO_ANIMATION.FADE_IN.duration,
    ease: EASING_CURVES.OUT_EXPO,
  },
};

interface HeroStatusBadgesProps {
  location?: string;
}

export function HeroStatusBadges({ location }: HeroStatusBadgesProps) {
  return (
    <motion.div {...fadeIn} className="flex flex-wrap items-center gap-4">
      <span className="inline-flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        远程优先
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <MapPin size={14} className="opacity-70" />
        {location ?? "深圳 / 南京 / 杭州 / 成都"}
      </span>
    </motion.div>
  );
}
