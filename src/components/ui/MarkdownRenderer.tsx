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
              className="break-all whitespace-normal rounded border border-[color:var(--border-default)] bg-[rgba(var(--surface-muted-rgb),0.82)] px-1 py-0.5 font-mono text-[0.85em] text-[color:var(--text-primary)]"
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
                className="theme-link break-words underline decoration-[rgba(37,99,235,0.32)] underline-offset-2"
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
              className="font-semibold text-[color:var(--text-primary)]"
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
    return (
      <span className={["markdown-inline", className].filter(Boolean).join(" ")}>
        {renderInlineMarkdown(children)}
      </span>
    );
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
        ? "theme-readable-block"
        : "theme-readable-block text-[color:var(--text-tertiary)]";
    const listClass =
      tone === "default"
        ? "theme-readable-block-sm"
        : "theme-readable-block-sm text-[color:var(--text-tertiary)]";
    const quoteClass =
      tone === "default"
        ? "theme-readable-block-sm"
        : "theme-readable-block-sm text-[color:var(--text-tertiary)]";

    const headingClasses: Record<number, string> = {
      1: "theme-title mt-4 text-[1.02rem] font-semibold",
      2: "theme-title mt-3 text-[0.97rem] font-semibold",
      3: "theme-title mt-3 text-[0.92rem] font-semibold",
      4: "theme-title mt-2 text-[0.89rem] font-semibold",
      5: "theme-title mt-2 text-[0.84rem] font-semibold",
      6: "theme-title mt-2 text-[0.84rem] font-semibold",
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
          className="my-1 border-l-2 border-[color:var(--border-default)] pl-3.5"
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
            className={`${listClass} my-1 list-decimal list-outside space-y-1.5 pl-5`}
          >
            {items}
          </ol>,
        );
      } else {
        blocks.push(
          <ul
            key={`ul-${blocks.length}`}
            className={`${listClass} my-1 list-disc list-outside space-y-1.5 pl-5`}
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
          className="my-1 overflow-x-auto rounded-lg border border-[color:var(--border-default)] bg-[rgba(var(--surface-muted-rgb),0.82)] p-3 font-mono text-xs leading-relaxed text-[color:var(--text-primary)]"
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

    return <div className={["markdown-block", className].filter(Boolean).join(" ")}>{blocks}</div>;
  };

  return renderBlockMarkdown(children);
}
