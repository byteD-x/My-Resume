import { TimelineItem, ProjectItem } from "@/types";

type ExperienceLike = TimelineItem | ProjectItem;

export function isGroupedExperience(item: ExperienceLike) {
  return Array.isArray(item.childIds) && item.childIds.length > 0;
}

export function isHiddenFromSection(item: ExperienceLike) {
  return item.hideFromSection === true;
}

export function getVisibleSectionItems<T extends ExperienceLike>(items: T[]) {
  return items.filter((item) => !isHiddenFromSection(item));
}

export function getGroupedChildren<T extends ExperienceLike>(
  item: ExperienceLike,
  items: T[],
) {
  if (!isGroupedExperience(item)) return [];

  const childIds = item.childIds ?? [];

  return childIds
    .map((childId) => items.find((entry) => entry.id === childId))
    .filter((entry): entry is T => Boolean(entry));
}

export function getExperienceScrollTargetId(item: ExperienceLike) {
  return item.groupParentId ?? item.id;
}

export function isProjectLikeTimelineSubtitle(item: ExperienceLike) {
  if (!("role" in item)) return false;

  const role = item.role ?? "";
  const location = item.location ?? "";

  return /开源项目|独立开发者|项目经理/.test(role) || /开源项目|本地项目/.test(location);
}
