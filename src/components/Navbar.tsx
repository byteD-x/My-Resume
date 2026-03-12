"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Github, Mail, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProgressBar } from "@/components/ProgressBar";
import { useHydrated } from "@/hooks/useHydrated";
import { ContactData, HeroData } from "@/types";
import {
  createResumeDownloadHandler,
  formatResumeFileName,
  getResumeDownloadUrl,
} from "@/lib/resume";
import {
  trackCTAClick,
  trackExternalLink,
  trackResumeDownload,
} from "@/lib/analytics";
import { useScrollPastThreshold } from "@/lib/scroll-observer";
import {
  getPreferredScrollBehavior,
  getSectionScrollTarget,
  scrollToSection,
} from "@/lib/section-scroll";
import { cn } from "@/lib/utils";

interface NavbarProps {
  heroData: HeroData;
  contactData: ContactData;
}

const navItems = [
  { name: "成果", href: "#impact" },
  { name: "经历", href: "#experience" },
  { name: "项目", href: "#projects" },
  { name: "技能", href: "#skills" },
  { name: "服务", href: "#services" },
  { name: "联系", href: "#contact" },
];

const MOBILE_MENU_ID = "mobile-navigation-drawer";

export default function Navbar({ heroData, contactData }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const scrolled = useScrollPastThreshold(40);
  const isHydrated = useHydrated();
  const menuToggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);

  const resumeFileName = formatResumeFileName(heroData.title, heroData.name);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
  const resumeDownloadHandler = createResumeDownloadHandler(
    resumeFileName,
    resumeDownloadUrl,
  );

  const scrollTo = (href: string) => {
    setIsOpen(false);
    if (typeof window === "undefined") return;

    const targetId = href.startsWith("#") ? href.slice(1) : href;
    const scrollBehavior = getPreferredScrollBehavior();
    const maxAttempts = 6;

    const attemptScroll = (attempt: number) => {
      if (scrollToSection(targetId, { behavior: scrollBehavior })) {
        setActiveSection(targetId);
        return;
      }

      if (attempt >= maxAttempts) return;
      window.setTimeout(() => attemptScroll(attempt + 1), 60);
    };

    attemptScroll(0);
  };

  const handleResumeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    trackCTAClick("resume_download", "navbar");
    trackResumeDownload();
    resumeDownloadHandler?.(event);
  };

  const handleContactClick = () => {
    trackCTAClick("contact", "navbar");
    scrollTo("#contact");
  };

  const handleGithubClick = () => {
    trackExternalLink(contactData.github, "navbar_github");
  };

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const toggleButton = menuToggleButtonRef.current;
    document.body.style.overflow = "hidden";
    menuCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      toggleButton?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    navItems.forEach((item) => {
      const element = getSectionScrollTarget(item.href.slice(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      data-print="hide"
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-zinc-200/90 bg-white/96 dark:border-zinc-800/90 dark:bg-zinc-950/96 py-3"
          : "border-transparent bg-transparent py-5",
      )}
    >
      <ProgressBar
        className={cn(
          "opacity-0 transition-opacity duration-300",
          scrolled && "opacity-100",
        )}
      />

      <Container>
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: getPreferredScrollBehavior(),
              })
            }
            className="group flex items-center gap-3"
            aria-label="返回顶部"
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded bg-zinc-900 text-sm font-bold text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-zinc-900",
                scrolled && "scale-95",
              )}
            >
              DXJ
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-50">
                {heroData.name}
              </div>
              <div className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                AI 应用工程师
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-1 rounded-md border border-zinc-200/50 bg-white/50 p-1 md:flex dark:border-zinc-800/50 dark:bg-zinc-900/50">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => scrollTo(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGithubClick}
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="访问 GitHub 主页"
            >
              <Github size={16} className="shrink-0" />
            </a>

            <a
              href={resumeDownloadUrl}
              download={resumeFileName}
              onClick={handleResumeClick}
              className="btn btn-secondary h-9 px-4 text-sm"
              aria-label="下载简历 PDF"
            >
              下载简历
            </a>

            <button
              type="button"
              onClick={handleContactClick}
              className="btn btn-primary h-9 px-4 text-sm"
              aria-label="联系我"
            >
              联系我
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => {
                trackCTAClick("contact", "navbar_mobile_quick");
                scrollTo("#contact");
              }}
              disabled={!isHydrated}
              aria-label="联系我"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400",
                isOpen && "hidden",
              )}
            >
              <Mail size={18} />
              <span className="sr-only">联系</span>
            </button>

            <button
              type="button"
              ref={menuToggleButtonRef}
              className="p-2.5 text-zinc-600 dark:text-zinc-400"
              disabled={!isHydrated}
              onClick={() => setIsOpen((value) => !value)}
              aria-label="打开菜单"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={MOBILE_MENU_ID}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              id={MOBILE_MENU_ID}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl dark:bg-zinc-950 dark:border-l dark:border-zinc-800 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="移动端导航菜单"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
                <span className="text-sm font-semibold tracking-wider uppercase text-zinc-900 dark:text-zinc-100">Menu</span>
                <button
                  type="button"
                  ref={menuCloseButtonRef}
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  aria-label="关闭菜单"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-4">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => scrollTo(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "w-full rounded-md px-4 py-4 text-left text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-zinc-100 p-5 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    trackCTAClick("contact", "navbar_mobile_menu");
                    scrollTo("#contact");
                  }}
                  className="btn btn-primary w-full py-3"
                >
                  联系我
                </button>

                <a
                  href={resumeDownloadUrl}
                  download={resumeFileName}
                  onClick={handleResumeClick}
                  className="btn btn-secondary w-full py-3"
                >
                  下载简历
                </a>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
