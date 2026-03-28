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
      className="border-t section-divider bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(248,250,252,0.96)_52%,rgba(241,245,249,0.98)_100%)]"
    >
      <Container className="py-8 md:py-10">
        <div className="flex flex-col gap-6 md:gap-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-[34rem]">
              <p className="theme-title text-[1.02rem] font-semibold tracking-tight">
                {name}
              </p>
              <p className="theme-copy mt-2 text-[13px] leading-6 sm:text-[14px]">
                作品、履历与公开入口统一收录于此。
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-x-5 gap-y-3 sm:gap-x-6">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-w-0 items-center gap-2 text-[13px] font-medium text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                >
                  <Github size={15} className="shrink-0 opacity-80" />
                  <span className="leading-6">GitHub</span>
                  <span className="theme-copy-subtle hidden text-[12px] leading-5 sm:inline">
                    {formatHost(githubUrl)}
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ) : null}

              {websiteLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-w-0 items-center gap-2 text-[13px] font-medium text-[color:var(--text-primary)] transition-colors hover:text-[color:var(--brand-gold)]"
                >
                  <Globe size={15} className="shrink-0 opacity-80" />
                  <span className="leading-6">{link.label}</span>
                  <span className="theme-copy-subtle hidden text-[12px] leading-5 sm:inline">
                    {formatHost(link.url)}
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[color:var(--border-default)] pt-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="theme-copy-subtle text-[12px] leading-6">
              &copy; {currentYear} {name}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-6 text-[color:var(--text-tertiary)]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="shrink-0 opacity-70" />
                最后更新：{lastUpdated}
              </span>
              <span>Next.js / Tailwind CSS / Framer Motion</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
