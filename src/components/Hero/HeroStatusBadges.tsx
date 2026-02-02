'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { 
        duration: HERO_ANIMATION.FADE_IN.duration, 
        ease: EASING_CURVES.OUT_EXPO 
    }
};

interface HeroStatusBadgesProps {
    location?: string;
}

/**
 * Hero 状态徽章组件
 * 显示"可立即入职"和地点信息
 */
export function HeroStatusBadges({ location }: HeroStatusBadgesProps) {
    return (
        <motion.div
            {...fadeIn}
            className="flex flex-wrap items-center gap-3 mb-6"
        >
            <Badge 
                variant="accent" 
                className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3.5 text-sm"
            >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                可立即入职
            </Badge>
            <Badge 
                variant="outline" 
                className="py-1.5 px-3.5 text-sm font-normal text-slate-500 bg-white shadow-sm"
            >
                <MapPin size={14} className="mr-1.5 opacity-70" />
                {location || "深圳 / 南京 / 西安 / 杭州 / 成都"}
            </Badge>
        </motion.div>
    );
}
