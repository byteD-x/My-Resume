import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencePageView } from "@/components/pages/ExperiencePageView";
import { getDeploymentDefaultLocale } from "@/lib/deployment-locale";
import { getAllExperienceSlugs, getExperience } from "@/lib/experiences";
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
  return getExperiencePageMetadata(slug, getDeploymentDefaultLocale()) ?? {};
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = getDeploymentDefaultLocale();
  const item = getExperience(slug, locale);

  if (!item) {
    notFound();
  }

  return <ExperiencePageView slug={slug} locale={locale} explicitLocale={false} />;
}
