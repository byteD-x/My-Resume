import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getDeploymentDefaultLocale,
  getRootLocaleEntryPath,
  shouldUseExplicitRootLocale,
} from "@/lib/deployment-locale";
import {
  getAllProjectSlugs,
  getAllTimelineSlugs,
} from "@/lib/experiences";
import { locales, type Locale } from "@/lib/locale";

// 静态导出需要强制静态配置
export const dynamic = "force-static";

const defaultLocale = getDeploymentDefaultLocale();

function buildLocalizedPath(locale: Locale, pathname = "/") {
  if (locale === defaultLocale) {
    if (pathname === "/" && shouldUseExplicitRootLocale(defaultLocale)) {
      return getRootLocaleEntryPath(defaultLocale);
    }
    return pathname;
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

function buildAlternateLanguages(pathname: string) {
  return Object.fromEntries(
    locales.map((locale) => [
      locale === "zh" ? "zh-CN" : "en-US",
      `${siteConfig.siteUrl}${buildLocalizedPath(locale, pathname)}`,
    ]),
  );
}

/**
 * 生成站点地图，帮助搜索引擎更好地索引网站
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const homeEntries = locales.map((locale) => ({
    url: `${baseUrl}${buildLocalizedPath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: {
      languages: buildAlternateLanguages("/"),
    },
  }));

  const experienceEntries = locales.flatMap((locale) =>
    getAllTimelineSlugs().map(({ slug }) => ({
      url: `${baseUrl}${buildLocalizedPath(locale, `/experiences/${slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? 0.8 : 0.7,
      alternates: {
        languages: buildAlternateLanguages(`/experiences/${slug}`),
      },
    })),
  );

  const projectEntries = locales.flatMap((locale) =>
    getAllProjectSlugs().map(({ slug }) => ({
      url: `${baseUrl}${buildLocalizedPath(locale, `/projects/${slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? 0.85 : 0.75,
      alternates: {
        languages: buildAlternateLanguages(`/projects/${slug}`),
      },
    })),
  );

  const sectionEntries = ["/projects", "/experience", "/about"].flatMap(
    (pathname) =>
      locales.map((locale) => ({
        url: `${baseUrl}${buildLocalizedPath(locale, pathname)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: locale === defaultLocale ? 0.85 : 0.75,
        alternates: {
          languages: buildAlternateLanguages(pathname),
        },
      })),
  );

  return [
    ...homeEntries,
    ...sectionEntries,
    ...experienceEntries,
    ...projectEntries,
  ];
}
