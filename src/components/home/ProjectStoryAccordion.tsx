"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import type { HomepageProjectStorySection } from "@/lib/home-highlights";
import { cn } from "@/lib/utils";

interface ProjectStoryAccordionProps {
  cardId: string;
  sections: HomepageProjectStorySection[];
  compact?: boolean;
}

export function ProjectStoryAccordion({
  cardId,
  sections,
  compact = false,
}: ProjectStoryAccordionProps) {
  const [openSectionIds, setOpenSectionIds] = useState<Record<string, boolean>>({});

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  const toggleSection = (sectionId: string) => {
    if (!sectionIds.includes(sectionId)) return;
    setOpenSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (sections.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", compact && "space-y-2")}>
      {sections.map((section) => {
        const expanded = Boolean(openSectionIds[section.id]);
        const panelId = `${cardId}-${section.id}-panel`;

        return (
          <div
            key={`${cardId}-${section.id}`}
            className={cn(
              "theme-card-muted min-w-0 rounded-[1rem] border border-[rgba(148,163,184,0.14)] bg-[rgba(255,255,255,0.74)]",
              compact ? "px-3 py-2.5" : "px-3 py-3 sm:px-3.5 sm:py-3.5",
            )}
          >
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggleSection(section.id)}
              className="flex w-full min-w-0 items-start justify-between gap-3 text-left"
            >
              <span
                className={cn(
                  "theme-card-kicker min-w-0 break-words [overflow-wrap:anywhere]",
                  compact ? "text-[10px]" : "text-[11px]",
                )}
              >
                {section.title}
              </span>
              <span className="motion-chip mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(148,163,184,0.14)] bg-white/82 text-[color:var(--text-tertiary)]">
                {expanded ? (
                  <ChevronUp size={14} strokeWidth={2.2} />
                ) : (
                  <ChevronDown size={14} strokeWidth={2.2} />
                )}
              </span>
            </button>

            {expanded ? (
              <div
                id={panelId}
                className={cn(
                  "min-w-0 break-words [overflow-wrap:anywhere]",
                  compact ? "pt-2.5" : "pt-3",
                )}
              >
                <MarkdownRenderer
                  className={cn(
                    "min-w-0 break-words [overflow-wrap:anywhere]",
                    compact
                      ? "text-[11px] leading-[1.72] sm:text-[12px]"
                      : "text-[12px] leading-[1.75] sm:text-[13px] sm:leading-[1.82]",
                  )}
                >
                  {section.body}
                </MarkdownRenderer>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
