import { Github, Heart, Calendar, Globe } from "lucide-react";
import { Container } from "./ui/Container";

interface FooterProps {
  name: string;
  githubUrl?: string;
  websiteLinks?: { label: string; url: string }[];
}

export default function Footer({ name, githubUrl, websiteLinks = [] }: FooterProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const lastUpdated = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  return (
    <footer
      data-print="hide"
      className="theme-grid-section border-t section-divider bg-[rgba(255,255,255,0.82)]"
    >
      <Container className="py-10 md:py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-6">
          {/* Brand */}
          <div className="text-left">
            <h3 className="theme-title mb-1.5 text-lg font-bold tracking-tight">
              {name}
            </h3>
            <p className="theme-copy flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.12em] sm:tracking-widest">
              Engineer · Innovate · Deliver
              <Heart size={12} className="ml-1 text-[color:var(--brand-gold)]" />
            </p>
          </div>

          {/* Last updated */}
          <div className="theme-copy flex items-center gap-2 text-[13px] font-medium">
            <Calendar size={14} className="opacity-70" />
            <span>最后更新：{lastUpdated}</span>
          </div>

          {/* Links & Copyright */}
          <div className="flex flex-col items-start gap-3.5 sm:flex-row sm:items-center sm:gap-6">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-link flex items-center gap-2 text-[14px] font-semibold transition-colors"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            )}

            {websiteLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-link flex items-center gap-2 text-[14px] font-semibold transition-colors"
              >
                <Globe size={16} />
                <span>{link.label}</span>
              </a>
            ))}

            <div className="hidden h-4 w-[1px] bg-[color:var(--border-default)] sm:block" />

            <p className="theme-copy text-[13px]">
              &copy; {currentYear} {name}
            </p>
          </div>
        </div>

        {/* Tech stack badge */}
        <div className="mt-8 border-t border-[color:var(--border-default)] pt-5 text-left md:mt-10 md:pt-6 md:text-center">
          <p className="theme-copy-subtle text-[11px] font-semibold uppercase tracking-[0.12em] sm:tracking-widest">
            Built with Next.js · Tailwind CSS · Framer Motion
          </p>
        </div>
      </Container>
    </footer>
  );
}
