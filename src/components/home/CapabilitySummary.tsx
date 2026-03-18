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
      "把模型接入做成能恢复、能评测、能接业务的运行时，而不是只停留在问答 Demo。",
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
      "关注的不只是跑起来，而是基线、优化、回归和交付质量能否被证明。",
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
  orchestration: "Runtime Layer",
  delivery: "Delivery Layer",
  performance: "Quality Layer",
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
    <Section className="theme-grid-section relative scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="mb-16 max-w-3xl">
          <p className="theme-kicker mb-3 text-[11px]">
            Core Competencies
          </p>
          <h2 className="theme-title mb-5 text-3xl font-bold md:text-4xl">
            核心工程能力
          </h2>
          <p className="theme-copy text-[15px] leading-relaxed">
            我更关注系统是否稳定、是否可验证、是否能支撑真实业务，而不是只展示技术名词。这些能力决定了项目能否真正上线并长期维护。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:[grid-auto-rows:1fr]">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="theme-card theme-card-interactive group flex h-full flex-col rounded-[1.6rem] border-[rgba(148,163,184,0.16)] p-6 transition-colors hover:border-[rgba(37,99,235,0.22)] md:p-8"
              >
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] pb-5">
                  <div className="theme-icon-box theme-icon-box-md transition-transform group-hover:scale-105">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="theme-chip px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                    {capabilityLayerLabelMap[card.id] ?? card.id}
                  </div>
                </div>

                <h3 className="theme-card-title text-[1.28rem]">
                  {card.title}
                </h3>

                <p className="theme-card-body mt-4 text-[14px]">
                  {card.summary}
                </p>

                {card.bullet ? (
                  <div className="theme-card-muted mt-7 rounded-[1.3rem] border-[rgba(148,163,184,0.14)] p-5">
                    <p className="theme-card-kicker mb-2">
                      Evidence Snapshot / 证据切片
                    </p>
                    <p className="theme-title text-[13px] font-semibold">
                      {card.bullet.title}
                    </p>
                    <p className="theme-copy mt-2.5 text-[13px] leading-7">
                      {capabilityBulletSummaryMap[card.bullet.id] ?? card.bullet.description}
                    </p>
                  </div>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="theme-chip px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {card.service ? (
                  <div className="mt-auto pt-7">
                    <p className="theme-copy border-t border-[color:var(--border-default)] pt-5 text-[13px] leading-7">
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
