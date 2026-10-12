import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DarkFooter } from "@/components/portfolio/DarkFooter";

describe("DarkFooter locale links", () => {
  const props = {
    email: "hello@example.com",
    github: "https://github.com/byteD-x",
  };

  it("keeps default-locale links unprefixed", () => {
    const html = renderToStaticMarkup(
      <DarkFooter {...props} locale="zh" />,
    );

    expect(html).toContain('href="/about#contact"');
    expect(html).not.toContain('href="/zh/about#contact"');
  });

  it("prefixes links on explicit locale routes", () => {
    const html = renderToStaticMarkup(
      <DarkFooter {...props} locale="en" explicitLocale />,
    );

    expect(html).toContain('href="/en/about#contact"');
  });
});
