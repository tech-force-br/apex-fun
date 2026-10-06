"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { curriculum } from "@/lib/curriculum";
import { homeCopy } from "@/lib/home-copy";
import { chromeCopy } from "@/lib/locale";
import { studyCopy } from "@/lib/study-copy";

export function HomeView() {
  const router = useRouter();
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const chrome = chromeCopy[locale];
  const copy = homeCopy[locale];
  const study = studyCopy[locale];

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
    <div className="home-light relative flex min-h-full shrink-0 flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <p className="text-xl font-bold tracking-tight text-accent-deep">
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

        <section className="border-y border-line bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-accent-deep uppercase">
                {copy.previewKicker}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                {copy.previewTitle}
              </h2>
              <p className="mt-3 max-w-md text-muted">{copy.previewBody}</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="flex items-center gap-2 border-b border-line bg-space px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ba0517]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#dd7a01]" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="ml-2 text-xs font-bold text-muted">{study.editor}</p>
              </div>
              <pre className="overflow-x-auto px-5 py-6 font-mono text-sm leading-7 text-ink">
                <span className="font-semibold text-accent-deep">Integer</span> seats = 4;{"\n"}
                <span className="font-semibold text-accent-deep">System</span>.debug(seats);
              </pre>
              <p className="border-t border-line bg-[#eaf5fe] px-5 py-3 text-sm font-bold text-accent-deep">
                {copy.exampleCheck}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            {copy.howTitle}
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-lg border border-line bg-white p-6"
              >
                <p className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
                  {index + 1}
                </p>
                <h3 className="mt-4 text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            {copy.pathTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">{copy.pathLead}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {curriculum.map((module) => {
              const open = module.status === "open";
              return (
                <li key={module.id}>
                  <div
                    className={
                      open
                        ? "rounded-md border border-accent bg-[#eaf5fe] px-4 py-3"
                        : "rounded-md border border-line bg-white px-4 py-3"
                    }
                  >
                    <p className="text-sm font-bold text-ink">
                      {module.names[locale]}
                    </p>
                    <p
                      className={
                        open
                          ? "mt-1 text-xs font-bold text-accent-deep"
                          : "mt-1 text-xs font-bold text-muted"
                      }
                    >
                      {open ? study.open : study.comingLater}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
