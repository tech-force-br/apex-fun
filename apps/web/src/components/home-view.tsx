"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LanguageToggle } from "@/components/language-toggle";
import { PageScroll } from "@/components/site-footer";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { homeCopy } from "@/lib/home-copy";
import { chromeCopy } from "@/lib/locale";

export function HomeView() {
  const router = useRouter();
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const chrome = chromeCopy[locale];
  const copy = homeCopy[locale];

  useEffect(() => {
    if (session) router.replace("/study");
  }, [session, router]);

  if (session) {
    return (
      <main
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        aria-busy="true"
      >
        <p className="text-sm text-muted">{chrome.loading}</p>
      </main>
    );
  }

  return (
    <PageScroll className="home-light relative">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <p className="cursor-default text-xl font-bold tracking-tight text-accent-deep">
            {chrome.wordmark}
          </p>
          <LanguageToggle />
        </div>
      </header>

      <main>
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-10 pb-6 text-center sm:pt-14">
          <p className="rounded-md border border-line bg-white px-3 py-1 text-xs font-bold tracking-wide text-accent-deep">
            {copy.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl sm:leading-[1.1]">
            {copy.headlineLead}
            <span className="mt-1 block text-accent-deep">{copy.headlineAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-pretty text-muted sm:text-lg">
            {copy.lede}
          </p>
        </section>

        <div className="mx-auto flex w-full max-w-6xl justify-center px-6 pb-14">
          <AuthCard />
        </div>
      </main>
    </PageScroll>
  );
}
