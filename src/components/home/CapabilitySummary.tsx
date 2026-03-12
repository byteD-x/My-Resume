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
    <Section className="relative scroll-mt-24 py-24 md:py-32 bg-zinc-50 dark:bg-zinc-950">
      <Container>
        <div className="mb-16 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3">
            Core Competencies
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl mb-5">
            核心工程能力
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            不盲从技术热词，而是聚焦于构建稳定、可扩展、具有实际业务价值的系统架构。这是我能够持续、高质量交付的专业基石。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="group flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-transform group-hover:scale-105">
                  <Icon size={20} strokeWidth={2} />
                </div>
                
                <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {card.title}
                </h3>
                
                <p className="mt-3 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {card.summary}
                </p>

                {card.bullet ? (
                  <div className="mt-6 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 p-4">
                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                      {card.bullet.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {card.bullet.description}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {card.service ? (
                  <div className="mt-auto pt-6">
                    <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">交付方式：</span>
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
