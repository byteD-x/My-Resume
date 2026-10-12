import { DarkExperienceDetail } from "@/components/portfolio/DarkExperienceDetail";
import { StructuredDataScript } from "@/components/StructuredDataScript";
import { getExperience } from "@/lib/experiences";
import { getExperienceStructuredData } from "@/lib/page-metadata";
import type { Locale } from "@/lib/locale";

interface ExperiencePageViewProps {
  slug: string;
  locale: Locale;
  explicitLocale?: boolean;
  routeBase?: "experiences" | "projects";
}

export function ExperiencePageView({
  slug,
  locale,
  explicitLocale = false,
  routeBase = "experiences",
}: ExperiencePageViewProps) {
  const item = getExperience(slug, locale);

  if (!item) {
    return null;
  }

  const structuredData = getExperienceStructuredData(
    slug,
    locale,
    explicitLocale,
    routeBase,
  );

  return (
    <>
      {structuredData ? <StructuredDataScript data={structuredData} /> : null}
      <DarkExperienceDetail item={item} locale={locale} explicitLocale={explicitLocale} />
    </>
  );
}
