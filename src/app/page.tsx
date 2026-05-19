import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HomePageView } from "@/components/pages/HomePageView";
import { getRootLocaleEntryPath, getDeploymentDefaultLocale, shouldUseExplicitRootLocale } from "@/lib/deployment-locale";
import { getHomePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getDeploymentDefaultLocale();
  return getHomePageMetadata(locale, shouldUseExplicitRootLocale(locale));
}

export default function HomePage() {
  const locale = getDeploymentDefaultLocale();

  if (shouldUseExplicitRootLocale(locale)) {
    redirect(getRootLocaleEntryPath(locale));
  }

  return <HomePageView locale={locale} explicitLocale={false} />;
}
