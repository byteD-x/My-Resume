import { ArrowUpRight, Calendar, Github, Globe } from "lucide-react";
import { Container } from "./ui/Container";

interface FooterProps {
  name: string;
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
  githubUrl,
  websiteLinks = [],
}: FooterProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastUpdated = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  return (
    <footer
      data-print="hide"
      className="theme-grid-section border-t section-divider bg-[linear-gradient(180deg,rgba(248,250,252,0.66)_0%,rgba(255,255,255,0.96)_18%,rgba(241,245,249,0.94)_100%)]"
    >
      <Container className="py-10 md:py-14">
        <div className="rounded-[1.55rem] border border-[rgba(148,163,184,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] md:rounded-[1.8rem] md:p-7 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] lg:gap-10">
            <div className="min-w-0">
              <p className="theme-kicker mb-3">页尾索引</p>
              <h3 className="theme-title text-[1.55rem] font-bold tracking-tight md:text-[1.8rem]">
                {name}
              </h3>
              <p className="theme-copy mt-3 max-w-[36rem] text-[15px] leading-7">
                收录源码入口、站点链接与更新时间。
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="theme-chip px-2.5 py-1 text-[11px] font-semibold">
                  公开仓库
                </span>
                <span className="theme-chip px-2.5 py-1 text-[11px] font-semibold">
                  多站点入口
                </span>
                <span className="theme-chip px-2.5 py-1 text-[11px] font-semibold">
                  最近维护
                </span>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.78)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-secondary)]">
                <Calendar size={14} className="shrink-0 opacity-70" />
                <span>最后更新：{lastUpdated}</span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <section className="border-t border-[color:var(--border-default)] pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                <p className="theme-card-kicker mb-3">源码与归档</p>
                <div className="space-y-3">
                  {githubUrl ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-w-0 items-start gap-2 text-[14px] font-semibold text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                    >
                      <Github size={16} className="mt-0.5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block leading-6">GitHub 仓库主页</span>
                        <span className="theme-copy-subtle block text-[12px] leading-5">
                          {formatHost(githubUrl)}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    <p className="theme-copy text-[14px] leading-6">
                      暂无可展示的源码入口。
                    </p>
                  )}
                </div>
              </section>

              <section className="border-t border-[color:var(--border-default)] pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                <p className="theme-card-kicker mb-3">在线站点</p>
                <div className="space-y-3">
                  {websiteLinks.length > 0 ? (
                    websiteLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-w-0 items-start gap-2 text-[14px] font-semibold text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                      >
                        <Globe size={16} className="mt-0.5 shrink-0" />
                        <span className="min-w-0">
                          <span className="block break-words leading-6">
                            {link.label}
                          </span>
                          <span className="theme-copy-subtle block text-[12px] leading-5">
                            {formatHost(link.url)}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ))
                  ) : (
                    <p className="theme-copy text-[14px] leading-6">
                      暂无可展示的站点入口。
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[color:var(--border-default)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="theme-copy-subtle text-[12px] leading-6">
              &copy; {currentYear} {name}
            </p>
            <p className="theme-copy-subtle text-[12px] leading-6 sm:text-right">
              基于 Next.js、Tailwind CSS 与 Framer Motion 构建
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
