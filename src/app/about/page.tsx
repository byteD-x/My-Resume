import { getDeploymentDefaultLocale } from "@/lib/deployment-locale";
import { getPortfolioData } from "@/lib/portfolio-data";
import { DarkAboutPage } from "@/components/portfolio/DarkAboutPage";
import type { Metadata } from "next";
import { getSectionPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { const locale = getDeploymentDefaultLocale(); return getSectionPageMetadata(locale, "/about", locale === "zh" ? "关于 | 杜旭嘉" : "About | Xujia Du", locale === "zh" ? "杜旭嘉的交付能力、技术实践与合作入口。" : "Xujia Du's delivery capabilities, technical practice, and contact entry points."); }
export default function AboutPage() { const locale = getDeploymentDefaultLocale(); return <DarkAboutPage locale={locale} data={getPortfolioData(locale)} />; }
