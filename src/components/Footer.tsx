"use client";

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
      className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Container className="py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-6">
          {/* Brand */}
          <div className="text-left">
            <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1.5">
              {name}
            </h3>
            <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 uppercase tracking-widest">
              Engineer · Innovate · Deliver
              <Heart size={12} className="text-zinc-400 dark:text-zinc-500 ml-1" />
            </p>
          </div>

          {/* Last updated */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
            <Calendar size={14} className="opacity-70" />
            <span>最后更新：{lastUpdated}</span>
          </div>

          {/* Links & Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
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
                className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                <Globe size={16} />
                <span>{link.label}</span>
              </a>
            ))}

            <div className="hidden sm:block w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800" />

            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
              &copy; {currentYear} {name}
            </p>
          </div>
        </div>

        {/* Tech stack badge */}
        <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-left md:text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            Built with Next.js · Tailwind CSS · Framer Motion
          </p>
        </div>
      </Container>
    </footer>
  );
}
