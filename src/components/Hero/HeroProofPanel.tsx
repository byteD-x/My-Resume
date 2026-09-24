import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { HeroSpotlightItem } from "@/lib/home-highlights";
import { getUiCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/locale";

interface HeroProofPanelProps {
  items: HeroSpotlightItem[];
  locale: Locale;
}

export function HeroProofPanel({ items, locale }: HeroProofPanelProps) {
  const copy = getUiCopy(locale);

  return (
    <aside className="relative">
      <div className="mb-2 flex items-end justify-between gap-4 border-b border-[color:var(--border-default)] pb-4 sm:mb-3 sm:pb-5">
        <div>
          <p className="theme-card-kicker">{copy.runtime.proofEntry}</p>
          <h2
            id="hero-projects-heading"
            className="theme-title mt-1.5 text-[1.25rem] font-bold sm:text-[1.45rem]"
          >
            {copy.featured.fallbackRecent}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[color:var(--text-tertiary)] sm:text-xs">
          <Check size={14} className="text-emerald-600" aria-hidden="true" />
          {copy.metric.verified}
        </span>
      </div>

      <ol
        className="divide-y divide-[color:var(--border-muted)]"
        aria-labelledby="hero-projects-heading"
      >
        {items.map((item, index) => {
          const content = (
            <>
              <span
                className="pt-0.5 text-[11px] font-semibold tabular-nums text-[color:var(--text-tertiary)]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="theme-card-kicker">{item.focus}</span>
                <span className="mt-1 flex items-center justify-between gap-3">
                  <span className="theme-card-title text-[0.98rem] sm:text-[1.03rem]">
                    {item.name}
                  </span>
                  {item.href ? (
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-[color:var(--text-tertiary)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-gold)]"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="theme-copy mt-1.5 block line-clamp-2 text-[12px] leading-[1.7] sm:text-[13px]">
                  {item.summary}
                </span>
              </span>
            </>
          );
          const rowClassName =
            "grid grid-cols-[1.6rem_minmax(0,1fr)] gap-3 py-4 sm:gap-4 sm:py-[1.125rem]";

          return (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`${rowClassName} group rounded-sm focus-visible:outline-offset-4`}
                >
                  {content}
                </Link>
              ) : (
                <article className={rowClassName}>{content}</article>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
