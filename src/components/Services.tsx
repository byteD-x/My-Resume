"use client";

import React from "react";
import { m as motion } from "framer-motion";
import { Bot, Layout, Workflow, Zap, type LucideProps } from "lucide-react";
import { ServiceItem } from "@/types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { useLowPerformanceMode } from "@/hooks/useLowPerformanceMode";

const IconMap: Record<string, React.ComponentType<LucideProps>> = {
  Layout,
  Bot,
  Zap,
  Workflow,
};

interface ServicesProps {
  services: ServiceItem[];
}

export default function Services({ services }: ServicesProps) {
  const isLowPerformanceMode = useLowPerformanceMode();
  const shouldAnimateInView = !isLowPerformanceMode;

  if (!services || services.length === 0) return null;

  return (
    <Section className="theme-grid-section theme-section-balanced relative">
      <Container>
        <div className="theme-section-header md:mb-20">
          <motion.div
            initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
            whileInView={shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
            animate={!shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
            viewport={shouldAnimateInView ? { once: true } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="scroll-mt-28"
            data-scroll-target="services"
          >
            <p className="theme-kicker mb-3">交付方式</p>
            <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
              商业交付与合作模式
            </h2>
            <div className="theme-card theme-chip-readable inline-flex flex-wrap items-center gap-2 rounded-full border-[rgba(148,163,184,0.16)] px-3 py-2 font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
              <span>需求定义</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>方案验证</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>阶段交付</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>结果复核</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {services.map((service, index) => {
            const Icon = IconMap[service.icon] || Layout;
            return (
              <motion.div
                key={service.id}
                initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
                whileInView={shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
                animate={!shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
                viewport={shouldAnimateInView ? { once: true } : undefined}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="theme-card theme-card-interactive group relative flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-4 transition-all duration-300 hover:border-[rgba(37,99,235,0.22)] sm:p-5 md:rounded-[1.6rem] md:p-6"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-5 sm:pb-4">
                    <div className="theme-icon-box theme-icon-box-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="theme-chip px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-[0.18em]">
                      交付能力
                    </div>
                  </div>

                  <h3 className="theme-card-title mb-2.5 text-[1.05rem] sm:mb-3 sm:text-[1.08rem]">
                    {service.title}
                  </h3>

                  <p className="theme-card-body flex-grow text-[13px] leading-[1.76] sm:text-[14px] sm:leading-[1.84]">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
                    {service.techStack && (
                      <div className="theme-card-section flex flex-wrap gap-1.5 sm:gap-2">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="theme-chip theme-chip-readable px-2 py-1 font-semibold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {service.milestones && service.milestones.length > 0 && (
                      <div className="theme-card-section flex flex-wrap gap-1.5">
                        {service.milestones.map((step) => (
                          <span
                            key={step}
                            className="theme-chip theme-chip-readable px-2 py-1 font-medium"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
