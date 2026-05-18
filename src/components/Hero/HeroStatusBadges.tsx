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

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="theme-pill px-3 py-1.5 text-[12px] font-medium sm:py-1 sm:text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {copy.hero.remote}
      </span>
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--text-tertiary)] sm:text-xs">
        <MapPin size={14} className="opacity-70" />
        {location ?? copy.hero.locationFallback}
      </span>
    </div>
  );
}
