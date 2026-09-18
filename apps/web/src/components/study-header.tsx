"use client";

import { LanguageToggle } from "@/components/language-toggle";

export function StudyHeader({
  wordmark,
  email,
  signOutLabel,
  onSignOut,
}: {
  wordmark: string;
  email: string;
  signOutLabel: string;
  onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-space/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
          {wordmark}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          <p className="text-sm text-muted">{email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="cursor-pointer rounded-lg border border-white/15 bg-space px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
          >
            {signOutLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
