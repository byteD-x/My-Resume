const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
import { getDefaultLocale, type Locale } from "@/lib/locale";

export const RESUME_FILE_NAME =
  "\u675c\u65ed\u5609_AI\u5e94\u7528\u5de5\u7a0b\u5e08_15035925107.pdf";
export const EN_RESUME_FILE_NAME = "du-xujia-ai-application-engineer.pdf";
export const RESUME_FILE_PATH = `/${encodeURIComponent(RESUME_FILE_NAME)}`;
export const EN_RESUME_FILE_PATH = `/${encodeURIComponent(EN_RESUME_FILE_NAME)}`;

export interface ResumeDownloadClickEvent {
  preventDefault: () => void;
}

export function formatResumeFileName(
  title?: string,
  name?: string,
  separator = "-",
  locale: Locale = getDefaultLocale(),
): string {
  void title;
  void name;
  void separator;

  return locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME;
}

export function getResumeDownloadUrl(
  _fileName: string,
  locale: Locale = getDefaultLocale(),
): string {
  void _fileName;

  if (isStaticExport) {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
    const normalizedBasePath = basePath
      ? `/${basePath.replace(/^\/+|\/+$/g, "")}`
      : "";
    return `${normalizedBasePath}${
      locale === "en" ? EN_RESUME_FILE_PATH : RESUME_FILE_PATH
    }`;
  }

  return locale === "en" ? "/api/resume?locale=en" : "/api/resume";
}

export async function triggerResumeDownload(
  fileName: string,
  url: string,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Resume download failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function createResumeDownloadHandler(fileName: string, url: string) {
  if (!isStaticExport || typeof window === "undefined") return undefined;

  return async (event: ResumeDownloadClickEvent) => {
    event.preventDefault();
    try {
      await triggerResumeDownload(fileName, url);
    } catch {
      window.location.href = url;
    }
  };
}
