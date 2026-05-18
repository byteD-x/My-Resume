"use client";

import {
  ArrowRight,
  Gauge,
  Layers3,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { IntentLink } from "@/components/ui/IntentLink";
import { getUiCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/locale";
import { saveScrollRestore } from "@/lib/scroll-restore";
import { scrollToSection } from "@/lib/section-scroll";
import { HomepageFeaturedCard } from "@/lib/home-highlights";
import { ProjectStoryAccordion } from "./ProjectStoryAccordion";

interface FeaturedProjectsProps {
  items: HomepageFeaturedCard[];
  locale: Locale;
}

const iconByIndex = [Layers3, Gauge, ShieldCheck, MessageSquareMore];

export function FeaturedProjects({
  items,
  locale,
}: FeaturedProjectsProps) {
  const copy = getUiCopy(locale);

  const handleOpen = () => {
    if (typeof window === "undefined") return;
    const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    saveScrollRestore({
      path,
      y: window.scrollY,
      section: "projects",
      ts: Date.now(),
    });
  };

  const handleJumpToProjects = () => {
    scrollToSection("projects");
  };

  return (
    <Section className="theme-grid-section theme-section-dense relative scroll-mt-24 border-y section-divider !py-8 sm:!py-10 lg:!py-12">
      <Container>
        <div className="theme-section-header !mb-5 grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-5 sm:!mb-6 lg:!mb-7">
          <div>
            <p className="theme-kicker mb-2">{copy.sections.featuredKicker}</p>
            <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
              {copy.sections.featuredTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleJumpToProjects}
            className="theme-card-muted theme-card-interactive group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-[color:var(--text-primary)] sm:w-auto"
          >
            {copy.sections.featuredMore}
            <ArrowRight
              size={16}
              className="motion-arrow-shift"
            />
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-2 xl:[grid-auto-rows:1fr]">
          {items.map((item, index) => {
            const Icon = iconByIndex[index] ?? Layers3;
            return (
              <article
                key={item.id}
                className="theme-card theme-card-interactive group flex h-full min-w-0 flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)] sm:p-4 md:rounded-[1.6rem] md:p-5 md:shadow-[0_18px_38px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-4 flex items-start justify-between gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-4 sm:gap-3.5 sm:pb-4">
                  <div className="theme-icon-box theme-icon-box-sm motion-chip">
                    <Icon size={18} strokeWidth={2} className="motion-icon-float" />
                  </div>
                  <div className="theme-chip-strong max-w-[12rem] px-2.5 py-1 text-left text-[10px] font-bold leading-[1.45] tracking-[0.06em] [text-wrap:balance] sm:max-w-[12.5rem] sm:text-right md:text-[10px] md:tracking-[0.14em]">
                    {item.focus}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-3.5 sm:space-y-4">
                  <div className="min-w-0 space-y-3">
                    <h3 className="theme-card-title max-w-[19rem] break-words text-[1.22rem] [overflow-wrap:anywhere] sm:text-[1.34rem]">
                      {item.name}
                    </h3>
                    <p className="theme-readable-block break-words text-[13px] text-[color:var(--text-primary)] [overflow-wrap:anywhere] sm:text-[14px]">
                      {item.contentSummary}
                    </p>
                  </div>

                  <ProjectStoryAccordion
                    cardId={item.id}
                    sections={item.storySections}
                  />
                </div>

                <div className="theme-card-footer mt-4 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 flex-wrap gap-1.5 sm:gap-2">
                    {item.techTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="theme-chip theme-chip-readable max-w-full break-words px-2.5 py-1 font-semibold uppercase [overflow-wrap:anywhere] md:text-[10px] md:tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <IntentLink
                    href={item.href}
                    scroll={false}
                    onClick={handleOpen}
                    className="inline-flex self-start text-[13px] font-semibold leading-6 text-[color:var(--text-primary)] hover:text-[color:var(--brand-gold)] sm:self-auto"
                  >
                    {copy.featured.detail}
                    <ArrowRight
                      size={14}
                      className="motion-arrow-shift"
                    />
                  </IntentLink>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
