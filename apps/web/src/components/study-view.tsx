"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { curriculum, mockTopicLock, type TopicLock } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      aria-hidden
    >
      <rect
        x="3.5"
        y="7"
        width="9"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5.25 7V5.25a2.75 2.75 0 0 1 5.5 0V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function topicLockLabel(lock: TopicLock, copy: (typeof studyCopy)["en"]) {
  if (lock === "current") return copy.current;
  if (lock === "open") return copy.open;
  return copy.locked;
}

export function StudyView() {
  const router = useRouter();
  const { locale } = useLocale();
  const { ready, session, signOut } = useMockAuth();
  const copy = studyCopy[locale];

  useEffect(() => {
    if (ready && !session) router.replace("/");
  }, [ready, session, router]);

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  if (!ready || !session) {
    return (
      <main
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        aria-busy="true"
      >
        <p className="text-sm text-muted">{copy.loading}</p>
      </main>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-space/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
            {copy.wordmark}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle />
            <p className="text-sm text-muted">{session.email}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="cursor-pointer rounded-lg border border-white/15 bg-space px-3 py-1.5 text-sm font-medium text-ink hover:border-accent/40"
            >
              {copy.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="mt-2 text-muted">{copy.intro}</p>

        <ol className="mt-8 space-y-4">
          {curriculum.map((module, moduleIndex) => {
            const open = module.status === "open";
            return (
              <li
                key={module.id}
                className={`rounded-2xl border p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)] ${
                  open
                    ? "border-accent/35 bg-space-card/95"
                    : "border-white/10 bg-space-card/60"
                }`}
                aria-disabled={open ? undefined : true}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
                      {String(moduleIndex + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-ink">
                      {module.names[locale]}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      open
                        ? "bg-accent/15 text-accent"
                        : "bg-white/5 text-muted"
                    }`}
                  >
                    {open ? copy.open : copy.comingLater}
                  </span>
                </div>

                {open && module.topics.length > 0 ? (
                  <ol className="relative mt-5 space-y-1 border-l border-white/10 pl-4">
                    {module.topics.map((topic, topicIndex) => {
                      const lock = mockTopicLock(module.id, topicIndex);
                      const current = lock === "current";
                      const locked = lock === "locked";
                      const meta =
                        topic.kind === "theory"
                          ? copy.theory
                          : copy.exercises(topic.exerciseCount ?? 0);

                      return (
                        <li key={topic.id}>
                          <div
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                              current
                                ? "bg-accent/10 ring-1 ring-accent/35"
                                : ""
                            }`}
                            aria-current={current ? "step" : undefined}
                            aria-disabled={locked || undefined}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                                current
                                  ? "bg-accent text-space"
                                  : "bg-space text-muted"
                              }`}
                            >
                              {topicIndex + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate font-medium ${
                                  locked ? "text-muted" : "text-ink"
                                }`}
                              >
                                {topic.names[locale]}
                              </p>
                              <p className="text-xs text-muted">{meta}</p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                current ? "text-accent" : "text-muted"
                              }`}
                            >
                              {locked ? <LockIcon /> : null}
                              {topicLockLabel(lock, copy)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
      </main>
    </div>
  );
}
