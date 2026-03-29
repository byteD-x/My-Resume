import { TimelineItem, ProjectItem } from "@/types";

type ExperienceLike = TimelineItem | ProjectItem;

export function isProjectLikeTimelineSubtitle(item: ExperienceLike) {
  if (!("role" in item)) return false;

  const role = item.role ?? "";
  const location = item.location ?? "";

  return /开源项目|独立开发者|项目经理/.test(role) || /开源项目|本地项目/.test(location);
}
