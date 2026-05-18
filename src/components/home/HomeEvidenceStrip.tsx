"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/lib/LocaleProvider";
import {
  getPreferredScrollBehavior,
  scrollToSection,
} from "@/lib/section-scroll";

export interface HomeEvidenceStripItem {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  href: string;
  actionLabel: string;
  meta?: string;
}

interface HomeEvidenceStripProps {
  items: HomeEvidenceStripItem[];
}

function isHashLink(href: string) {
  return href.startsWith("#");
}

export function HomeEvidenceStrip({ items }: HomeEvidenceStripProps) {
  const { locale } = useLocale();
  const handleHashLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    scrollToSection(href.slice(1), {
      behavior: getPreferredScrollBehavior(),
    });
  };

  return (
    <section className="theme-grid-section relative z-10 border-b section-divider !py-5 sm:!py-6 lg:!py-7">
      <Container>
        <div className="grid gap-3 lg:grid-cols-3">
          {items.map((item) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="theme-card-kicker">{item.kicker}</p>
                    <h2 className="theme-card-title mt-2 text-[1rem] sm:text-[1.08rem]">
                      {item.title}
                    </h2>
                  </div>
                  <span className="motion-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,99,235,0.14)] bg-white/84 text-[color:var(--text-tertiary)] transition-colors duration-200 group-hover:border-[rgba(37,99,235,0.24)] group-hover:text-[color:var(--brand-gold)]">
                    <ArrowRight size={14} className="motion-arrow-shift" />
                  </span>
                </div>
                <p className="theme-copy mt-2.5 text-[13px] leading-[1.76] sm:text-[14px]">
                  {item.summary}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[color:var(--border-default)] pt-3">
                  <span className="theme-copy-subtle text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {item.meta ??
                      (locale === "en"
                        ? "Recruiter-first path"
                        : "招聘方优先浏览路径")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--text-primary)]">
                    {item.actionLabel}
                    <ArrowRight size={13} className="motion-arrow-shift" />
                  </span>
                </div>
              </>
            );

            const className =
              "theme-card-muted theme-card-interactive group flex min-h-[11rem] flex-col rounded-[1.15rem] border-[rgba(148,163,184,0.14)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.045)] sm:min-h-[11.5rem] sm:p-[1.125rem]";
            const ariaLabel = `${item.kicker} · ${item.actionLabel}`;

            if (isHashLink(item.href)) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(event) => handleHashLinkClick(event, item.href)}
                  className={className}
                  aria-label={ariaLabel}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={className}
                aria-label={ariaLabel}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
