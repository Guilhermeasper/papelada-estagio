import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): EffectiveTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    const stored = getStoredTheme();
    return stored === "system" ? getSystemTheme() : stored;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [effectiveTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setEffectiveTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);

    if (newTheme === "system") {
      setEffectiveTheme(getSystemTheme());
    } else {
      setEffectiveTheme(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(effectiveTheme === "light" ? "dark" : "light");
  }, [effectiveTheme, setTheme]);

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    isDark: effectiveTheme === "dark",
  };
}
