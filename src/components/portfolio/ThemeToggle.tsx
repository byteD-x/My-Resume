"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== STORAGE_KEY) return;
    onChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener("portfolio-theme-change", handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("portfolio-theme-change", handleChange);
  };
}

export function ThemeToggle({ locale }: { locale: "zh" | "en" }) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event("portfolio-theme-change"));
  };

  const label =
    theme === "dark"
      ? locale === "zh"
        ? "切换到浅色模式"
        : "Switch to light mode"
      : locale === "zh"
        ? "切换到深色模式"
        : "Switch to dark mode";

  return (
    <button
      type="button"
      className="reboot-icon-button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
