import { describe, expect, it } from "vitest";
import {
  addLocalePrefix,
  getDefaultLocale,
  normalizeLocale,
  resolveLocalePath,
} from "@/lib/locale";
import {
  EN_RESUME_FILE_NAME,
  RESUME_FILE_NAME,
  formatResumeFileName,
  getResumeDownloadUrl,
} from "@/lib/resume";

describe("locale helpers", () => {
  it("falls back to zh when locale is invalid", () => {
    expect(normalizeLocale("jp")).toBe("zh");
    expect(normalizeLocale(undefined)).toBe("zh");
  });

  it("builds locale-prefixed paths", () => {
    expect(resolveLocalePath("/", "en")).toBe("/en");
    expect(resolveLocalePath("/experiences/demo", "zh")).toBe(
      "/zh/experiences/demo",
    );
    expect(addLocalePrefix("/projects", "en")).toBe("/en/projects");
  });

  it("reads build-time default locale with zh fallback", () => {
    expect(getDefaultLocale("en")).toBe("en");
    expect(getDefaultLocale("oops")).toBe("zh");
  });
});

describe("resume locale selection", () => {
  it("returns locale-specific resume filenames", () => {
    expect(formatResumeFileName(undefined, undefined, "-", "zh")).toBe(
      RESUME_FILE_NAME,
    );
    expect(formatResumeFileName(undefined, undefined, "-", "en")).toBe(
      EN_RESUME_FILE_NAME,
    );
  });

  it("returns locale-specific API download URLs", () => {
    expect(getResumeDownloadUrl(RESUME_FILE_NAME, "zh")).toBe("/api/resume");
    expect(getResumeDownloadUrl(EN_RESUME_FILE_NAME, "en")).toBe(
      "/api/resume?locale=en",
    );
  });
});
