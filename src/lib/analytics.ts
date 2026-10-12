/**
 * Google Analytics 4 integration utilities
 *
 * Environment variable required:
 * NEXT_PUBLIC_GA_MEASUREMENT_ID - Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 */

let analyticsEnabled = false;
let reactGAInstance: typeof import("react-ga4").default | null = null;
let reactGALoader: Promise<typeof import("react-ga4").default> | null = null;

const getReactGA = async () => {
  if (reactGAInstance) return reactGAInstance;
  if (!reactGALoader) {
    reactGALoader = import("react-ga4").then((mod) => {
      reactGAInstance = mod.default;
      return reactGAInstance;
    });
  }

  return reactGALoader;
};

// Initialize GA4 - call this once in your app
export const initGA = async (): Promise<void> => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn(
      "GA4: NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics disabled.",
    );
    analyticsEnabled = false;
    return;
  }

  try {
    const ReactGA = await getReactGA();
    ReactGA.initialize(measurementId, {
      // Enable debug mode in development
      gaOptions: {
        debug_mode: process.env.NODE_ENV === "development",
      },
    });
    analyticsEnabled = true;
  } catch (error) {
    analyticsEnabled = false;
    console.warn("GA4: initialization failed. Analytics disabled.", error);
  }
};

// Track page views
export const trackPageView = (path: string, title?: string): void => {
  if (!analyticsEnabled || !reactGAInstance) return;
  try {
    reactGAInstance.send({
      hitType: "pageview",
      page: path,
      title: title,
    });
  } catch {
    // Never block user interactions due to analytics errors.
  }
};

// Track scroll depth milestones
export const trackScrollDepth = (percentage: number): void => {
  if (!analyticsEnabled || !reactGAInstance) return;
  try {
    reactGAInstance.event({
      category: "Engagement",
      action: "scroll",
      label: `${percentage}%`,
      value: percentage,
      nonInteraction: true,
    });
  } catch {
    // Never block user interactions due to analytics errors.
  }
};

// Track section views
export const trackSectionView = (sectionId: string): void => {
  if (!analyticsEnabled || !reactGAInstance) return;
  try {
    reactGAInstance.event({
      category: "Engagement",
      action: "section_view",
      label: sectionId,
      nonInteraction: true,
    });
  } catch {
    // Never block user interactions due to analytics errors.
  }
};
