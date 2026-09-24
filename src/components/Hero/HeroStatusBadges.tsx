import { MapPin } from "lucide-react";
import { getUiCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/locale";

interface HeroStatusBadgesProps {
  location?: string;
  locale: Locale;
}

export function HeroStatusBadges({
  location,
  locale,
}: HeroStatusBadgesProps) {
  const copy = getUiCopy(locale);
  const locationParts = location
    ?.split(/[|｜]/)
    .map((part) => part.trim())
    .filter(Boolean)
    ?? [];
  const locationLabel = locationParts[locationParts.length - 1];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-[color:var(--text-tertiary)] sm:text-[13px]">
      <span className="inline-flex items-center gap-2 text-[color:var(--text-primary)]">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        {copy.hero.remote}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin size={14} aria-hidden="true" className="opacity-70" />
        {locationLabel ?? copy.hero.locationFallback}
      </span>
    </div>
  );
}
