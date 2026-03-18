import { notFound } from "next/navigation";
import { getExperience, getAllExperienceSlugs } from "@/lib/experiences";
import { ExperienceModal } from "@/components/ExperienceModal";

export async function generateStaticParams() {
  return getAllExperienceSlugs();
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getExperience(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgba(255,250,242,0.82)] p-4">
      <ExperienceModal item={item} variant="page" />
    </div>
  );
}
