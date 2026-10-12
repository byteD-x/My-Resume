"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/LocaleProvider";
import { type Locale, resolveLocalePath } from "@/lib/locale";
import { getResumeDownloadUrl, RESUME_FILE_NAME, EN_RESUME_FILE_NAME } from "@/lib/resume";
import { ThemeToggle } from "./ThemeToggle";

interface DarkSiteNavProps {
  name: string;
  title: string;
  active?: string;
}

const labels = {
  zh: { work: "作品", experience: "经历", about: "关于", contact: "联系", resume: "简历", menu: "打开菜单", close: "关闭菜单", switch: "切换到 English" },
  en: { work: "Work", experience: "Experience", about: "About", contact: "Contact", resume: "Resume", menu: "Open menu", close: "Close menu", switch: "Switch to Chinese" },
} as const;

export function DarkSiteNav({ name, title, active }: DarkSiteNavProps) {
  const { locale, explicitLocale, switchLocaleHref } = useLocale();
  const copy = labels[locale];
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const wasOpenRef = useRef(false);
  const prefix = (path: string) =>
    explicitLocale ? resolveLocalePath(path, locale) : path;
  const items = [
    { id: "work", href: prefix("/projects"), label: copy.work },
    { id: "experience", href: prefix("/experience"), label: copy.experience },
    { id: "about", href: prefix("/about"), label: copy.about },
    { id: "contact", href: explicitLocale ? resolveLocalePath("/", locale, "", "#contact") : "/#contact", label: copy.contact },
  ];
  const resumeUrl = getResumeDownloadUrl("", locale);
  const resumeFileName = locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      firstMobileLinkRef.current?.focus();
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  return (
    <header className="dark-nav-wrap">
      <nav className="dark-nav" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
        <Link href={explicitLocale ? prefix("/") : "/"} className="dark-wordmark" onClick={() => setOpen(false)}>
          <span className="dark-wordmark-mark">DXJ</span>
          <span>
            <strong>{name}</strong>
            <small>{title}</small>
          </span>
        </Link>

        <div className="dark-nav-links">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className={cn("dark-nav-link", active === item.id && "is-active")}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="dark-nav-actions">
          <a className="dark-nav-locale" aria-label={copy.switch} href={switchLocaleHref(locale === "zh" ? ("en" as Locale) : ("zh" as Locale))}>
            {locale === "zh" ? "EN" : "中"}
          </a>
          <ThemeToggle locale={locale} />
          <a href={resumeUrl} download={resumeFileName} className="dark-nav-resume">
            {copy.resume} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <button ref={triggerRef} type="button" className="dark-menu-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="dark-mobile-menu" aria-label={open ? copy.close : copy.menu}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div id="dark-mobile-menu" className="dark-mobile-menu">
          {items.map((item, index) => (
            <Link ref={index === 0 ? firstMobileLinkRef : undefined} key={item.id} href={item.href} onClick={() => setOpen(false)} className={cn("dark-mobile-link", active === item.id && "is-active")}>
              {item.label}
            </Link>
          ))}
          <a href={resumeUrl} download={resumeFileName} className="dark-mobile-link" onClick={() => setOpen(false)}>{copy.resume}</a>
        </div>
      ) : null}
    </header>
  );
}
