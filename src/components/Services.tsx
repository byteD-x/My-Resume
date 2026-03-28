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
            <p className="theme-section-copy mb-6 max-w-2xl">
              围绕实际业务目标提供方案、实现与交付支持，覆盖需求梳理、架构设计、上线准备与结果验证。
            </p>
            <div className="theme-card inline-flex flex-wrap items-center gap-2 rounded-full border-[rgba(148,163,184,0.16)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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
                className="theme-card theme-card-interactive group relative flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-[1.125rem] transition-all duration-300 hover:border-[rgba(37,99,235,0.22)] sm:p-5 md:rounded-[1.6rem] md:p-7"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="theme-icon-box theme-icon-box-sm mb-5 transition-transform duration-300 group-hover:scale-110 sm:mb-6">
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <h3 className="theme-card-title mb-3 text-[1.06rem] sm:mb-3.5 sm:text-[1.08rem]">
                    {service.title}
                  </h3>

                  <p className="theme-card-body mb-6 flex-grow text-[13px] sm:mb-7">
                    {service.description}
                  </p>

                  <div className="mt-auto space-y-4 sm:space-y-5">
                    {service.techStack && (
                      <div className="flex flex-wrap gap-1.5 border-t border-[color:var(--border-default)] pt-4 sm:gap-2 sm:pt-5">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="theme-chip px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] sm:text-[10px] sm:tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {service.milestones && service.milestones.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-[color:var(--border-default)] pt-4 sm:pt-5">
                        {service.milestones.map((step) => (
                          <span
                            key={step}
                            className="theme-chip px-2 py-1 text-[11px] font-medium"
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
