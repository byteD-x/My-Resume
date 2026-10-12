import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locale";
import { getPortfolioData } from "@/lib/portfolio-data";
import { getSectionPageMetadata } from "@/lib/page-metadata";
import { DarkSiteNav } from "@/components/portfolio/DarkSiteNav";
import { DarkProjectIndex } from "@/components/portfolio/DarkProjectIndex";
import { DarkFooter } from "@/components/portfolio/DarkFooter";
export function generateStaticParams() { return [{ locale: "zh" }, { locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale: raw } = await params; if (!isLocale(raw)) return {}; const locale = raw as Locale; return getSectionPageMetadata(locale, "/projects", locale === "zh" ? "作品 | 杜旭嘉" : "Work | Xujia Du", locale === "zh" ? "AI Agent、FDE 与全栈工程作品。" : "Selected AI Agent, FDE, and full-stack engineering work.", true); }
export default async function LocalizedProjectsPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: raw } = await params; if (!isLocale(raw)) notFound(); const locale = raw as Locale; const data = getPortfolioData(locale); return <div className="dark-portfolio reboot-page reboot-inner-page"><DarkSiteNav name={data.hero.name} title={locale === "zh" ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"} active="work" /><main className="dark-page-main"><section className="dark-page-intro"><p className="dark-eyebrow">{locale === "zh" ? "作品索引" : "Selected work"}</p><h1>{locale === "zh" ? "把复杂系统做成能交付的东西。" : "Making complex systems deliverable."}</h1><p>{locale === "zh" ? "从知识问答、客服运行时到文件平台和长期运行助手，以下案例都保留了问题、取舍、结果和证据。" : "From knowledge QA and customer-service runtimes to file platforms and long-running assistants, each case keeps the problem, trade-offs, result, and evidence visible."}</p></section><DarkProjectIndex items={data.projects} locale={locale} explicitLocale /></main><DarkFooter locale={locale} email={data.contact.email} github={data.contact.github} explicitLocale /></div>; }
