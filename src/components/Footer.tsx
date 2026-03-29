import {
  ArrowUpRight,
  Calendar,
  Github,
  Globe,
  Mail,
} from "lucide-react";
import { Container } from "./ui/Container";

interface FooterProps {
  name: string;
  title?: string;
  availability?: string;
  email?: string;
  githubUrl?: string;
  websiteLinks?: { label: string; url: string }[];
}

function formatHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export default function Footer({
  name,
  title,
  availability,
  email,
  githubUrl,
  websiteLinks = [],
}: FooterProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastUpdated = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });
  const footerTitle = title?.replace(/（[^）]+）/g, "").trim();
  const quickLinks = [
    { label: "价值亮点", href: "#impact", hint: "关键结果与验证口径" },
    { label: "项目案例", href: "#projects", hint: "代表作品与交付结构" },
    { label: "履历时间线", href: "#experience", hint: "阶段实践与技术演进" },
    { label: "联系入口", href: "#contact", hint: "合作方式与公开渠道" },
  ];
  const publicLinks = [
    ...(githubUrl
      ? [
          {
            label: "GitHub",
            url: githubUrl,
            icon: Github,
          },
        ]
      : []),
    ...websiteLinks.map((link) => ({
      ...link,
      icon: Globe,
    })),
  ];

  return (
    <footer
      data-print="hide"
      className="border-t section-divider bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,250,252,0.96)_38%,rgba(239,244,252,0.98)_100%)]"
    >
      <Container className="relative py-10 md:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(191,219,254,0.18),transparent)]" />
        <div className="pointer-events-none absolute right-[5%] top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(186,230,253,0.18),transparent_72%)] blur-3xl" />

        <div className="relative z-10 grid gap-10 border-b border-[rgba(148,163,184,0.14)] pb-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,1fr)] lg:gap-12">
          <div className="min-w-0 lg:flex lg:min-h-full lg:flex-col lg:justify-between">
            <div className="max-w-[34rem]">
              <div className="mb-5 h-px w-14 bg-[linear-gradient(90deg,rgba(37,99,235,0.3),rgba(148,163,184,0.06))]" />
              <p className="theme-title text-[1.7rem] font-semibold tracking-tight sm:text-[2.1rem]">
                {name}
              </p>
              {footerTitle ? (
                <p className="mt-2 text-[15px] font-medium leading-7 text-[color:var(--text-secondary)] sm:text-[17px]">
                  {footerTitle}
                </p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 border-t border-[rgba(148,163,184,0.14)] pt-4 sm:grid-cols-2 lg:mt-10">
              {email ? (
                <div className="min-w-0">
                  <p className="theme-copy-subtle text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="group mt-2 inline-flex min-w-0 items-center gap-2 text-[14px] font-medium text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                  >
                    <Mail size={15} className="shrink-0 opacity-75" />
                    <span className="truncate">{email}</span>
                  </a>
                </div>
              ) : null}
              {availability ? (
                <div className="min-w-0">
                  <p className="theme-copy-subtle text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Availability
                  </p>
                  <p className="mt-2 text-[14px] leading-7 text-[color:var(--text-secondary)]">
                    {availability}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <section>
              <p className="theme-kicker mb-3">站内跳转</p>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-[color:var(--text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--brand-gold)]"
                      />
                    </a>
                    <p className="mt-1 text-[12px] leading-5 text-[color:var(--text-tertiary)]">
                      {link.hint}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="theme-kicker mb-3">公开入口</p>
              <ul className="space-y-3">
                {publicLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                      >
                        <Icon
                          size={15}
                          className="shrink-0 text-[color:var(--text-tertiary)]"
                        />
                        <span>{link.label}</span>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-[color:var(--text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--brand-gold)]"
                        />
                      </a>
                      <p className="mt-1 text-[12px] leading-5 text-[color:var(--text-tertiary)]">
                        {formatHost(link.url)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2.5 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="theme-copy-subtle text-[12px] leading-6">
            &copy; {currentYear} {name} · 工程化作品集与公开履历
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-6 text-[color:var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} className="shrink-0 opacity-70" />
              最后更新：{lastUpdated}
            </span>
            <span>Built with Next.js / Tailwind CSS / Framer Motion</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
