import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageView } from "@/components/pages/HomePageView";
import { isLocale } from "@/lib/locale";
import { getHomePageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  return getHomePageMetadata(locale, true);
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return <HomePageView locale={locale} explicitLocale={true} />;
}
