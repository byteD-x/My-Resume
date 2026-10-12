"use client";

import { useEffect, useState, type ReactNode } from "react";

interface ScrollRuntimeProps {
  children: ReactNode;
  locale: "zh" | "en";
}

const acts = [
  { id: "hero", label: "01" },
  { id: "capability-summary", label: "02" },
  { id: "featured-projects", label: "03" },
  { id: "contact", label: "04" },
] as const;

export function ScrollRuntime({ children, locale }: ScrollRuntimeProps) {
  const [activeAct, setActiveAct] = useState("hero");

  useEffect(() => {
    const root = document.documentElement;
    const runtime = document.querySelector<HTMLElement>("[data-reboot-runtime]");
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reboot-section]"),
    );
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reboot-reveal]"),
    );

    runtime?.setAttribute("data-reboot-ready", "true");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveAct((visible.target as HTMLElement).id || "hero");
        }
      },
      { threshold: [0.22, 0.45, 0.7], rootMargin: "-12% 0px -35%" },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10%" },
    );
    reveals.forEach((reveal) => revealObserver.observe(reveal));

    let frame = 0;
    const syncProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      root.style.setProperty("--reboot-progress", String(value));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    syncProgress();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      sectionObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--reboot-progress");
      runtime?.removeAttribute("data-reboot-ready");
    };
  }, []);

  const currentIndex = Math.max(0, acts.findIndex((act) => act.id === activeAct));

  return (
    <div className="reboot-runtime" data-reboot-runtime data-reboot-act={activeAct}>
      {children}
      <aside className="reboot-progress" aria-label={locale === "zh" ? "页面进度" : "Page progress"}>
        <div className="reboot-progress-track" aria-hidden="true">
          <span className="reboot-progress-fill" />
        </div>
        <nav className="reboot-progress-acts" aria-label={locale === "zh" ? "页面分区导航" : "Section navigation"}>
          {acts.map((act, index) => (
            <a
              key={act.id}
              href={`#${act.id}`}
              className={index === currentIndex ? "is-active" : undefined}
              aria-current={index === currentIndex ? "step" : undefined}
            >
              <span>{act.label}</span>
              <small>{locale === "zh" ? ["首页", "能力", "作品", "联系"][index] : ["Home", "Skills", "Work", "Contact"][index]}</small>
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
