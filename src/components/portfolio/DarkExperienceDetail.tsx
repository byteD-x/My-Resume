import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Github, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/locale";
import { resolveLocalePath } from "@/lib/locale";
import type { ProjectItem, TimelineItem } from "@/types";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { DarkSiteNav } from "./DarkSiteNav";
import { DarkProjectVisual } from "./DarkProjectVisual";
import { DarkFooter } from "./DarkFooter";

function getSolutionBullets(solution?: string) {
  if (!solution) return [];

  const bullets = solution
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  return bullets.length ? bullets : [solution.trim()];
}

export function DarkExperienceDetail({
  item,
  locale,
  explicitLocale = false,
}: {
  item: ProjectItem | TimelineItem;
  locale: Locale;
  explicitLocale?: boolean;
}) {
  const zh = locale === "zh";
  const details = item.expandedDetails;
  const isProject = "name" in item;
  const title = isProject
    ? item.name
    : item.groupParentId || item.hideFromSection
      ? item.company
      : item.role;
  const displayTitle = title ?? item.id;
  const subtitle = isProject
    ? ""
    : item.groupParentId || item.hideFromSection
      ? item.role
      : item.company;
  const prefix = (path: string) =>
    explicitLocale ? resolveLocalePath(path, locale) : path;
  const relatedLinks = Array.from(
    new Map(
      [...(item.links ?? []), ...(details?.links ?? [])].map((link) => [
        link.url,
        link,
      ]),
    ).values(),
  );
  const githubLink =
    item.link ??
    relatedLinks.find(
      (link) => /github/i.test(link.label) || /github\.com/i.test(link.url),
    )?.url ??
    item.verification?.find((entry) => /github\.com/i.test(entry.sourceUrl ?? ""))
      ?.sourceUrl;
  const outcome =
    ("impact" in item ? item.impact : undefined) ??
    details?.result ??
    item.summary;
  const visualKind =
    "name" in item
      ? item.id.includes("rag")
        ? "retrieval"
        : item.id.includes("wechat")
          ? "memory"
          : item.id.includes("cloudpan")
            ? "storage"
            : "runtime"
      : "runtime";
  const coreTechnologies = details?.techStack?.length
    ? details.techStack.slice(0, 4)
    : [];
  const solutionBullets = getSolutionBullets(details?.solution).slice(0, 4);

  return (
    <div className="dark-portfolio reboot-page reboot-inner-page">
      <DarkSiteNav
        name={zh ? "杜旭嘉" : "Xujia Du"}
        title={zh ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"}
      />
      <main className="dark-detail-main">
        <div className="dark-detail-breadcrumb">
          <Link href={prefix("/projects")}>
            <ArrowLeft size={15} />
            {zh ? "作品" : "Work"}
          </Link>
          <span>/</span>
          <Link href={prefix("/experience")}>
            {zh ? "经历" : "Experience"}
          </Link>
          <span>/</span>
          <span>{displayTitle}</span>
        </div>

        <section className="dark-detail-hero">
          <div>
            <p className="dark-eyebrow">
              {subtitle || (zh ? "工程项目" : "Engineering project")}
            </p>
            <h1>{displayTitle}</h1>
            <p className="dark-detail-summary">{item.summary}</p>
            <div className="dark-detail-meta">
              <span>
                <Calendar size={15} />
                {item.year}
              </span>
              {item.location ? (
                <span>
                  <MapPin size={15} />
                  {item.location}
                </span>
              ) : null}
              {githubLink ? (
                <a href={githubLink} target="_blank" rel="noopener noreferrer">
                  <Github size={15} />
                  GitHub <ArrowUpRight size={13} />
                </a>
              ) : null}
            </div>
          </div>
          <DarkProjectVisual kind={visualKind} label={displayTitle} locale={locale} priority />
        </section>

        <div className="dark-detail-body">
          <section>
            <p className="dark-eyebrow">{zh ? "结果" : "Outcome"}</p>
            <h2>{outcome}</h2>
            {item.keyOutcomes?.length ? (
              <ul className="dark-outcome-list">
                {item.keyOutcomes.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            ) : null}
          </section>

          {item.businessValue ? (
            <section>
              <p className="dark-eyebrow">
                {zh ? "业务价值" : "Business value"}
              </p>
              <MarkdownRenderer>
                {item.businessValue[locale] ?? item.businessValue.zh}
              </MarkdownRenderer>
            </section>
          ) : null}

          {item.engineeringDepth ? (
            <section>
              <p className="dark-eyebrow">
                {zh ? "工程深度" : "Engineering depth"}
              </p>
              <MarkdownRenderer>
                {item.engineeringDepth[locale] ?? item.engineeringDepth.zh}
              </MarkdownRenderer>
            </section>
          ) : null}

          {details?.role || details?.techStack?.length ? (
            <section className="dark-detail-columns">
              {details.role ? (
                <div>
                  <p className="dark-eyebrow">{zh ? "我的角色" : "Role"}</p>
                  <MarkdownRenderer>{details.role}</MarkdownRenderer>
                </div>
              ) : null}
              {details.techStack?.length ? (
                <div>
                  <p className="dark-eyebrow">
                    {zh ? "完整技术栈" : "Full stack"}
                  </p>
                  <div className="dark-tags" aria-label={zh ? "项目技术栈" : "Project tech stack"}>
                    {details.techStack.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {coreTechnologies.length || details?.problem || solutionBullets.length ? (
            <section className="dark-detail-columns dark-detail-highlights">
              {coreTechnologies.length ? (
                <div>
                  <p className="dark-eyebrow">
                    {zh ? "核心技术" : "Core technologies"}
                  </p>
                  <ol className="dark-detail-tech-list">
                    {coreTechnologies.map((technology, index) => (
                      <li key={technology}>
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong>{technology}</strong>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              {details?.problem || solutionBullets.length ? (
                <div>
                  <p className="dark-eyebrow">
                    {zh ? "难题与解决" : "Challenge & solution"}
                  </p>
                  {details?.problem ? (
                    <p className="dark-detail-challenge">
                      <strong>{zh ? "难题" : "Challenge"}</strong>
                      {details.problem}
                    </p>
                  ) : null}
                  {solutionBullets.length ? (
                    <ul className="dark-detail-solution-list">
                      {solutionBullets.map((point, index) => (
                        <li key={`${index}-${point}`}>
                          <MarkdownRenderer inline>{point}</MarkdownRenderer>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          {details?.background || details?.result ? (
            <section className="dark-detail-columns">
              {details.background ? (
                <div>
                  <p className="dark-eyebrow">{zh ? "背景" : "Context"}</p>
                  <MarkdownRenderer>{details.background}</MarkdownRenderer>
                </div>
              ) : null}
              {details.result ? (
                <div>
                  <p className="dark-eyebrow">
                    {zh ? "交付结果" : "Delivery result"}
                  </p>
                  <MarkdownRenderer>{details.result}</MarkdownRenderer>
                </div>
              ) : null}
            </section>
          ) : null}

          {item.verification?.length ? (
            <section>
              <p className="dark-eyebrow">{zh ? "证据" : "Evidence"}</p>
              <div className="dark-evidence-list">
                {item.verification.map((entry) => (
                  <div key={`${entry.sourceType}-${entry.verifiedAt}`}>
                    <strong>{entry.sourceLabel ?? entry.sourceType}</strong>
                    <span>
                      {entry.verifiedAt} · {entry.confidence}
                    </span>
                    {entry.sourceUrl ? (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {zh ? "查看来源" : "View source"}
                        <ArrowUpRight size={13} />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {relatedLinks.length ? (
            <section>
              <p className="dark-eyebrow">{zh ? "相关链接" : "Related links"}</p>
              <div className="dark-evidence-list">
                {relatedLinks.map((link) => (
                  <div key={link.url}>
                    <strong>{link.label}</strong>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {zh ? "打开链接" : "Open link"}
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <DarkFooter
        locale={locale}
        email={siteConfig.email}
        github="https://github.com/byteD-x"
        explicitLocale={explicitLocale}
      />
    </div>
  );
}
