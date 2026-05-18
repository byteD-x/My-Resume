import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllExperienceSlugs } from "@/lib/experiences";
import { getDefaultLocale, locales, type Locale } from "@/lib/locale";

// 静态导出需要强制静态配置
export const dynamic = "force-static";

const defaultLocale = getDefaultLocale();

function buildLocalizedPath(locale: Locale, pathname = "/") {
  if (locale === defaultLocale) {
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
    getAllExperienceSlugs().map(({ slug }) => ({
      url: `${baseUrl}${buildLocalizedPath(locale, `/experiences/${slug}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === defaultLocale ? 0.8 : 0.7,
      alternates: {
        languages: buildAlternateLanguages(`/experiences/${slug}`),
      },
    })),
  );

  return [
    ...homeEntries,
    ...experienceEntries,
  ];
}
