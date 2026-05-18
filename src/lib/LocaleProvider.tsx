"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  getDefaultLocale,
  getHtmlLang,
  getPathLocale,
  hasLocalePrefix,
  resolveLocalePath,
  resolveLocalizedHref,
  type Locale,
} from "@/lib/locale";
import { getUiCopy, type UiCopy } from "@/lib/locale-copy";

interface LocaleContextValue {
  locale: Locale;
  defaultLocale: Locale;
  explicitLocale: boolean;
  copy: UiCopy;
  localizedHref: (href: string) => string;
  switchLocaleHref: (targetLocale: Locale) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({
  children,
  defaultLocale = getDefaultLocale(),
}: LocaleProviderProps) {
  const pathname = usePathname() || "/";
  const pathLocale = getPathLocale(pathname);
  const locale = pathLocale ?? defaultLocale;
  const explicitLocale = hasLocalePrefix(pathname);

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      defaultLocale,
      explicitLocale,
      copy: getUiCopy(locale),
      localizedHref: (href: string) =>
        resolveLocalizedHref(href, locale, explicitLocale),
      switchLocaleHref: (targetLocale: Locale) => {
        const search =
          typeof window === "undefined" ? "" : window.location.search;
        const hash =
          typeof window === "undefined" ? "" : window.location.hash;
        return resolveLocalePath(
          pathname,
          targetLocale,
          search,
          hash,
        );
      },
    }),
    [defaultLocale, explicitLocale, locale, pathname],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }
  return value;
}

export function useUiCopy() {
  return useLocale().copy;
}
