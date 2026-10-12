import { TimelineItem, ProjectItem } from "@/types";
import { getDefaultLocale, type Locale } from "@/lib/locale";
import { getGroupedChildren } from "@/lib/experience-presentation";
import { getPortfolioData } from "@/lib/portfolio-data";

export function getExperience(
  slug: string,
  locale: Locale = getDefaultLocale(),
): TimelineItem | ProjectItem | undefined {
  const data = getPortfolioData(locale);
  const timelineItem = data.timeline.find(
    (item) => item.id === slug,
  );
  if (timelineItem) return timelineItem;

  const projectItem = data.projects.find(
    (item) => item.id === slug,
  );
  return projectItem;
}

export function getProject(
  slug: string,
  locale: Locale = getDefaultLocale(),
): ProjectItem | undefined {
  return getPortfolioData(locale).projects.find((item) => item.id === slug);
}

export function getAllProjectSlugs() {
  return getPortfolioData("zh").projects.map(({ id }) => ({ slug: id }));
}

export function getAllTimelineSlugs() {
  return getPortfolioData("zh").timeline.map(({ id }) => ({ slug: id }));
}

export function getAllExperienceSlugs() {
  const data = getPortfolioData("zh");
  return [
    ...data.timeline.map((item) => ({ slug: item.id })),
    ...data.projects.map((item) => ({ slug: item.id })),
  ];
}

export function getExperienceGroupChildren(
  item: TimelineItem | ProjectItem,
  locale: Locale = getDefaultLocale(),
): (TimelineItem | ProjectItem)[] {
  const data = getPortfolioData(locale);
  if ("role" in item) {
    return getGroupedChildren(item, data.timeline);
  }

  return getGroupedChildren(item, data.projects);
}
