"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { chromeCopy } from "@/lib/locale";

export function StudyHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const { session, signOut } = useMockAuth();
  const chrome = chromeCopy[locale];
  const admin = pathname.startsWith("/admin");

  if (!session) return null;

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-space/80 backdrop-blur-md">
      <div
        className={`mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 ${
          admin ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
          {chrome.wordmark}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          <Link
            href={admin ? "/study" : "/admin"}
            className="cursor-pointer text-sm font-medium text-muted hover:text-accent"
          >
            {admin ? chrome.studyMap : chrome.admin}
          </Link>
          <p className="text-sm text-muted">{session.email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="cursor-pointer rounded-lg border border-white/15 bg-space px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
          >
            {chrome.signOut}
          </button>
        </div>
      </div>
    </header>
  );
}
