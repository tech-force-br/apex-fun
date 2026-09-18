"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";

export function StudyHeader({
  wordmark,
  email,
  signOutLabel,
  onSignOut,
  wide,
  navHref,
  navLabel,
}: {
  wordmark: string;
  email: string;
  signOutLabel: string;
  onSignOut: () => void;
  wide?: boolean;
  navHref?: string;
  navLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-space/80 backdrop-blur-md">
      <div
        className={`mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 ${
          wide ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
          {wordmark}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          {navHref && navLabel ? (
            <Link
              href={navHref}
              className="cursor-pointer text-sm font-medium text-muted hover:text-accent"
            >
              {navLabel}
            </Link>
          ) : null}
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
