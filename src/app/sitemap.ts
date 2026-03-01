import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllExperienceSlugs } from "@/lib/experiences";

// 静态导出需要强制静态配置
export const dynamic = "force-static";

/**
 * 生成站点地图，帮助搜索引擎更好地索引网站
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const experienceUrls = getAllExperienceSlugs().map(({ slug }) => ({
    url: `${baseUrl}/experiences/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...experienceUrls,
  ];
}
