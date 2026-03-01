"use client";

import { m as motion } from "framer-motion";
import { HeroBullet } from "@/types";
import { HERO_ANIMATION, EASING_CURVES } from "@/config/animation";

interface HeroBulletsProps {
  bullets: HeroBullet[];
}

const fadeIn = {
  initial: { opacity: 0, y: 24 },
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
      className="mb-10 max-w-2xl space-y-4"
    >
      {bullets.map((bullet) => (
        <div key={bullet.id} className="group flex gap-4">
          <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 transition-transform group-hover:scale-125" />
          <div className="text-lg leading-relaxed text-slate-600">
            <strong className="mr-2 font-semibold text-slate-900">
              {bullet.title}
            </strong>
            {bullet.description}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
