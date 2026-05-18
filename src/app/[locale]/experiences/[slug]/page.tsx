import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencePageView } from "@/components/pages/ExperiencePageView";
import { getAllExperienceSlugs, getExperience } from "@/lib/experiences";
import { isLocale, locales } from "@/lib/locale";
import { getExperiencePageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllExperienceSlugs().map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  return getExperiencePageMetadata(slug, locale, true) ?? {};
}

export default async function LocalizedExperiencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const item = getExperience(slug, locale);
  if (!item) {
    notFound();
  }

  return <ExperiencePageView slug={slug} locale={locale} />;
}
