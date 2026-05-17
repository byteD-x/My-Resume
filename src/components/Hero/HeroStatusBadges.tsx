import { MapPin } from "lucide-react";

interface HeroStatusBadgesProps {
  location?: string;
}

export function HeroStatusBadges({ location }: HeroStatusBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <span className="theme-pill px-3 py-1.5 text-[12px] font-medium sm:py-1 sm:text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        远程优先
      </span>
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--text-tertiary)] sm:text-xs">
        <MapPin size={14} className="opacity-70" />
        {location ?? "深圳 / 南京 / 杭州 / 成都"}
      </span>
    </div>
  );
}
