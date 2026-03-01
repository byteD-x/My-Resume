"use client";

import { m as motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const blobTransition = {
  duration: 18,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function ImmersiveBackdrop() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-48 -left-40 h-[36rem] w-[36rem] rounded-full bg-sky-300/20 blur-[120px]" />
        <div className="absolute top-[30%] -right-40 h-[38rem] w-[38rem] rounded-full bg-blue-300/20 blur-[140px]" />
        <div className="absolute bottom-[-12rem] left-[25%] h-[36rem] w-[36rem] rounded-full bg-cyan-300/20 blur-[130px]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <motion.div
        className="absolute -top-56 -left-48 h-[44rem] w-[44rem] rounded-full bg-sky-400/20 blur-[130px] will-change-transform"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        animate={{
          x: [0, 120, 20],
          y: [0, 80, -30],
          scale: [1, 1.15, 0.95],
        }}
        transition={blobTransition}
      />
      <motion.div
        className="absolute top-[18%] -right-56 h-[50rem] w-[50rem] rounded-full bg-blue-500/16 blur-[150px] will-change-transform"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        animate={{
          x: [0, -140, -20],
          y: [0, -70, 50],
          scale: [1, 0.92, 1.08],
        }}
        transition={{ ...blobTransition, duration: 22 }}
      />
      <motion.div
        className="absolute bottom-[-18rem] left-[20%] h-[48rem] w-[48rem] rounded-full bg-cyan-400/14 blur-[145px] will-change-transform"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        animate={{
          x: [0, 80, -60],
          y: [0, -90, 10],
          scale: [1, 1.1, 0.9],
        }}
        transition={{ ...blobTransition, duration: 20 }}
      />
      <div className="immersive-grid absolute inset-0 opacity-40" />
      <div className="immersive-grain absolute inset-0 opacity-30" />
    </div>
  );
}
