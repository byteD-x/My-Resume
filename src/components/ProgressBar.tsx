'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  className?: string;
}

export function ProgressBar({ className }: ProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  return (
    <motion.div
      className={cn(
        'absolute left-0 top-0 h-0.5 w-full origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500',
        className
      )}
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
