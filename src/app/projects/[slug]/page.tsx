import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperiencePageView } from "@/components/pages/ExperiencePageView";
import {
  getAllProjectSlugs,
  getProject,
} from "@/lib/experiences";
import { getDeploymentDefaultLocale } from "@/lib/deployment-locale";
import { getExperiencePageMetadata } from "@/lib/page-metadata";

export function generateStaticParams() {
  return getAllProjectSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = getDeploymentDefaultLocale();
  return getExperiencePageMetadata(slug, locale, false, "projects") ?? {};
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = getDeploymentDefaultLocale();
  if (!getProject(slug, locale)) notFound();
  return (
    <ExperiencePageView
      slug={slug}
      locale={locale}
      routeBase="projects"
    />
  );
}
