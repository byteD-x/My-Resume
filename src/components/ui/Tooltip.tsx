'use client';

import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'top' | 'bottom';
    delay?: number;
}

export function Tooltip({ children, content, position = 'top', delay = 200 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: position === 'top' ? 5 : -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: position === 'top' ? 5 : -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute z-50 w-max max-w-[200px] rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white shadow-xl ${
                            position === 'top' 
                                ? 'bottom-full left-1/2 mb-2 -translate-x-1/2' 
                                : 'top-full left-1/2 mt-2 -translate-x-1/2'
                        }`}
                    >
                        {content}
                        <div 
                            className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900 ${
                                position === 'top' ? '-bottom-1' : '-top-1'
                            }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
