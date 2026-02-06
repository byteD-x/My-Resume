/**
 * Google Analytics 4 integration utilities
 * 
 * Environment variable required:
 * NEXT_PUBLIC_GA_MEASUREMENT_ID - Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 */

import ReactGA from 'react-ga4';

let analyticsEnabled = false;

// Initialize GA4 - call this once in your app
export const initGA = (): void => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!measurementId) {
        console.warn('GA4: NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics disabled.');
        analyticsEnabled = false;
        return;
    }

    try {
        ReactGA.initialize(measurementId, {
            // Enable debug mode in development
            gaOptions: {
                debug_mode: process.env.NODE_ENV === 'development',
            },
        });
        analyticsEnabled = true;
    } catch (error) {
        analyticsEnabled = false;
        console.warn('GA4: initialization failed. Analytics disabled.', error);
    }
};

// Track page views
export const trackPageView = (path: string, title?: string): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.send({
            hitType: 'pageview',
            page: path,
            title: title,
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, ctaLocation: string): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'CTA',
            action: 'click',
            label: ctaName,
            value: undefined,
            nonInteraction: false,
            transport: 'beacon',
        });

        // Also send as GA4 recommended event
        ReactGA.event('select_content', {
            content_type: 'cta_button',
            item_id: ctaName,
            content_id: ctaLocation,
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track scroll depth milestones
export const trackScrollDepth = (percentage: number): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Engagement',
            action: 'scroll',
            label: `${percentage}%`,
            value: percentage,
            nonInteraction: true,
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track resume download
export const trackResumeDownload = (): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Resume',
            action: 'download',
            label: 'PDF Resume',
        });

        // GA4 recommended event for file download
        ReactGA.event('file_download', {
            file_name: 'resume.pdf',
            file_extension: 'pdf',
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track appointment modal open
export const trackAppointmentModalOpen = (): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Engagement',
            action: 'modal_open',
            label: 'Appointment Modal',
        });

        ReactGA.event('generate_lead', {
            lead_source: 'appointment_cta',
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track appointment form submission
export const trackAppointmentSubmit = (success: boolean): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Conversion',
            action: success ? 'appointment_success' : 'appointment_fail',
            label: 'Appointment Form',
        });

        if (success) {
            ReactGA.event('sign_up', {
                method: 'appointment_form',
            });
        }
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track section views
export const trackSectionView = (sectionId: string): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Engagement',
            action: 'section_view',
            label: sectionId,
            nonInteraction: true,
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText: string): void => {
    if (!analyticsEnabled) return;
    try {
        ReactGA.event({
            category: 'Outbound',
            action: 'click',
            label: url,
            transport: 'beacon',
        });

        ReactGA.event('click', {
            link_url: url,
            link_text: linkText,
            outbound: true,
        });
    } catch {
        // Never block user interactions due to analytics errors.
    }
};
