import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencePageView } from "@/components/pages/ExperiencePageView";
import { getAllProjectSlugs, getProject } from "@/lib/experiences";
import { isLocale, locales, type Locale } from "@/lib/locale";
import { getExperiencePageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProjectSlugs().map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  return getExperiencePageMetadata(slug, raw as Locale, true, "projects") ?? {};
}

export default async function LocalizedProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  if (!getProject(slug, locale)) notFound();
  return (
    <ExperiencePageView
      slug={slug}
      locale={locale}
      explicitLocale
      routeBase="projects"
    />
  );
}
