import { ExperienceModal } from "@/components/ExperienceModal";
import { StructuredDataScript } from "@/components/StructuredDataScript";
import { getExperience } from "@/lib/experiences";
import { getExperienceStructuredData } from "@/lib/page-metadata";
import type { Locale } from "@/lib/locale";

interface ExperiencePageViewProps {
  slug: string;
  locale: Locale;
}

export function ExperiencePageView({
  slug,
  locale,
}: ExperiencePageViewProps) {
  const item = getExperience(slug, locale);

  if (!item) {
    return null;
  }

  const structuredData = getExperienceStructuredData(slug, locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgba(255,250,242,0.82)] p-4">
      {structuredData ? <StructuredDataScript data={structuredData} /> : null}
      <ExperienceModal item={item} variant="page" />
    </div>
  );
}
