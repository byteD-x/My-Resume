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

  // 卡片上方已经展示内容定位摘要。保留第一段补充信息，其余内容折叠，
  // 让首屏扫描路径更短，同时把完整证据保留在 DOM 中。
  const visibleSections = sections.filter(
    (section) => section.id !== "positioning",
  );
  const primarySection = visibleSections[0] ?? sections[0];
  const additionalSections = visibleSections.slice(1);

  const renderSection = (section: HomepageProjectStorySection) => {
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
  };

  return (
    <div className={cn("space-y-2.5", compact && "space-y-2")}>
      {renderSection(primarySection)}
      {additionalSections.length > 0 ? (
        <details className="project-story-more group/details">
          <summary className="theme-card-muted flex cursor-pointer list-none items-center justify-between gap-3 rounded-[1rem] border border-[rgba(148,163,184,0.14)] px-3 py-2.5 text-[12px] font-semibold text-[color:var(--text-secondary)] transition-colors hover:border-[rgba(37,99,235,0.22)] hover:text-[color:var(--text-primary)] sm:px-3.5">
            <span className="min-w-0 truncate">
              {additionalSections.map((section) => section.title).join(" · ")}
            </span>
            <span
              className="project-story-more-icon shrink-0 text-[color:var(--brand-gold)]"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div className="mt-2.5 space-y-2.5">
            {additionalSections.map(renderSection)}
          </div>
        </details>
      ) : null}
    </div>
  );
}
