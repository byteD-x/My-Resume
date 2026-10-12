import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";

describe("deployment locale metadata routes", () => {
  const originalLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  const originalVercel = process.env.VERCEL;

  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_DEFAULT_LOCALE = "en";
    delete process.env.VERCEL;
  });

  afterEach(() => {
    vi.resetModules();
    if (originalLocale === undefined) {
      delete process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
    } else {
      process.env.NEXT_PUBLIC_DEFAULT_LOCALE = originalLocale;
    }
    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }
  });

  it("uses the explicit English root in the sitemap when English is the deployment locale", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${siteConfig.siteUrl}/en`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/`);
    expect(urls).toContain(`${siteConfig.siteUrl}/projects`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/projects`);
  });

  it("uses the deployment locale for the PWA entry metadata", async () => {
    const { default: manifest } = await import("@/app/manifest");
    const result = manifest();

    expect(result.start_url).toBe("/en");
    expect(result.lang).toBe("en");
    expect(result.description).toContain("Xujia Du");
  });
});
