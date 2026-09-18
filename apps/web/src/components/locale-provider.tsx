"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/locale";
import { useMockAuth } from "@/components/mock-auth-provider";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { session, setLanguage } = useMockAuth();
  const [guestLocale, setGuestLocale] = useState<Locale>("en");
  if (session && session.language !== guestLocale) {
    setGuestLocale(session.language);
  }
  const locale = session?.language ?? guestLocale;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale(next: Locale) {
        if (session) {
          setLanguage(next);
          return;
        }
        setGuestLocale(next);
      },
    }),
    [locale, session, setLanguage],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
