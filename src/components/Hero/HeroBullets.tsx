'use client';

import { motion } from 'framer-motion';
import { HeroBullet } from '@/types';
import EditableText from '../EditableText';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';

interface HeroBulletsProps {
    bullets: HeroBullet[];
    isEditorActive?: boolean;
    onBulletChange?: (index: number, field: 'title' | 'description', value: string) => void;
}

const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { 
        duration: HERO_ANIMATION.FADE_IN.duration, 
        ease: EASING_CURVES.OUT_EXPO 
    }
};

/**
 * Hero 能力要点组件
 * 显示3个核心能力点
 */
export function HeroBullets({
    bullets,
    isEditorActive = false,
    onBulletChange,
}: HeroBulletsProps) {
    return (
        <motion.div
            {...fadeIn}
            transition={{ 
                ...fadeIn.transition,
                delay: HERO_ANIMATION.DELAY_BULLETS 
            }}
            className="space-y-4 mb-10 max-w-2xl"
        >
            {bullets.map((bullet, index) => (
                <div key={bullet.id} className="flex gap-4 group">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="text-lg text-slate-600 leading-relaxed">
                        <strong className="font-semibold text-slate-900 mr-2">
                            <EditableText
                                id={`hero-bullet-${index}-title`}
                                value={bullet.title}
                                onChange={(_, value) => onBulletChange?.(index, 'title', value)}
                                as="span"
                                isEditorActive={isEditorActive}
                            />
                        </strong>
                        <EditableText
                            id={`hero-bullet-${index}-desc`}
                            value={bullet.description}
                            onChange={(_, value) => onBulletChange?.(index, 'description', value)}
                            as="span"
                            isEditorActive={isEditorActive}
                        />
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
