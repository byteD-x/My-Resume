export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDefaultLocale(
  value = process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
): Locale {
  return normalizeLocale(value);
}

export function getHtmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "zh-CN";
}

export function getOpenGraphLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "zh_CN";
}

export function getBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
  if (!raw) return "";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

export function stripBasePath(pathname: string): string {
  const basePath = getBasePath();
  if (!basePath) return pathname || "/";
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname || "/";
}

export function getPathLocale(pathname: string): Locale | null {
  const normalizedPath = stripBasePath(pathname);
  const firstSegment = normalizedPath.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : null;
}

export function stripLocalePrefix(pathname: string): string {
  const normalizedPath = stripBasePath(pathname);
  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return normalizedPath || "/";
}

export function hasLocalePrefix(pathname: string): boolean {
  return getPathLocale(pathname) !== null;
}

export function addLocalePrefix(pathname: string, locale: Locale): string {
  const withoutLocale = stripLocalePrefix(pathname);
  return withoutLocale === "/" ? `/${locale}` : `/${locale}${withoutLocale}`;
}

export function resolveLocalePath(
  pathname: string,
  targetLocale: Locale,
  search = "",
  hash = "",
): string {
  const localizedPath = addLocalePrefix(pathname, targetLocale);
  return `${localizedPath}${search}${hash}`;
}

export function resolveLocalizedHref(
  href: string,
  locale: Locale,
  explicitLocale: boolean,
): string {
  if (!href.startsWith("/")) return href;
  if (!explicitLocale) return href;
  return addLocalePrefix(href, locale);
}
