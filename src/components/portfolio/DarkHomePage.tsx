import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Github, Mail, FileText } from "lucide-react";
import { getHomepageData } from "@/lib/home-data";
import { siteConfig } from "@/config/site";
import { resolveLocalePath, type Locale } from "@/lib/locale";
import { EN_RESUME_FILE_NAME, getResumeDownloadUrl, RESUME_FILE_NAME } from "@/lib/resume";
import { StructuredDataScript } from "@/components/StructuredDataScript";
import { getHomePageStructuredDataForRoute } from "@/lib/page-metadata";
import { ContactReveal } from "./ContactReveal";
import { RebootMetricGrid } from "./RebootMetricGrid";
import { DarkFooter } from "./DarkFooter";
import { DarkProjectVisual } from "./DarkProjectVisual";
import { DarkSiteNav } from "./DarkSiteNav";
import { LegacyAnchorRedirect } from "./LegacyAnchorRedirect";
import { ScrollRuntime } from "./ScrollRuntime";

interface DarkHomePageProps {
  locale: Locale;
  explicitLocale?: boolean;
}

const projectVisuals: Record<string, string> = {
  "proj-customer-ai-runtime": "runtime",
  "proj-rag-qa-system": "retrieval",
  "proj-wechat-bot": "memory",
  "proj-cloudpan": "storage",
};

const capabilityCopy = {
  zh: [
    { code: "01", title: "AI Agent 产品化", body: "让模型拥有边界、依据和恢复路径，从问答走到能被业务调用的工作流。", proof: "LangGraph / RAG / Tool calling" },
    { code: "02", title: "FDE 现场交付", body: "贴近一线流程，把模型接入权限、数据和既有系统，推动试点走到上线。", proof: "Auth bridge / business tools / handoff" },
    { code: "03", title: "全栈工程交付", body: "从接口、状态、前端到部署和回滚，负责一条可验收的交付路径。", proof: "Python / Java / Next.js / Docker" },
    { code: "04", title: "传统行业 AI 化", body: "从高频、重复、可验证的环节切入，持续控制成本、延迟与失败路径。", proof: "Evidence / eval / observability" },
  ],
  en: [
    { code: "01", title: "Agent productization", body: "Give models boundaries, evidence, and recovery paths that survive real workflows.", proof: "LangGraph / RAG / tool calling" },
    { code: "02", title: "Forward-deployed delivery", body: "Work close to the field and connect models to permissions, data, and existing systems.", proof: "Auth bridge / business tools / handoff" },
    { code: "03", title: "Full-stack delivery", body: "Own the path from APIs and state to frontend, deployment, and rollback.", proof: "Python / Java / Next.js / Docker" },
    { code: "04", title: "AI for traditional workflows", body: "Start with frequent, repeatable, verifiable slices and keep cost and failure visible.", proof: "Evidence / eval / observability" },
  ],
} as const;

const caseLabels = {
  zh: { function: "功能描述", technical: "技术描述", view: "查看案例拆解" },
  en: { function: "Capability breakdown", technical: "Technical implementation", view: "Open case study" },
} as const;

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

function prefixPath(path: string, locale: Locale, explicitLocale: boolean) {
  return explicitLocale ? resolveLocalePath(path, locale) : path;
}

export function DarkHomePage({ locale, explicitLocale = false }: DarkHomePageProps) {
  const data = getHomepageData(locale);
  const zh = locale === "zh";
  const copy = zh
    ? {
        heroKicker: "AI AGENT / FDE ENGINEER",
        heroTitle: "把 AI 接进真实工作。",
        heroBody: "杜旭嘉，AI Agent / FDE 工程师。贴近业务现场，把模型接进知识、流程与既有系统，让结果能上线、能复核、能继续运行。",
        explore: "查看项目证据",
        resume: "下载简历",
        capabilitiesKicker: "能力结构",
        capabilitiesTitle: "我主要做四类工作。",
        experienceKicker: "经历时间线",
        experienceTitle: "从后端、AI 应用到现场交付。",
        impactKicker: "量化结果",
        impactTitle: "先看结果，再打开证据。",
        impactNote: "以上指标均可在项目详情与仓库中复核。",
        workKicker: "精选作品",
        workTitle: "把复杂系统做成能交付的东西。",
        workBody: "每个案例都保留问题、方案、结果和验证来源，项目详情可以直接核对。",
        contactKicker: "保持联系",
        contactTitle: "有一个系统要交付？",
        contactBody: "欢迎把现状、约束和验收标准发来，一起拆出下一步。",
        allWork: "查看全部作品",
        allExperience: "查看完整经历",
      }
    : {
        heroKicker: "AI AGENT / FDE ENGINEER",
        heroTitle: "I put AI into real work.",
        heroBody: "Xujia Du, an AI Agent / FDE engineer. I connect models to knowledge, workflows, and existing systems so results can ship, be inspected, and keep running.",
        explore: "View project evidence",
        resume: "Download resume",
        capabilitiesKicker: "Capability structure",
        capabilitiesTitle: "Four kinds of work I take from a real request to delivery.",
        experienceKicker: "Experience timeline",
        experienceTitle: "From backend systems to AI applications in the field.",
        impactKicker: "Measured outcomes",
        impactTitle: "Start with the result, then inspect the evidence.",
        impactNote: "Every metric is traceable to a project detail or repository source.",
        workKicker: "Selected work",
        workTitle: "Making complex systems deliverable.",
        workBody: "Each case keeps the problem, approach, result, and evidence visible for direct review.",
        contactKicker: "Stay in touch",
        contactTitle: "Have a system to ship?",
        contactBody: "Send the current state, constraints, and acceptance bar. We can shape the next step together.",
        allWork: "View all work",
        allExperience: "View full experience",
      };
  const resume = getResumeDownloadUrl("", locale);
  const capabilities = capabilityCopy[locale];
  const mailSubject = encodeURIComponent(zh ? "项目合作咨询" : "Project collaboration inquiry");
  const mailBody = encodeURIComponent(zh ? "你好，想和你聊聊：\n\n项目背景：\n当前约束：\n期望验收：\n时间窗口：" : "Hi, I would like to discuss:\n\nProject context:\nCurrent constraints:\nAcceptance bar:\nTimeline:");
  const emailHref = `mailto:${data.contact.email}?subject=${mailSubject}&body=${mailBody}`;
  const visibleTimeline = data.homepageTimeline.filter((item) => !item.hideFromSection).slice(0, 4);
  const featured = data.homepageFeaturedProjects;

  return (
    <div className="dark-portfolio reboot-page">
      <LegacyAnchorRedirect locale={locale} explicitLocale={explicitLocale} />
      <StructuredDataScript data={getHomePageStructuredDataForRoute(locale, explicitLocale)} />
      <DarkSiteNav name={data.hero.name} title={zh ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"} />

      <ScrollRuntime locale={locale}>
        <main>
          <section id="hero" data-reboot-section="hero" className="reboot-hero" aria-labelledby="reboot-hero-title">
            <div className="reboot-container reboot-hero-grid">
              <div className="reboot-hero-copy">
                <p className="reboot-kicker"><span className="reboot-status" />{copy.heroKicker}</p>
                <h1 id="reboot-hero-title">{data.hero.name}</h1>
                <h2>{zh ? "AI Agent / FDE 工程师" : "AI Agent / FDE Engineer"}</h2>
                <p className="reboot-hero-titleline">{copy.heroTitle}</p>
                <p className="reboot-hero-body">{copy.heroBody}</p>
                <div className="reboot-hero-actions">
                  <a href="#projects" className="reboot-button reboot-button-primary">{copy.explore}<ArrowDown size={16} aria-hidden="true" /></a>
                  <a href={resume} download={locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME} className="reboot-button reboot-button-quiet">{copy.resume}<ArrowUpRight size={15} aria-hidden="true" /></a>
                </div>
                <div className="reboot-proof-lines" aria-label={zh ? "核心能力" : "Core positioning"}>
                  {data.hero.bullets.slice(0, 3).map((bullet) => (
                    <span key={bullet.id}><Check size={14} aria-hidden="true" />{bullet.title}</span>
                  ))}
                </div>
              </div>
              <div className="reboot-hero-visual" aria-label={zh ? "AI 系统概念视觉" : "AI systems concept visual"} role="img">
                <Image src="/images/lab-hero-20261011-165027-20261011-481f4411bf09.webp" alt={zh ? "悬浮的透明几何体，象征连接中的 AI 系统" : "A floating transparent form representing connected AI systems"} fill priority sizes="(max-width: 767px) 100vw, 52vw" className="reboot-hero-image" />
                <div className="reboot-hero-overlay" />
                <div className="reboot-hero-readout"><span>RUNTIME / 01</span><strong>MODEL → WORKFLOW → PROOF</strong><small>ready for a real system</small></div>
                <div className="reboot-hero-axis reboot-hero-axis-x" /><div className="reboot-hero-axis reboot-hero-axis-y" />
              </div>
            </div>
            <div className="reboot-container reboot-hero-foot"><span>{data.hero.location}</span><a href="#capability-summary">{zh ? "向下查看能力" : "Scroll for capability"}<ArrowDown size={14} aria-hidden="true" /></a></div>
          </section>

          <section id="capability-summary" data-reboot-section="capabilities" className="reboot-section reboot-capabilities" aria-labelledby="capabilities-title">
            <div className="reboot-container">
              <header className="reboot-section-head reboot-reveal" data-reboot-reveal>
                <p className="reboot-kicker">{copy.capabilitiesKicker}</p>
                <h2 id="capabilities-title">{copy.capabilitiesTitle}</h2>
              </header>
              <div className="reboot-capability-grid">
                {capabilities.map((capability) => (
                  <article className="reboot-capability-card reboot-reveal" data-reboot-reveal key={capability.code}>
                    <div className="reboot-card-topline"><span>{capability.code}</span><span>0{Number(capability.code)}</span></div>
                    <h3>{capability.title}</h3>
                    <p>{capability.body}</p>
                    <span className="reboot-card-proof">{capability.proof}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" className="reboot-section reboot-experience" aria-labelledby="experience-title">
            <div className="reboot-container">
              <div className="reboot-section-head reboot-section-head-split reboot-reveal" data-reboot-reveal>
                <div><p className="reboot-kicker">{copy.experienceKicker}</p><h2 id="experience-title">{copy.experienceTitle}</h2></div>
                <Link href={prefixPath("/experience", locale, explicitLocale)} className="reboot-text-link">{copy.allExperience}<ArrowUpRight size={15} /></Link>
              </div>
              <div className="reboot-timeline">
                {visibleTimeline.map((item) => {
                  const children = item.childIds?.map((childId) => data.homepageTimeline.find((entry) => entry.id === childId)).filter(Boolean) ?? [];
                  return (
                    <article className="reboot-timeline-row reboot-reveal" data-reboot-reveal key={item.id}>
                      <time>{item.year}</time><span className="reboot-timeline-marker" aria-hidden="true" />
                      <div className="reboot-timeline-copy"><p className="reboot-meta">{item.company}</p><h3>{item.role}</h3><p>{item.summary}</p>
                        {children.length > 0 ? <div className="reboot-child-projects"><span className="reboot-meta">{zh ? "项目名称 / 实践场景" : "Projects / practice"}</span>{children.map((child) => <div key={child!.id}><strong>{child!.company}</strong><span>{zh ? `技术栈：${child!.techTags.slice(0, 4).join(" / ")}` : `Stack: ${child!.techTags.slice(0, 4).join(" / ")}`}</span></div>)}</div> : null}
                        {item.keyOutcomes?.[0] ? <p className="reboot-timeline-proof"><strong>{zh ? "结果" : "Result"}</strong>{item.keyOutcomes[0]}</p> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="impact" className="reboot-section reboot-impact" aria-labelledby="impact-title">
            <div className="reboot-container">
              <div className="reboot-section-head reboot-section-head-split reboot-reveal" data-reboot-reveal>
                <div><p className="reboot-kicker">{copy.impactKicker}</p><h2 id="impact-title">{copy.impactTitle}</h2><p>{copy.impactNote}</p></div>
                <span className="reboot-section-index">{String(data.impact.length).padStart(2, "0")} verified signals</span>
              </div>
              <RebootMetricGrid items={data.impact} linkedItems={data.impactTimeline} locale={locale} />
            </div>
          </section>

          <section id="featured-projects" data-reboot-section="work" className="reboot-section reboot-work" aria-labelledby="work-title">
            <div className="reboot-container">
              <header className="reboot-section-head reboot-reveal" data-reboot-reveal>
                <p className="reboot-kicker">{copy.workKicker}</p><h2 id="work-title">{copy.workTitle}</h2><p>{copy.workBody}</p>
              </header>
              <div id="projects" className="reboot-project-grid">
                {featured.map((item, index) => {
                  const labels = caseLabels[locale];
                  const visualKind = projectVisuals[item.id] ?? "runtime";
                  return (
                    <article key={item.id} className={`reboot-project-card reboot-project-card-${index + 1} reboot-reveal`} data-reboot-reveal>
                      <Link href={prefixPath(item.href, locale, explicitLocale)} className="reboot-project-visual-link" aria-label={`${labels.view}: ${item.name}`}>
                        <DarkProjectVisual kind={visualKind} label={item.name} locale={locale} />
                      </Link>
                      <div className="reboot-project-body"><div className="reboot-project-meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{item.focus}</span></div><h3>{item.name}</h3><p className="reboot-project-summary">{item.contentSummary}</p><div className="reboot-project-details"><div><span>{labels.function}</span><p>{item.capabilitySummary}</p></div><div><span>{labels.technical}</span><p>{item.technicalSummary}</p></div></div><div className="reboot-project-footer"><div className="reboot-tags">{item.techTags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={prefixPath(item.href, locale, explicitLocale)} className="reboot-text-link">{labels.view}<ArrowUpRight size={15} /></Link></div></div>
                    </article>
                  );
                })}
              </div>
              <div className="reboot-section-action"><Link href={prefixPath("/projects", locale, explicitLocale)} className="reboot-button reboot-button-quiet">{copy.allWork}<ArrowUpRight size={15} /></Link></div>
            </div>
          </section>

          <section id="contact" data-reboot-section="contact" className="reboot-section reboot-contact" aria-labelledby="contact-title">
            <div className="reboot-container reboot-contact-panel reboot-reveal" data-reboot-reveal>
              <div><p className="reboot-kicker">{copy.contactKicker}</p><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactBody}</p><p className="reboot-contact-sla">{data.contact.responseSlaText}</p></div>
              <div className="reboot-contact-links">
                <a className="reboot-contact-primary" href={emailHref}><Mail size={17} aria-hidden="true" /><span>{zh ? "发一封项目邮件" : "Start with an email"}</span><ArrowUpRight size={14} /></a>
                <a href={data.contact.github} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" /><span>{zh ? "查看 GitHub 主页" : "Open GitHub profile"}</span><ArrowUpRight size={14} /></a>
                <a href={getResumeDownloadUrl("", locale)} download={locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME}><FileText size={17} aria-hidden="true" /><span>{zh ? "下载简历" : "Download resume"}</span><ArrowUpRight size={14} /></a>
                <div className="reboot-contact-projects"><p className="reboot-contact-projects-title">{zh ? "直接看这些仓库" : "Open these case repositories"}</p>{contactProjects[locale].map((project) => <a key={project.url} href={project.url} target="_blank" rel="noopener noreferrer"><span><strong>{project.name}</strong><small>{project.proof}</small></span><ArrowUpRight size={14} /></a>)}</div>
                <ContactReveal locale={locale} phone={data.contact.phone} wechat={data.contact.wechat} icp={siteConfig.icpRecord} />
              </div>
            </div>
          </section>
        </main>
      </ScrollRuntime>
      <DarkFooter locale={locale} email={data.contact.email} github={data.contact.github} explicitLocale={explicitLocale} />
    </div>
  );
}
