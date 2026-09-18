"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authCopy } from "@/lib/auth-copy";
import {
  mockAuthenticate,
  type AuthMode,
  type MockAuthError,
} from "@/lib/mock-auth";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-space px-3 py-2.5 text-ink outline-none placeholder:text-muted/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/25";

export function AuthCard() {
  const router = useRouter();
  const { locale } = useLocale();
  const { signIn } = useMockAuth();
  const copy = authCopy[locale];
  const emailId = useId();
  const passwordId = useId();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<MockAuthError | null>(null);

  async function runAuth(
    input: { provider: "password" } | { provider: "google" },
  ) {
    setPending(true);
    setError(null);
    const result = await mockAuthenticate(
      input.provider === "google"
        ? { mode, provider: "google", language: locale }
        : {
            mode,
            provider: "password",
            email,
            password,
            language: locale,
          },
    );
    if (!result.ok) {
      setPending(false);
      setError(result.error);
      return;
    }
    signIn(result.session);
    router.replace("/study");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runAuth({ provider: "password" });
  }

  return (
    <section
      aria-busy={pending}
      className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-space-card/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm"
    >
      <div className="flex justify-end">
        <LanguageToggle />
      </div>

      <p className="mt-5 text-sm font-medium tracking-[0.22em] text-accent uppercase">
        {copy.wordmark}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
        {mode === "signin" ? copy.signIn : copy.signUp}
      </h1>
      <p className="mt-2 text-muted">{copy.tagline}</p>
      {mode === "signup" ? (
        <p className="mt-2 text-sm text-muted">{copy.languageHelp}</p>
      ) : null}

      <div
        className="mt-6 grid grid-cols-2 rounded-lg border border-white/10 bg-space p-1"
        role="tablist"
        aria-label={copy.accountTabs}
      >
        {(["signup", "signin"] as const).map((tab) => {
          const active = mode === tab;
          const label = tab === "signup" ? copy.signUp : copy.signIn;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(tab);
                setError(null);
              }}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-space-card text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm text-muted" htmlFor={emailId}>
          {copy.email}
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.emailPlaceholder}
            className={fieldClassName}
          />
        </label>
        <label className="block text-sm text-muted" htmlFor={passwordId}>
          {copy.password}
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClassName}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {copy.errors[error]}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer rounded-lg bg-accent px-3 py-2.5 font-medium text-space disabled:opacity-60"
        >
          {mode === "signup" ? copy.submitSignUp : copy.submitSignIn}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs tracking-wide text-muted uppercase">
        <span className="h-px flex-1 bg-white/10" />
        {copy.or}
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => void runAuth({ provider: "google" })}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-space px-3 py-2.5 font-medium text-ink hover:border-accent/40 disabled:opacity-60"
      >
        <GoogleMark />
        {copy.google}
      </button>

      <p className="mt-5 text-center text-xs text-muted">{copy.mockNote}</p>
    </section>
  );
}
