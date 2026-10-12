import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { resolveLocalePath } from "@/lib/locale";
import type { TimelineItem } from "@/types";
import { getGroupedChildren } from "@/lib/experience-presentation";

function getSolutionBullets(solution?: string) {
  if (!solution) return [];

  const bullets = solution
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  return (bullets.length ? bullets : [solution.trim()]).map((point) =>
    point
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/`([^`]+)`/g, "$1"),
  );
}

function ExperienceHighlights({
  item,
  locale,
  compact = false,
}: {
  item: TimelineItem;
  locale: Locale;
  compact?: boolean;
}) {
  const hasProjectDetails = Boolean(
    item.expandedDetails?.problem ||
      item.expandedDetails?.solution ||
      item.expandedDetails?.techStack?.length,
  );
  const techStack = (hasProjectDetails
    ? item.expandedDetails?.techStack?.length
      ? item.expandedDetails.techStack
      : item.techTags
    : []
  ).slice(0, 4);
  const solutionBullets = getSolutionBullets(item.expandedDetails?.solution).slice(
    0,
    4,
  );
  const problem = item.expandedDetails?.problem;

  if (!techStack.length && !problem && !solutionBullets.length) return null;

  return (
    <div className={`dark-timeline-highlights${compact ? " is-compact" : ""}`}>
      {techStack.length ? (
        <div className="dark-timeline-highlight-block">
          <p className="dark-eyebrow">
            {locale === "zh" ? "核心技术" : "Core technologies"}
          </p>
          <div
            className="dark-tags"
            aria-label={locale === "zh" ? "核心技术" : "Core technologies"}
          >
            {techStack.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ) : null}

      {problem || solutionBullets.length ? (
        <div className="dark-timeline-highlight-block">
          <p className="dark-eyebrow">
            {problem
              ? locale === "zh"
                ? "难题与解决"
                : "Challenge & solution"
              : locale === "zh"
                ? "解决摘要"
                : "Solution summary"}
          </p>
          {problem ? (
            <p className="dark-timeline-challenge">
              <strong>{locale === "zh" ? "难题" : "Challenge"}</strong>
              {problem}
            </p>
          ) : null}
          {solutionBullets.length ? (
            <ul className="dark-timeline-highlight-list">
              {solutionBullets.map((point, index) => (
                <li key={`${index}-${point}`}>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ExperienceOutcomeList({
  item,
  locale,
  compact = false,
}: {
  item: TimelineItem;
  locale: Locale;
  compact?: boolean;
}) {
  const outcomes = item.keyOutcomes?.filter(Boolean).slice(0, 3) ?? [];
  if (!outcomes.length) return null;

  return (
    <div className={`dark-timeline-outcomes${compact ? " is-compact" : ""}`}>
      <p className="dark-eyebrow">
        {locale === "zh" ? "项目要点" : "Project outcomes"}
      </p>
      <ul>
        {outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
    </div>
  );
}

export function DarkExperienceIndex({ items, locale, explicitLocale = false }: { items: TimelineItem[]; locale: Locale; explicitLocale?: boolean }) {
  const hrefFor = (id: string) => explicitLocale ? resolveLocalePath(`/experiences/${id}`, locale) : `/experiences/${id}`;
  const groupedChildIds = new Set(items.flatMap((item) => item.childIds ?? []));
  // Keep grouped children inside their parent, but show hidden standalone records in the timeline.
  const visibleItems = items.filter((item) => !item.hideFromSection || !groupedChildIds.has(item.id));
  return (
    <div className="dark-timeline">
      {visibleItems.map((item) => {
        const children = getGroupedChildren(item, items);
        const evidence = item.verification?.[0];
        const heading = item.hideFromSection ? item.company : item.role;
        const eyebrow = item.hideFromSection ? item.role : item.company;

        return (
          <article
            key={item.id}
            className={`dark-timeline-row ${children.length ? "is-grouped" : ""}`}
          >
            <div className="dark-timeline-date">{item.year}</div>
            <div className="dark-timeline-marker" aria-hidden="true" />
            <div className="dark-timeline-copy">
              <p className="dark-eyebrow">{eyebrow}</p>
              <h2>{heading}</h2>
              <p>{item.summary}</p>
              <ExperienceOutcomeList item={item} locale={locale} />
              {evidence ? (
                <p className="dark-timeline-proof">
                  <strong>{locale === "zh" ? "证据" : "Evidence"}</strong>
                  {evidence.sourceLabel ?? evidence.sourceType}
                </p>
              ) : null}
              <ExperienceHighlights item={item} locale={locale} />
              <Link href={hrefFor(item.id)} className="dark-arrow-link">
                {locale === "zh" ? "查看经历" : "View record"}
                <ArrowUpRight size={15} />
              </Link>
              {children.length ? (
                <div className="dark-timeline-children">
                  <p className="dark-eyebrow">
                    {locale === "zh" ? "子项目" : "Child projects"}
                  </p>
                  <div className="dark-timeline-child-grid">
                    {children.map((child) => (
                      <article key={child.id} className="dark-timeline-child">
                        <div className="dark-timeline-child-head">
                          <span className="dark-timeline-child-year">
                            {child.year}
                          </span>
                          <Link href={hrefFor(child.id)}>
                            <strong>
                              {"name" in child ? child.name : child.company}
                              {"role" in child && child.role
                                ? ` · ${child.role}`
                                : null}
                            </strong>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </Link>
                        </div>
                        <p className="dark-timeline-child-summary">
                          {child.summary}
                        </p>
                        <ExperienceOutcomeList
                          item={child}
                          locale={locale}
                          compact
                        />
                        <ExperienceHighlights
                          item={child}
                          locale={locale}
                          compact
                        />
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
