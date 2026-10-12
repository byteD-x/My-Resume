import { getDefaultLocale, type Locale } from "@/lib/locale";

export const RESUME_FILE_NAME =
  "\u675c\u65ed\u5609_AI\u5e94\u7528\u5de5\u7a0b\u5e08_15035925107.pdf";
export const EN_RESUME_FILE_NAME = "du-xujia-ai-application-engineer.pdf";

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
  return locale === "en" ? "/api/resume?locale=en" : "/api/resume";
}
