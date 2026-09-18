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
  mode: AuthMode;
  provider: "password";
  email: string;
  password: string;
  language: Locale;
};

type GoogleInput = {
  mode: AuthMode;
  provider: "google";
  language: Locale;
};

export type MockAuthInput = PasswordInput | GoogleInput;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockAuthenticate(
  input: MockAuthInput,
): Promise<MockAuthResult> {
  await wait(650);

  if (input.provider === "google") {
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

  return {
    ok: true,
    session: {
      email,
      language: input.language,
      provider: "password",
    },
  };
}
