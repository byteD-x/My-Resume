import type { Metadata } from "next";
import { localizedSiteConfig, siteConfig } from "@/config/site";
import { getExperience } from "@/lib/experiences";
import {
  addLocalePrefix,
  getOpenGraphLocale,
  stripLocalePrefix,
  type Locale,
} from "@/lib/locale";
import {
  getDeploymentDefaultLocale,
  shouldUseExplicitRootLocale,
} from "@/lib/deployment-locale";
import { getPortfolioData } from "@/lib/portfolio-data";

function normalizePagePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function buildRoutePath(
  locale: Locale,
  pathname: string,
  explicitLocale = false,
): string {
  const normalizedPath = stripLocalePrefix(normalizePagePath(pathname));
  if (explicitLocale) {
    return addLocalePrefix(normalizedPath, locale);
  }

  const defaultLocale = getDeploymentDefaultLocale();
  if (
    locale === defaultLocale &&
    !(normalizedPath === "/" && shouldUseExplicitRootLocale(defaultLocale))
  ) {
    return normalizedPath;
  }

  return addLocalePrefix(normalizedPath, locale);
}

function buildAbsoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

function buildAlternates(pathname: string): NonNullable<Metadata["alternates"]> {
  const normalizedPath = normalizePagePath(pathname);
  const basePath = stripLocalePrefix(normalizedPath);
  const defaultLocale = getDeploymentDefaultLocale();
  const languages = {
    "zh-CN": buildAbsoluteUrl(buildRoutePath("zh", basePath, true)),
    "en-US": buildAbsoluteUrl(buildRoutePath("en", basePath, true)),
    "x-default": buildAbsoluteUrl(
      buildRoutePath(defaultLocale, basePath),
    ),
  } as const;

  return {
    canonical: buildAbsoluteUrl(normalizedPath),
    languages,
  };
}

function buildBaseMetadata(
  locale: Locale,
  pathname: string,
  options?: {
    title?: string;
    description?: string;
    keywords?: string[];
  },
): Metadata {
  const localeConfig = localizedSiteConfig[locale];
  const description = options?.description ?? localeConfig.description;
  const displayTitle = options?.title ?? localeConfig.title;
  const title = options?.title ?? { absolute: displayTitle };
  const absoluteUrl = buildAbsoluteUrl(pathname);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    keywords: [...(options?.keywords ?? localeConfig.keywords)],
    authors: [{ name: localeConfig.name }],
    creator: localeConfig.name,
    publisher: localeConfig.name,
    applicationName: siteConfig.shortName,
    category: "technology",
    formatDetection: {
      telephone: false,
    },
    alternates: buildAlternates(pathname),
    openGraph: {
      title: displayTitle,
      description,
      url: absoluteUrl,
      siteName: localeConfig.title,
      type: "website",
      locale: getOpenGraphLocale(locale),
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [siteConfig.ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getHomePageMetadata(
  locale: Locale,
  explicitLocale = false,
): Metadata {
  const pathname = buildRoutePath(locale, "/", explicitLocale);
  return buildBaseMetadata(locale, pathname);
}

export function getSectionPageMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description: string,
  explicitLocale = false,
): Metadata {
  return buildBaseMetadata(
    locale,
    buildRoutePath(locale, pathname, explicitLocale),
    { title, description },
  );
}

export function getExperiencePageMetadata(
  slug: string,
  locale: Locale,
  explicitLocale = false,
  routeBase: "experiences" | "projects" = "experiences",
): Metadata | null {
  const item = getExperience(slug, locale);
  if (!item) return null;

  const localeConfig = localizedSiteConfig[locale];
  const title = "role" in item ? `${item.role} | ${item.company}` : item.name;
  const description = item.summary;
  const keywords = Array.from(
    new Set([...localeConfig.keywords, ...item.techTags]),
  );
  const pathname = buildRoutePath(
    locale,
    `/${routeBase}/${item.id}`,
    explicitLocale,
  );

  return buildBaseMetadata(locale, pathname, {
    title: `${title} | ${localeConfig.name}`,
    description,
    keywords,
  });
}

export function getHomePageStructuredData(locale: Locale) {
  return getHomePageStructuredDataForRoute(locale);
}

export function getHomePageStructuredDataForRoute(
  locale: Locale,
  explicitLocale = false,
) {
  const localeConfig = localizedSiteConfig[locale];
  const data = getPortfolioData(locale);
  const homeUrl = buildAbsoluteUrl(buildRoutePath(locale, "/", explicitLocale));
  const personId = `${homeUrl}#person`;
  const websiteId = `${homeUrl}#website`;
  const works = data.projects
    .filter((project) => project.link?.includes("github.com"))
    .map((project) => ({
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.summary,
      codeRepository: project.link as string,
      programmingLanguage: project.techTags.join(", "),
      author: {
        "@type": "Person",
        "@id": personId,
        name: localeConfig.name,
      },
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: localeConfig.name,
        url: homeUrl,
        jobTitle: localeConfig.role,
        description: localeConfig.description,
        image: `${siteConfig.siteUrl}/og.png`,
        email: siteConfig.email,
        knowsAbout: [
          "AI agent product delivery",
          "Forward-deployed engineering (FDE)",
          "Enterprise AI adoption",
          "Traditional-industry workflow modernization",
          "Retrieval-Augmented Generation (RAG)",
          "AI agent runtime design",
          "LangGraph orchestration",
          "FastAPI and Python",
          "Business system integration",
        ],
        sameAs: [
          "https://github.com/byteD-x",
          "https://my-resume-gray-five.vercel.app/",
          siteConfig.siteUrl,
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: localeConfig.title,
        description: localeConfig.description,
        inLanguage: locale === "en" ? "en-US" : "zh-CN",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${homeUrl}#profile`,
        url: homeUrl,
        name: localeConfig.title,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        inLanguage: locale === "en" ? "en-US" : "zh-CN",
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#projects`,
        name: locale === "en" ? "Selected engineering projects" : "精选工程项目",
        itemListElement: works.map((work, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: work.name,
          url: work.codeRepository,
          item: work,
        })),
      },
      ...works,
    ],
  };
}

export function getExperienceStructuredData(
  slug: string,
  locale: Locale,
  explicitLocale = false,
  routeBase: "experiences" | "projects" = "experiences",
) {
  const item = getExperience(slug, locale);
  if (!item) return null;

  const localeConfig = localizedSiteConfig[locale];
  const name = "role" in item ? `${item.role} - ${item.company}` : item.name;
  const url = buildAbsoluteUrl(
    buildRoutePath(locale, `/${routeBase}/${slug}`, explicitLocale),
  );
  const homeUrl = buildAbsoluteUrl(buildRoutePath(locale, "/", explicitLocale));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${homeUrl}#person`,
        name: localeConfig.name,
        url: homeUrl,
        jobTitle: localeConfig.role,
      },
      {
        "@type": item.link?.includes("github.com")
          ? "SoftwareSourceCode"
          : "CreativeWork",
        name,
        description: item.summary,
        url,
        ...(item.link ? { codeRepository: item.link } : {}),
        ...(item.techTags.length > 0
          ? { programmingLanguage: item.techTags.join(", ") }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "en" ? "Home" : "首页",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name,
            item: url,
          },
        ],
      },
    ],
  };
}
