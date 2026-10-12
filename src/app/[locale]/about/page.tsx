import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locale";
import { getPortfolioData } from "@/lib/portfolio-data";
import { DarkAboutPage } from "@/components/portfolio/DarkAboutPage";
import type { Metadata } from "next";
import { getSectionPageMetadata } from "@/lib/page-metadata";
export function generateStaticParams() { return [{ locale: "zh" }, { locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale: raw } = await params; if (!isLocale(raw)) return {}; const locale = raw as Locale; return getSectionPageMetadata(locale, "/about", locale === "zh" ? "关于 | 杜旭嘉" : "About | Xujia Du", locale === "zh" ? "杜旭嘉的交付能力、技术实践与合作入口。" : "Xujia Du's delivery capabilities, technical practice, and contact entry points.", true); }
export default async function LocalizedAboutPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!isLocale(raw)) notFound(); const locale = raw as Locale; return <DarkAboutPage locale={locale} explicitLocale data={getPortfolioData(locale)} />; }
