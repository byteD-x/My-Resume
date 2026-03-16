"use client";

import { m as motion } from "framer-motion";
import { HeroBullet } from "@/types";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";

interface HeroBulletsProps {
  bullets: HeroBullet[];
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: HERO_ANIMATION.FADE_IN.duration,
    ease: EASING_CURVES.OUT_EXPO,
  },
};

export function HeroBullets({ bullets }: HeroBulletsProps) {
  return (
    <motion.div
      {...fadeIn}
      transition={{
        ...fadeIn.transition,
        delay: HERO_ANIMATION.DELAY_BULLETS,
      }}
      className="w-full max-w-[42rem]"
    >
      <div className="space-y-3 sm:space-y-4">
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="border-l border-zinc-200 pl-4 dark:border-zinc-800"
          >
            <p className="text-sm font-semibold tracking-wide text-zinc-950 dark:text-zinc-100">
              {bullet.title}
            </p>
            <p className="mt-1 text-[0.96rem] leading-7 text-zinc-700 dark:text-zinc-300">
              {bullet.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
