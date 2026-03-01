"use client";

import React, { ReactNode } from "react";

type MarkdownTone = "muted" | "default";

interface MarkdownRendererProps {
  children: string;
  tone?: MarkdownTone;
  className?: string; // Allow passing extra classes for container
  inline?: boolean; // If true, only renders inline elements, no block elements
}

/**
 * A simple Markdown-like renderer that supports:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Inline Code: `text`
 * - Links: [text](url)
 * - Block Code: ```code```
 * - Lists: - item or 1. item
 * - Quotes: > text
 * - Headings: # text
 */
export function MarkdownRenderer({
  children,
  tone = "default",
  className = "",
  inline = false,
}: MarkdownRendererProps) {
  if (!children) return null;

  const renderInlineMarkdown = (input: string) => {
    const nodes: Array<ReactNode> = [];
    let remaining = input;

    const patterns = [
      { type: "code", regex: /`([^`]+)`/ },
      { type: "link", regex: /\[([^\]]+)\]\(([^)]+)\)/ },
      { type: "bold", regex: /\*\*([^*]+)\*\*/ },
      { type: "bold", regex: /__([^_]+)__/ },
      { type: "italic", regex: /\*([^*]+)\*/ },
      { type: "italic", regex: /_([^_]+)_/ },
    ];

    const isSafeUrl = (url: string) => /^(https?:|mailto:)/i.test(url);

    while (remaining.length > 0) {
      let earliest: {
        index: number;
        match: RegExpExecArray;
        type: string;
      } | null = null;

      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining);
        if (!match) continue;
        const index = match.index;
        if (earliest === null || index < earliest.index) {
          earliest = { index, match, type: pattern.type };
        }
      }

      if (!earliest) {
        nodes.push(remaining);
        break;
      }

      if (earliest.index > 0) {
        nodes.push(remaining.slice(0, earliest.index));
      }

      const [full, first, second] = earliest.match;

      switch (earliest.type) {
        case "code":
          nodes.push(
            <code
              key={`code-${nodes.length}`}
              className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[0.85em] border border-zinc-200 dark:border-zinc-700"
            >
              {first}
            </code>,
          );
          break;
        case "link":
          if (second && isSafeUrl(second)) {
            nodes.push(
              <a
                key={`link-${nodes.length}`}
                href={second}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline decoration-blue-300 underline-offset-2"
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                {first}
              </a>,
            );
          } else {
            nodes.push(`${first} (${second})`);
          }
          break;
        case "bold":
          nodes.push(
            <strong
              key={`bold-${nodes.length}`}
              className="font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {first}
            </strong>,
          );
          break;
        case "italic":
          nodes.push(
            <em key={`italic-${nodes.length}`} className="italic">
              {first}
            </em>,
          );
          break;
        default:
          nodes.push(full);
          break;
      }

      remaining = remaining.slice(earliest.index + full.length);
    }

    return nodes;
  };

  if (inline) {
    return <span className={className}>{renderInlineMarkdown(children)}</span>;
  }

  const renderBlockMarkdown = (text: string) => {
    const lines = text.split("\n");
    const blocks: Array<ReactNode> = [];
    let paragraphLines: string[] = [];
    let listType: "ol" | "ul" | null = null;
    let listItems: string[] = [];
    let quoteLines: string[] = [];
    let inCode = false;
    let codeLines: string[] = [];

    const paragraphClass =
      tone === "default"
        ? "text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
        : "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed";
    const listClass =
      tone === "default"
        ? "text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
        : "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed";
    const quoteClass =
      tone === "default"
        ? "text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
        : "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed";

    const headingClasses: Record<number, string> = {
      1: "text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2",
      2: "text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-2",
      3: "text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1",
      4: "text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1",
      5: "text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1",
      6: "text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1",
    };

    const flushParagraph = () => {
      if (paragraphLines.length === 0) return;
      const textContent = paragraphLines.join(" ");
      blocks.push(
        <p key={`p-${blocks.length}`} className={paragraphClass}>
          {renderInlineMarkdown(textContent)}
        </p>,
      );
      paragraphLines = [];
    };

    const flushQuote = () => {
      if (quoteLines.length === 0) return;
      const textContent = quoteLines.join(" ");
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-3 my-2"
        >
          <p className={quoteClass}>{renderInlineMarkdown(textContent)}</p>
        </blockquote>,
      );
      quoteLines = [];
    };

    const flushList = () => {
      if (!listType || listItems.length === 0) return;
      const items = listItems.map((itemText, idx) => (
        <li key={idx} className="pl-1">
          {renderInlineMarkdown(itemText)}
        </li>
      ));
      if (listType === "ol") {
        blocks.push(
          <ol
            key={`ol-${blocks.length}`}
            className={`${listClass} list-decimal list-outside pl-5 space-y-1 my-2`}
          >
            {items}
          </ol>,
        );
      } else {
        blocks.push(
          <ul
            key={`ul-${blocks.length}`}
            className={`${listClass} list-disc list-outside pl-5 space-y-1 my-2`}
          >
            {items}
          </ul>,
        );
      }
      listType = null;
      listItems = [];
    };

    const flushCode = () => {
      if (!inCode) return;
      const codeContent = codeLines.join("\n");
      blocks.push(
        <pre
          key={`code-${blocks.length}`}
          className="text-xs leading-relaxed font-mono bg-zinc-900/5 dark:bg-zinc-100/5 text-zinc-800 dark:text-zinc-100 rounded-lg p-3 overflow-x-auto my-2 border border-zinc-200/50 dark:border-zinc-700/50"
        >
          <code>{codeContent}</code>
        </pre>,
      );
      codeLines = [];
      inCode = false;
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        flushParagraph();
        flushList();
        flushQuote();
        if (inCode) {
          flushCode();
        } else {
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeLines.push(rawLine);
        return;
      }

      if (!trimmed) {
        flushParagraph();
        flushList();
        flushQuote();
        return;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        flushQuote();
        const level = headingMatch[1].length;
        const content = headingMatch[2];
        const type = headingClasses[level] || headingClasses[3];
        blocks.push(
          <div key={`h-${blocks.length}`} className={type}>
            {renderInlineMarkdown(content)}
          </div>,
        );
        return;
      }

      const quoteMatch = trimmed.match(/^>\s*(.+)$/);
      if (quoteMatch) {
        flushParagraph();
        flushList();
        quoteLines.push(quoteMatch[1]);
        return;
      }

      const orderedMatch = trimmed.match(/^\d+(?:[.)]|\u3001|\uFF09)\s*(.+)$/);
      if (orderedMatch) {
        flushParagraph();
        flushQuote();
        if (listType !== "ol") {
          flushList();
          listType = "ol";
        }
        listItems.push(orderedMatch[1]);
        return;
      }

      const unorderedMatch = trimmed.match(/^[-*\u2022]\s*(.+)$/);
      if (unorderedMatch) {
        flushParagraph();
        flushQuote();
        if (listType !== "ul") {
          flushList();
          listType = "ul";
        }
        listItems.push(unorderedMatch[1]);
        return;
      }

      flushList();
      flushQuote();
      paragraphLines.push(trimmed);
    });

    flushParagraph();
    flushList();
    flushQuote();
    flushCode();

    return <div className={`space-y-2 ${className}`}>{blocks}</div>;
  };

  return renderBlockMarkdown(children);
}
