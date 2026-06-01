"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: <
    S extends keyof typeof translations,
    K extends keyof (typeof translations)[S]
  >(section: S, key: K) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  // Sync document attributes + localStorage whenever lang changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    <
      S extends keyof typeof translations,
      K extends keyof (typeof translations)[S]
    >(section: S, key: K): string => {
      const entry = translations[section][key] as { ar: string; en: string };
      return entry[lang];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
