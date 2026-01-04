'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingResumeButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 300px (past Hero)
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4"
                >
                    <a
                        href="/resume.pdf"
                        download
                        className="group flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.7)]"
                    >
                        <Download className="w-5 h-5 animate-bounce-short" />
                        <span className="font-medium whitespace-nowrap">Download Resume</span>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
