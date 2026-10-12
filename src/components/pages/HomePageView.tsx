import { DarkHomePage } from "@/components/portfolio/DarkHomePage";
import type { Locale } from "@/lib/locale";

interface HomePageViewProps {
  locale: Locale;
  explicitLocale?: boolean;
}

export function HomePageView({
  locale,
  explicitLocale = false,
}: HomePageViewProps) {
  return <DarkHomePage locale={locale} explicitLocale={explicitLocale} />;
}
