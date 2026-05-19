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
  if (sections.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", compact && "space-y-2")}>
      {sections.map((section) => {
        const panelId = `${cardId}-${section.id}-panel`;

        return (
          <div
            key={`${cardId}-${section.id}`}
            className={cn(
              "theme-card-muted min-w-0 rounded-[1rem] border border-[rgba(148,163,184,0.14)] bg-[rgba(255,255,255,0.74)]",
              compact ? "px-3 py-2.5" : "px-3 py-3 sm:px-3.5 sm:py-3.5",
            )}
          >
            <div className="space-y-3">
              <div
                className={cn(
                  "theme-card-kicker min-w-0 break-words [overflow-wrap:anywhere]",
                  compact ? "text-[10px]" : "text-[11px]",
                )}
              >
                {section.title}
              </div>
              <div
                id={panelId}
                className="min-w-0 break-words [overflow-wrap:anywhere]"
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
