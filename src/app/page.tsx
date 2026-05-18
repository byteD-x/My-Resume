import type { Metadata } from "next";
import { HomePageView } from "@/components/pages/HomePageView";
import { getDefaultLocale } from "@/lib/locale";
import { getHomePageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getHomePageMetadata(getDefaultLocale());
}

export default function HomePage() {
  return <HomePageView locale={getDefaultLocale()} />;
}
