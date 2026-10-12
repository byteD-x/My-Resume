"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Github, Mail } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { resolveLocalePath } from "@/lib/locale";
import { EN_RESUME_FILE_NAME, getResumeDownloadUrl, RESUME_FILE_NAME } from "@/lib/resume";
import { siteConfig } from "@/config/site";
import type { PortfolioData } from "@/types";
import { DarkSiteNav } from "./DarkSiteNav";
import { DarkFooter } from "./DarkFooter";
import { ContactReveal } from "./ContactReveal";

const contactProjects = {
  zh: [
    { name: "AI Customer Service Runtime", proof: "20/20 本地售后样例通过", url: "https://github.com/byteD-x/customer-ai-runtime" },
    { name: "RAG-QA System", proof: "400+ 回归测试项", url: "https://github.com/byteD-x/rag-qa-system" },
    { name: "WeChat Intelligent Assistant", proof: "25/25 本地 smoke 通过", url: "https://github.com/byteD-x/wechat-bot" },
    { name: "EasyCloudPan", proof: "上传、权限与可观测链路", url: "https://github.com/byteD-x/easyCloudPan" },
  ],
  en: [
    { name: "AI Customer Service Runtime", proof: "20/20 local support cases", url: "https://github.com/byteD-x/customer-ai-runtime" },
    { name: "RAG-QA System", proof: "400+ regression cases", url: "https://github.com/byteD-x/rag-qa-system" },
    { name: "WeChat Intelligent Assistant", proof: "25/25 local smoke checks", url: "https://github.com/byteD-x/wechat-bot" },
    { name: "EasyCloudPan", proof: "Upload, access, observability", url: "https://github.com/byteD-x/easyCloudPan" },
  ],
} as const;

export function DarkAboutPage({ locale, explicitLocale = false, data }: { locale: Locale; explicitLocale?: boolean; data: PortfolioData }) {
  const prefix = (path: string) => explicitLocale ? resolveLocalePath(path, locale) : path;
  const zh = locale === "zh";
  const resumeUrl = getResumeDownloadUrl("", locale);
  const mailSubject = encodeURIComponent(zh ? "项目合作咨询" : "Project collaboration inquiry");
  const mailBody = encodeURIComponent(zh ? "你好，想和你聊聊：\n\n项目背景：\n当前约束：\n期望验收：\n时间窗口：" : "Hi, I would like to discuss:\n\nProject context:\nCurrent constraints:\nAcceptance bar:\nTimeline:");
  const emailHref = `mailto:${data.contact.email}?subject=${mailSubject}&body=${mailBody}`;
  return (
    <div className="dark-portfolio reboot-page reboot-inner-page"><DarkSiteNav name={data.hero.name} title={zh ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"} active="about" /><main className="dark-page-main">
      <section className="dark-page-intro"><p className="dark-eyebrow">{zh ? "关于我" : "About"}</p><h1>{zh ? "我喜欢把模糊的问题，推进到可以运行的答案。" : "I like moving fuzzy problems toward answers that run."}</h1><p>{data.about[locale]}</p></section>
      <section className="dark-about-grid" id="skills"><div><p className="dark-eyebrow">{zh ? "能力范围" : "Delivery scope"}</p><h2>{zh ? "把问题推进到能验收的交付物。" : "Move the problem toward an accepted deliverable."}</h2></div><div className="dark-about-copy"><p>{zh ? "交付会留下状态与权限边界、可走通的主链路、评测入口和上线回滚基线。模型只是其中一层，接手的人还需要看得懂证据、指标和失败路径。" : "A delivery leaves state and access boundaries, an end-to-end path, evaluation hooks, and release and rollback baselines. The model is one layer; the team taking over also needs the evidence, metrics, and failure paths."}</p><div className="dark-capability-list">{data.skills.slice(0, 4).map((group) => <div key={group.id}><strong>{group.category}</strong><span>{group.items.slice(0, 5).join(" · ")}</span></div>)}</div></div></section>
      <section className="dark-about-grid" id="services"><div><p className="dark-eyebrow">{zh ? "合作方式" : "Ways to work"}</p><h2>{zh ? "从一个能验证的切口开始。" : "Start with a slice we can verify."}</h2></div><div className="dark-capability-list dark-service-list">{data.services.slice(0, 4).map((service) => <div key={service.id}><strong>{service.title}</strong><span>{service.description}</span></div>)}</div></section>
      <section className="dark-contact-panel dark-about-contact-panel" id="contact" aria-labelledby="about-contact-title"><div className="dark-about-contact-intro"><p className="dark-eyebrow">{zh ? "联系入口" : "Contact"}</p><h2 id="about-contact-title">{zh ? "说说你正在解决的事。" : "Tell me what you are trying to solve."}</h2><p>{zh ? "把项目背景、当前约束和验收标准发来，我会从一个能验证的切口开始。" : "Send the project context, current constraints, and acceptance bar. We can start with a slice we can verify."}</p>{data.contact.responseSlaText ? <p className="dark-about-contact-sla">{data.contact.responseSlaText}</p> : null}</div><div className="dark-contact-detail dark-about-contact-detail">
        <a className="dark-about-contact-primary" href={emailHref}><Mail size={17} aria-hidden="true" /><span>{zh ? "发一封项目邮件" : "Start with an email"}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={data.contact.github} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /><span>{zh ? "查看 GitHub 主页" : "Open GitHub profile"}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={resumeUrl} download={locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME}><FileText size={17} aria-hidden="true" /><span>{zh ? "下载简历" : "Download resume"}</span><ArrowUpRight size={15} aria-hidden="true" /></a>
        <div className="dark-about-contact-projects"><p className="dark-about-contact-projects-title">{zh ? "直接看这些仓库" : "Open these case repositories"}</p>{contactProjects[locale].map((project) => <a key={project.url} href={project.url} target="_blank" rel="noopener noreferrer"><span><strong>{project.name}</strong><small>{project.proof}</small></span><ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>
        <ContactReveal locale={locale} phone={data.contact.phone} wechat={data.contact.wechat} icp={siteConfig.icpRecord} />
      </div></section>
      <div className="dark-about-backlink"><Link className="dark-text-link" href={prefix("/projects")}>{zh ? "回到作品" : "Back to work"}<ArrowUpRight size={15} /></Link></div>
    </main><DarkFooter locale={locale} email={data.contact.email} github={data.contact.github} explicitLocale={explicitLocale} /></div>
  );
}
