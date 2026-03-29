import { BrainCircuit, Gauge, Workflow } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroBullet, ServiceItem, SkillCategory } from "@/types";

interface CapabilitySummaryProps {
  bullets: HeroBullet[];
  skills: SkillCategory[];
  services: ServiceItem[];
}

const capabilityMeta = [
  {
    id: "orchestration",
    icon: BrainCircuit,
    title: "AI 运行时与检索增强",
    summary:
      "覆盖模型接入、检索增强与流程编排能力。",
  },
  {
    id: "delivery",
    icon: Workflow,
    title: "业务接入与全栈交付",
    summary:
      "覆盖文本、语音、RTC 和宿主系统接入，重点是把链路做稳、做清楚、做成可上线方案。",
  },
  {
    id: "performance",
    icon: Gauge,
    title: "性能、成本与质量门禁",
    summary:
      "覆盖基线、优化、回归与交付质量控制。",
  },
];

const capabilityBulletSummaryMap: Record<string, string> = {
  "bullet-1":
    "LangGraph 驱动的混合检索运行时，覆盖 citations、grounding_score、interrupt-resume 与 step_events。",
  "bullet-2":
    "支持文本、语音与 RTC 多通道接入，并衔接 Auth Bridge、业务工具、转人工与租户扩展。",
  "bullet-3":
    "围绕性能、成本与交付质量治理，落地过 5x 提速、40% 成本下降与完整回归门禁。",
};

const capabilityLayerLabelMap: Record<string, string> = {
  orchestration: "运行时层",
  delivery: "交付层",
  performance: "质量层",
};

export function CapabilitySummary({
  bullets,
  skills,
  services,
}: CapabilitySummaryProps) {
  const primarySkills = skills[0]?.items ?? [];
  const proficientSkills = skills[1]?.items ?? [];

  const cards = capabilityMeta.map((meta, index) => ({
    ...meta,
    bullet: bullets[index],
    service: services[index],
    tags:
      index === 0
        ? primarySkills.slice(0, 3)
        : index === 1
          ? primarySkills.slice(3, 6)
          : proficientSkills.slice(0, 3),
  }));

  return (
    <Section className="theme-grid-section theme-section-dense relative scroll-mt-24 !py-8 sm:!py-10 lg:!py-12">
      <Container>
        <div className="theme-section-header !mb-5 sm:!mb-6 lg:!mb-7">
          <p className="theme-kicker mb-2 text-[11px]">能力概览</p>
          <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
            核心工程能力
          </h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 lg:[grid-auto-rows:1fr] lg:gap-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="theme-card theme-card-interactive group flex h-full flex-col rounded-2xl border-[rgba(148,163,184,0.16)] p-4 transition-colors hover:border-[rgba(37,99,235,0.22)] sm:p-4 md:rounded-[1.5rem] md:p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-3 border-b border-[color:var(--border-default)] pb-3.5 sm:mb-4 sm:gap-3.5 sm:pb-4">
                  <div className="theme-icon-box theme-icon-box-md transition-transform group-hover:scale-105">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="theme-chip px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] md:px-3 md:text-[10px] md:tracking-[0.18em]">
                    {capabilityLayerLabelMap[card.id] ?? card.id}
                  </div>
                </div>

                <h3 className="theme-card-title text-[1.2rem] sm:text-[1.24rem]">
                  {card.title}
                </h3>

                <p className="theme-card-body mt-2.5 text-[14px] leading-[1.8]">
                  {card.summary}
                </p>

                {card.bullet ? (
                  <div className="theme-card-muted mt-3.5 rounded-[1.1rem] border-[rgba(148,163,184,0.14)] p-3.5 sm:mt-4 sm:rounded-[1.2rem] sm:p-4">
                    <p className="theme-card-kicker mb-2">
                      证据切片
                    </p>
                    <p className="theme-title text-[13px] font-semibold leading-6">
                      {card.bullet.title}
                    </p>
                    <p className="theme-copy mt-1.5 text-[13px] leading-[1.76]">
                      {capabilityBulletSummaryMap[card.bullet.id] ?? card.bullet.description}
                    </p>
                  </div>
                ) : null}

                <div className="mt-3.5 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="theme-chip theme-chip-readable px-2.5 py-1 font-semibold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {card.service ? (
                  <div className="mt-auto pt-3.5 sm:pt-4">
                    <p className="theme-copy theme-card-section text-[13px] leading-[1.76]">
                      <span className="font-semibold text-[color:var(--text-primary)]">交付方式：</span>
                      {card.service.title}，{card.service.description}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
