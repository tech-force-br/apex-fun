"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/locale";
import {
  getMockSessionServerSnapshot,
  getMockSessionSnapshot,
  setMockSession,
  subscribeMockSession,
} from "@/lib/mock-auth";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    subscribeMockSession,
    getMockSessionSnapshot,
    getMockSessionServerSnapshot,
  );
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
          if (session.language !== next) {
            setMockSession({ ...session, language: next });
          }
          return;
        }
        setGuestLocale(next);
      },
    }),
    [locale, session],
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
