import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencePageView } from "@/components/pages/ExperiencePageView";
import { getAllExperienceSlugs, getExperience } from "@/lib/experiences";
import { getDefaultLocale } from "@/lib/locale";
import { getExperiencePageMetadata } from "@/lib/page-metadata";

export async function generateStaticParams() {
  return getAllExperienceSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getExperiencePageMetadata(slug, getDefaultLocale()) ?? {};
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = getDefaultLocale();
  const item = getExperience(slug, locale);

  if (!item) {
    notFound();
  }

  return <ExperiencePageView slug={slug} locale={locale} />;
}
