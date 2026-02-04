'use client';

import { motion } from 'framer-motion';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { HERO_ANIMATION, EASING_CURVES } from '@/config/animation';

interface HeroCTAProps {
    onOpenModal: () => void;
    downloadName: string;
    downloadUrl: string;
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
 * Hero CTA 按钮组组件
 * 显示下载简历和预约面谈按钮
 */
export function HeroCTA({ onOpenModal, downloadName: resumeFileName, downloadUrl }: HeroCTAProps) {
    return (
        <motion.div
            {...fadeIn}
            transition={{ 
                ...fadeIn.transition,
                delay: HERO_ANIMATION.DELAY_CTA 
            }}
            className="flex flex-wrap gap-4"
            data-print="hide"
        >
            <a
                href={downloadUrl}
                download={resumeFileName}
                data-print="hide"
                className="btn btn-primary px-8 py-3.5 text-base font-bold"
                aria-label="下载 PDF 简历"
            >
                <Download size={20} className="mr-2.5" />
                下载 PDF 简历
            </a>
            <button
                onClick={onOpenModal}
                className="btn btn-secondary px-8 py-3.5 text-base font-semibold"
                aria-label="预约面谈"
            >
                <CalendarIcon size={20} className="mr-2.5" />
                预约面谈
            </button>
        </motion.div>
    );
}
