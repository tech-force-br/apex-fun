import type { Locale } from "@/lib/locale";

export type AuthMode = "signin" | "signup";
export type AuthProvider = "password" | "google";
export type MockAuthError =
  | "missing_email"
  | "invalid_email"
  | "missing_password";

export type MockSession = {
  email: string;
  language: Locale;
  provider: AuthProvider;
};

export type MockAuthResult =
  | { ok: true; session: MockSession }
  | { ok: false; error: MockAuthError };

type PasswordInput = {
  provider: "password";
  email: string;
  password: string;
  language: Locale;
};

type GoogleInput = {
  provider: "google";
  language: Locale;
};

export type MockAuthInput = PasswordInput | GoogleInput;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_STORAGE_KEY = "apexfun.mock-session";

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "pt-BR";
}

function isMockSession(value: unknown): value is MockSession {
  if (!value || typeof value !== "object") return false;
  const session = value as MockSession;
  return (
    typeof session.email === "string" &&
    session.email.length > 0 &&
    isLocale(session.language) &&
    (session.provider === "password" || session.provider === "google")
  );
}

export function readStoredSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isMockSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: MockSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

let memorySession: MockSession | null | undefined;
const sessionListeners = new Set<() => void>();

function notifySessionListeners() {
  for (const listener of sessionListeners) listener();
}

export function subscribeMockSession(onStoreChange: () => void) {
  sessionListeners.add(onStoreChange);
  return () => {
    sessionListeners.delete(onStoreChange);
  };
}

export function getMockSessionSnapshot(): MockSession | null {
  if (memorySession === undefined) {
    memorySession = readStoredSession();
  }
  return memorySession;
}

export function getMockSessionServerSnapshot(): MockSession | null {
  return null;
}

export function setMockSession(session: MockSession | null) {
  memorySession = session;
  writeStoredSession(session);
  notifySessionListeners();
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockAuthenticate(
  input: MockAuthInput,
): Promise<MockAuthResult> {
  if (input.provider === "google") {
    await wait(650);
    return {
      ok: true,
      session: {
        email: "google@mock.apexfun",
        language: input.language,
        provider: "google",
      },
    };
  }

  const email = input.email.trim();
  if (!email) {
    return { ok: false, error: "missing_email" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  if (!input.password) {
    return { ok: false, error: "missing_password" };
  }

  await wait(650);
  return {
    ok: true,
    session: {
      email,
      language: input.language,
      provider: "password",
    },
  };
}
