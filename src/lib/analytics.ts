/**
 * Google Analytics 4 integration utilities
 * 
 * Environment variable required:
 * NEXT_PUBLIC_GA_MEASUREMENT_ID - Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 */

import ReactGA from 'react-ga4';

// Initialize GA4 - call this once in your app
export const initGA = (): void => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!measurementId) {
        console.warn('GA4: NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics disabled.');
        return;
    }

    ReactGA.initialize(measurementId, {
        // Enable debug mode in development
        gaOptions: {
            debug_mode: process.env.NODE_ENV === 'development',
        },
    });
};

// Track page views
export const trackPageView = (path: string, title?: string): void => {
    ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: title,
    });
};

// Track CTA clicks
export const trackCTAClick = (ctaName: string, ctaLocation: string): void => {
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
};

// Track scroll depth milestones
export const trackScrollDepth = (percentage: number): void => {
    ReactGA.event({
        category: 'Engagement',
        action: 'scroll',
        label: `${percentage}%`,
        value: percentage,
        nonInteraction: true,
    });
};

// Track resume download
export const trackResumeDownload = (): void => {
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
};

// Track appointment modal open
export const trackAppointmentModalOpen = (): void => {
    ReactGA.event({
        category: 'Engagement',
        action: 'modal_open',
        label: 'Appointment Modal',
    });

    ReactGA.event('generate_lead', {
        lead_source: 'appointment_cta',
    });
};

// Track appointment form submission
export const trackAppointmentSubmit = (success: boolean): void => {
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
};

// Track section views
export const trackSectionView = (sectionId: string): void => {
    ReactGA.event({
        category: 'Engagement',
        action: 'section_view',
        label: sectionId,
        nonInteraction: true,
    });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText: string): void => {
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
};
