import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locale";

interface DeploymentLocaleOptions {
  configuredLocale?: string | null;
  vercelFlag?: string | null;
}

export function getDeploymentDefaultLocale(
  options: DeploymentLocaleOptions = {},
): Locale {
  const configuredLocale =
    options.configuredLocale ?? process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? null;

  if (isLocale(configuredLocale)) {
    return configuredLocale;
  }

  const vercelFlag = options.vercelFlag ?? process.env.VERCEL ?? null;
  if (vercelFlag === "1" || vercelFlag === "true") {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function shouldUseExplicitRootLocale(
  locale: Locale = getDeploymentDefaultLocale(),
): boolean {
  return locale !== DEFAULT_LOCALE;
}

export function getRootLocaleEntryPath(
  locale: Locale = getDeploymentDefaultLocale(),
): string {
  return shouldUseExplicitRootLocale(locale) ? `/${locale}` : "/";
}
