import React from 'react';
import { m as motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export function Skeleton({ className, rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden bg-slate-200/70 dark:bg-slate-700/40',
        rounded,
        className
      )}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
