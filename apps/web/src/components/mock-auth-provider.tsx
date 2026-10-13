"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/locale";
import {
  getMockSessionServerSnapshot,
  getMockSessionSnapshot,
  setMockSession,
  subscribeMockSession,
  syncSessionCookie,
  type MockSession,
} from "@/lib/mock-auth";

type MockAuthContextValue = {
  ready: boolean;
  session: MockSession | null;
  signIn: (session: MockSession) => void;
  signOut: () => void;
  setLanguage: (language: Locale) => void;
};

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

function subscribeHydrated() {
  return () => {};
}

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    subscribeMockSession,
    getMockSessionSnapshot,
    getMockSessionServerSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeHydrated,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!ready) return;
    syncSessionCookie(session);
  }, [ready, session]);

  const value = useMemo<MockAuthContextValue>(
    () => ({
      ready,
      session,
      signIn(next) {
        setMockSession(next);
      },
      signOut() {
        setMockSession(null);
      },
      setLanguage(language) {
        if (!session || session.language === language) return;
        setMockSession({ ...session, language });
      },
    }),
    [ready, session],
  );

  return (
    <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return context;
}
