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
    <Section className="theme-grid-section relative py-24 md:py-32">
      <Container>
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={shouldAnimateInView ? { opacity: 0, y: 16 } : false}
            whileInView={shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
            animate={!shouldAnimateInView ? { opacity: 1, y: 0 } : undefined}
            viewport={shouldAnimateInView ? { once: true } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="scroll-mt-28"
            data-scroll-target="services"
          >
            <p className="theme-kicker mb-3">
              Delivery Capabilities
            </p>
            <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
              商业交付与合作模式
            </h2>
            <p className="theme-copy mb-6 max-w-2xl text-[15px] leading-relaxed">
              以工程化思维解决复杂业务问题，不仅提供纯代码层面的实现，更涵盖从需求梳理、架构设计到最终可验证落地的端到端交付闭环。
            </p>
            <div className="theme-card inline-flex flex-wrap items-center gap-2 rounded-full border-[rgba(148,163,184,0.16)] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-secondary)]">
              <span>Workflow: Definition</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>PoC</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>Milestones</span>
              <span className="text-[rgba(37,99,235,0.32)]">-&gt;</span>
              <span>Review</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                className="theme-card theme-card-interactive group relative flex h-full flex-col rounded-[1.6rem] border-[rgba(148,163,184,0.16)] p-6 transition-all duration-300 hover:border-[rgba(37,99,235,0.22)] md:p-8"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="theme-icon-box theme-icon-box-sm mb-6 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <h3 className="theme-card-title mb-3.5 text-[1.08rem]">
                    {service.title}
                  </h3>

                  <p className="theme-card-body mb-8 flex-grow text-[13px]">
                    {service.description}
                  </p>

                  <div className="mt-auto space-y-5">
                    {service.techStack && (
                      <div className="flex flex-wrap gap-2 border-t border-[color:var(--border-default)] pt-5">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="theme-chip px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {service.milestones && service.milestones.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-[color:var(--border-default)] pt-5">
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
