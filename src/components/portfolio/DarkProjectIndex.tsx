"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";
import { resolveLocalePath } from "@/lib/locale";
import type { ProjectItem } from "@/types";
import { DarkProjectVisual } from "./DarkProjectVisual";

const featuredIds = new Set(["proj-customer-ai-runtime", "proj-rag-qa-system", "proj-wechat-bot", "proj-cloudpan"]);
const visualById: Record<string, string> = { "proj-customer-ai-runtime": "runtime", "proj-rag-qa-system": "retrieval", "proj-wechat-bot": "memory", "proj-cloudpan": "storage" };

export function DarkProjectIndex({ items, locale, explicitLocale = false }: { items: ProjectItem[]; locale: Locale; explicitLocale?: boolean }) {
  const [activeTag, setActiveTag] = useState("all");
  const [query, setQuery] = useState("");
  const [showMoreTags, setShowMoreTags] = useState(false);
  const tags = useMemo(() => Array.from(new Set(items.flatMap((item) => item.techTags))).slice(0, 6), [items]);
  const allTags = useMemo(() => Array.from(new Set(items.flatMap((item) => item.techTags))), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const parent = item.groupParentId ? items.find((entry) => entry.id === item.groupParentId) : undefined;
    const children = item.childIds?.map((childId) => items.find((entry) => entry.id === childId)).filter(Boolean) ?? [];
    const relatedTags = new Set([...(item.techTags ?? []), ...(parent?.techTags ?? []), ...children.flatMap((child) => child?.techTags ?? [])]);
    const matchesTag = activeTag === "all" || relatedTags.has(activeTag);
    const haystack = `${item.name} ${item.summary} ${item.techTags.join(" ")}`.toLowerCase();
    return matchesTag && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [activeTag, items, query]);
  const hrefFor = (id: string) => explicitLocale ? resolveLocalePath(`/projects/${id}`, locale) : `/projects/${id}`;

  return (
    <div className="dark-index-body">
      <div className="dark-project-tools">
        <div className="dark-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "zh" ? "搜索项目或技术" : "Search projects or tools"} aria-label={locale === "zh" ? "搜索项目或技术" : "Search projects or tools"} /></div>
        <div className="dark-filter-row" role="group" aria-label={locale === "zh" ? "技术筛选" : "Technology filters"}>
          <button type="button" className={activeTag === "all" ? "is-active" : ""} onClick={() => setActiveTag("all")}>{locale === "zh" ? "全部" : "All"}</button>
          {(showMoreTags ? allTags : tags).map((tag) => <button key={tag} type="button" className={activeTag === tag ? "is-active" : ""} onClick={() => setActiveTag(tag)}>{tag}</button>)}
          {allTags.length > tags.length ? <button type="button" className="dark-filter-more" onClick={() => setShowMoreTags((value) => !value)}>{showMoreTags ? (locale === "zh" ? "收起筛选" : "Fewer filters") : (locale === "zh" ? "更多筛选" : "More filters")}</button> : null}
        </div>
      </div>
      <div className="dark-index-grid">
        {filtered.map((item, index) => {
          const isFeatured = featuredIds.has(item.id);
          return (
            <article className={`dark-index-card ${isFeatured ? "is-featured" : ""}`} key={item.id}>
              {isFeatured ? <DarkProjectVisual kind={visualById[item.id] ?? "runtime"} label={item.name} locale={locale} /> : <div className="dark-index-card-line"><span>{String(index + 1).padStart(2, "0")}</span><span>{item.year}</span></div>}
              <div className="dark-index-card-copy"><p className="dark-eyebrow">{item.impact ?? (locale === "zh" ? "工程项目" : "Engineering project")}</p><h2>{item.name}</h2><p>{item.summary}</p><div className="dark-tags">{item.techTags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={hrefFor(item.id)} className="dark-arrow-link">{locale === "zh" ? "查看案例" : "View case"}<ArrowUpRight size={15} /></Link></div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 ? <p className="dark-empty">{locale === "zh" ? "没有匹配的项目。" : "No matching projects."}</p> : null}
    </div>
  );
}
