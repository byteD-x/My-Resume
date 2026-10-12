import type { MetadataRoute } from "next";
import { localizedSiteConfig, siteConfig } from "@/config/site";
import { getDeploymentDefaultLocale, getRootLocaleEntryPath } from "@/lib/deployment-locale";
import { getHtmlLang } from "@/lib/locale";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const locale = getDeploymentDefaultLocale();
  const localeConfig = localizedSiteConfig[locale];

  return {
    name: localeConfig.title,
    short_name: siteConfig.shortName,
    description: localeConfig.description,
    start_url: getRootLocaleEntryPath(locale),
    display: "standalone",
    background_color: "#0C0D10",
    theme_color: "#0C0D10",
    lang: getHtmlLang(locale),
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
    ],
  };
}
