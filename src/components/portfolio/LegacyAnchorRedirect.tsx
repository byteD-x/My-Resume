"use client";

import { useEffect } from "react";
import { resolveLocalePath, type Locale } from "@/lib/locale";

const legacyDestinations: Record<string, string> = {
  projects: "/projects",
  experience: "/experience",
  impact: "/experience",
  skills: "/about#skills",
  services: "/about#services",
  contact: "/about#contact",
};

export function LegacyAnchorRedirect({
  locale,
  explicitLocale = false,
}: {
  locale: Locale;
  explicitLocale?: boolean;
}) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const destination = legacyDestinations[hash];
    if (!destination) return;

    const [pathname, anchor = ""] = destination.split("#");
    const target = explicitLocale
      ? resolveLocalePath(pathname, locale, "", anchor ? `#${anchor}` : "")
      : destination;
    window.location.replace(target);
  }, [explicitLocale, locale]);

  return null;
}
