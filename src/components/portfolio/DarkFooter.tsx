import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { resolveLocalePath } from "@/lib/locale";
import { siteConfig } from "@/config/site";

export function DarkFooter({ locale, email, github, explicitLocale = false }: { locale: Locale; email: string; github: string; explicitLocale?: boolean }) {
  const prefix = (path: string) => explicitLocale ? resolveLocalePath(path, locale) : path;
  const displayName = locale === "en" ? "Xujia Du" : "杜旭嘉";
  return (
    <footer className="dark-footer">
      <div><p className="dark-eyebrow">{locale === "zh" ? "开放合作" : "OPEN TO COLLABORATION"}</p><h2>{locale === "zh" ? "把下一件复杂的事，做得清楚一点。" : "Make the next complex thing clearer."}</h2></div>
      <div className="dark-footer-links"><a href={`mailto:${email}`}>{email} <ArrowUpRight size={14} /></a><a href={github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a><Link href={prefix("/about#contact")}>{locale === "zh" ? "联系入口" : "Contact"} <ArrowUpRight size={14} /></Link></div>
      <div className="dark-footer-note">
        <span>© {new Date().getFullYear()} {displayName} · AI Agent / FDE</span>
        <a href={siteConfig.icpRecordUrl} target="_blank" rel="noopener noreferrer">
          <Globe size={13} />
          {siteConfig.icpRecord}
        </a>
      </div>
    </footer>
  );
}
