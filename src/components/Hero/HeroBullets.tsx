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
      <div className="space-y-2.5 sm:space-y-4">
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="border-l border-[rgba(37,99,235,0.24)] pl-3.5 sm:pl-4"
          >
            <p className="theme-title text-[14px] font-semibold tracking-wide sm:text-sm">
              {bullet.title}
            </p>
            <p className="theme-copy mt-1 text-[0.95rem] leading-[1.7] sm:text-[0.96rem] sm:leading-7">
              {bullet.description}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
