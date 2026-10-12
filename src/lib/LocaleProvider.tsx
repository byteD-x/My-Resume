"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
  }, [locale]);

  useEffect(() => {
    const syncLocationSuffix = () => {
      setCurrentSearch(window.location.search);
      setCurrentHash(window.location.hash);
    };

    syncLocationSuffix();
    window.addEventListener("hashchange", syncLocationSuffix);
    return () => window.removeEventListener("hashchange", syncLocationSuffix);
  }, [pathname]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      defaultLocale,
      explicitLocale,
      copy: getUiCopy(locale),
      localizedHref: (href: string) =>
        resolveLocalizedHref(href, locale, explicitLocale),
      switchLocaleHref: (targetLocale: Locale) => {
        return resolveLocalePath(pathname, targetLocale, currentSearch, currentHash);
      },
    }),
    [currentHash, currentSearch, defaultLocale, explicitLocale, locale, pathname],
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
