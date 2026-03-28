"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Github, Mail, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProgressBar } from "@/components/ProgressBar";
import { useHydrated } from "@/hooks/useHydrated";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const shouldReduceMotion = useReducedMotion();
  const menuToggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuCloseButtonRef = useRef<HTMLButtonElement>(null);

  const resumeFileName = formatResumeFileName(heroData.title, heroData.name);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName);
  const resumeDownloadHandler = createResumeDownloadHandler(
    resumeFileName,
    resumeDownloadUrl,
  );

  const menuBackdropTransition = shouldReduceMotion
    ? { duration: 0.14 }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  const menuPanelTransition = shouldReduceMotion
    ? { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const }
    : ({ type: "spring", stiffness: 300, damping: 30, mass: 0.92 } as const);

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
            const nextSection = entry.target.id;
            setActiveSection((prev) =>
              prev === nextSection ? prev : nextSection,
            );
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
          ? "border-b border-[color:var(--border-default)] bg-[rgba(255,255,255,0.88)] py-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md"
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
                "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1.15rem] border border-[rgba(134,239,172,0.42)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(240,253,250,0.96)_58%,rgba(220,252,231,0.94)_100%)] shadow-[0_16px_34px_rgba(16,185,129,0.14),inset_0_1px_0_rgba(255,255,255,0.88)] transition-transform duration-300 group-hover:-translate-y-0.5",
                scrolled && "scale-95",
              )}
            >
              <span className="absolute inset-[1px] rounded-[1rem] bg-[radial-gradient(circle_at_30%_20%,rgba(110,231,183,0.42),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0)_72%)]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.62)]" />
              <span className="relative z-10 font-heading text-[10px] font-semibold tracking-[0.32em] text-slate-900">
                DXJ
              </span>
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-semibold leading-none text-[color:var(--text-primary)]">
                {heroData.name}
              </div>
              <div className="mt-1 text-xs font-medium text-[color:var(--text-tertiary)]">
                AI 应用工程师
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-1 rounded-full border border-[color:var(--border-default)] bg-[rgba(255,255,255,0.82)] p-1 shadow-sm md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => scrollTo(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "motion-chip rounded px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[linear-gradient(180deg,#243652_0%,#172235_100%)] text-[color:var(--text-inverse)] shadow-[0_12px_26px_rgba(15,23,42,0.14)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--brand-gold)]",
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
              className="motion-chip inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] text-[color:var(--text-secondary)] shadow-[0_10px_22px_rgba(15,23,42,0.06)] transition-colors hover:border-[rgba(96,165,250,0.22)] hover:text-[color:var(--brand-gold)]"
              aria-label="访问 GitHub 主页"
            >
              <Github size={16} className="motion-icon-float shrink-0" />
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
                "motion-chip inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] text-[color:var(--text-secondary)] shadow-[0_10px_22px_rgba(15,23,42,0.06)] transition-colors hover:border-[rgba(96,165,250,0.22)] hover:text-[color:var(--brand-gold)] disabled:cursor-not-allowed disabled:opacity-60",
                isOpen && "hidden",
              )}
            >
              <Mail size={18} className="motion-icon-float" />
              <span className="sr-only">联系</span>
            </button>

            <button
              type="button"
              ref={menuToggleButtonRef}
              className="motion-chip h-11 w-11 rounded-full p-0 text-[color:var(--text-secondary)] transition-colors hover:bg-[rgba(239,246,255,0.8)] hover:text-[color:var(--brand-gold)]"
              disabled={!isHydrated}
              onClick={() => setIsOpen((value) => !value)}
              aria-label="打开菜单"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={MOBILE_MENU_ID}
            >
              <Menu size={22} className="motion-icon-float" />
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
              transition={menuBackdropTransition}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.3)] backdrop-blur-[10px] md:hidden"
            />

            <motion.div
              id={MOBILE_MENU_ID}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { x: "100%", opacity: 0.94, scale: 0.985 }
              }
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { x: "100%", opacity: 0.96, scale: 0.992 }
              }
              transition={menuPanelTransition}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-[85%] max-w-sm origin-right flex-col border-l border-[color:var(--border-default)] bg-[rgba(255,255,255,0.98)] shadow-2xl backdrop-blur-xl md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="移动端导航菜单"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border-default)] p-5">
                <span className="text-sm font-semibold uppercase tracking-wider text-[color:var(--text-primary)]">
                  Menu
                </span>
                <button
                  type="button"
                  ref={menuCloseButtonRef}
                  onClick={() => setIsOpen(false)}
                  className="motion-chip h-11 w-11 rounded-full p-0 text-[color:var(--text-tertiary)] hover:bg-[rgba(239,246,255,0.8)] hover:text-[color:var(--brand-gold)]"
                  aria-label="关闭菜单"
                >
                  <X size={20} className="motion-icon-float" />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-4">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.div
                      key={item.href}
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, x: 18, filter: "blur(6px)" }
                      }
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: 12, filter: "blur(4px)" }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.12 }
                          : {
                              duration: 0.28,
                              delay: 0.05 + index * 0.035,
                              ease: [0.22, 1, 0.36, 1],
                            }
                      }
                    >
                      <button
                        type="button"
                        onClick={() => scrollTo(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "motion-chip w-full rounded-md px-4 py-4 text-left text-[15px] font-medium transition-colors",
                          isActive
                            ? "bg-[linear-gradient(180deg,rgba(239,246,255,0.98),rgba(219,234,254,0.94))] text-[color:var(--text-primary)] shadow-[0_14px_28px_rgba(37,99,235,0.1)]"
                            : "text-[color:var(--text-secondary)] hover:bg-[rgba(239,246,255,0.8)] hover:text-[color:var(--brand-gold)]",
                        )}
                      >
                        {item.name}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-[color:var(--border-default)] p-5">
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
