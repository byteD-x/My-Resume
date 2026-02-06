'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
    initGA,
    trackPageView,
    trackScrollDepth,
    trackSectionView,
} from './analytics';

interface AnalyticsProviderProps {
    children: React.ReactNode;
}

/**
 * Analytics Provider Component
 * Initializes GA4 and tracks page views and scroll depth automatically
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
    const pathname = usePathname();
    const initializedRef = useRef(false);
    const scrollMilestonesRef = useRef<Set<number>>(new Set());
    const sectionSeenRef = useRef<Set<string>>(new Set());

    // Initialize GA4 once
    useEffect(() => {
        if (!initializedRef.current) {
            initGA();
            initializedRef.current = true;
        }
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (initializedRef.current) {
            trackPageView(pathname);
        }
    }, [pathname]);

    // Track scroll depth
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        // Track milestones: 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];

        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !scrollMilestonesRef.current.has(milestone)) {
                scrollMilestonesRef.current.add(milestone);
                trackScrollDepth(milestone);
            }
        });
    }, []);

    useEffect(() => {
        // Reset milestones on page change
        scrollMilestonesRef.current.clear();

        // Debounced scroll handler
        let timeoutId: NodeJS.Timeout;
        const debouncedScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 100);
        };

        window.addEventListener('scroll', debouncedScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', debouncedScroll);
            clearTimeout(timeoutId);
        };
    }, [pathname, handleScroll]);

    useEffect(() => {
        sectionSeenRef.current.clear();
        const sectionIds = ['impact', 'experience', 'projects', 'skills', 'contact'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const sectionId = entry.target.id;
                if (!sectionId || sectionSeenRef.current.has(sectionId)) return;

                sectionSeenRef.current.add(sectionId);
                trackSectionView(sectionId);
            });
        }, { threshold: 0.4 });

        sectionIds.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [pathname]);

    return <>{children}</>;
}
