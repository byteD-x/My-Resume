import type { Metadata } from "next";
import { getDeploymentDefaultLocale } from "@/lib/deployment-locale";
import { getHomepageData } from "@/lib/home-data";
import { DarkSiteNav } from "@/components/portfolio/DarkSiteNav";
import { DarkExperienceIndex } from "@/components/portfolio/DarkExperienceIndex";
import { DarkFooter } from "@/components/portfolio/DarkFooter";
import { getSectionPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { const locale = getDeploymentDefaultLocale(); return getSectionPageMetadata(locale, "/experience", locale === "zh" ? "经历 | 杜旭嘉" : "Experience | Xujia Du", locale === "zh" ? "从后端、AI 应用到现场交付的工程经历。" : "An engineering record from backend systems to AI delivery."); }
export default function ExperienceIndexPage() { const locale = getDeploymentDefaultLocale(); const data = getHomepageData(locale); return <div className="dark-portfolio reboot-page reboot-inner-page"><DarkSiteNav name={data.hero.name} title={locale === "zh" ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"} active="experience" /><main className="dark-page-main"><section className="dark-page-intro"><p className="dark-eyebrow">{locale === "zh" ? "经历时间线" : "Experience"}</p><h1>{locale === "zh" ? "从后端、AI 应用到现场交付。" : "From backend systems to AI applications in the field."}</h1><p>{locale === "zh" ? "一条按时间展开的工程路径，保留项目上下文、角色和可核验证据。" : "A chronological record of systems, roles, and evidence."}</p></section><DarkExperienceIndex items={data.homepageTimeline} locale={locale} /></main><DarkFooter locale={locale} email={data.contact.email} github={data.contact.github} /></div>; }
