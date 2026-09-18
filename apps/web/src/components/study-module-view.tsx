"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FolderRow } from "@/components/study-folder-row";
import { StudyHeader } from "@/components/study-header";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { getModule, mockTopicLock } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

export function StudyModuleView() {
  const router = useRouter();
  const params = useParams<{ moduleId: string }>();
  const { locale } = useLocale();
  const { ready, session, signOut } = useMockAuth();
  const copy = studyCopy[locale];
  const selected = getModule(params.moduleId);

  useEffect(() => {
    if (ready && !session) router.replace("/");
  }, [ready, session, router]);

  useEffect(() => {
    if (ready && session && (!selected || selected.status !== "open")) {
      router.replace("/study");
    }
  }, [ready, session, selected, router]);

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  if (!ready || !session || !selected || selected.status !== "open") {
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
      <StudyHeader
        wordmark={copy.wordmark}
        email={session.email}
        signOutLabel={copy.signOut}
        onSignOut={onSignOut}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link
          href="/study"
          className="cursor-pointer text-sm text-muted hover:text-accent"
        >
          ← {copy.backToMap}
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          {selected.names[locale]}
        </h1>
        <p className="mt-2 text-muted">{copy.topicsIntro}</p>

        <ol className="mt-8 space-y-3" aria-label={copy.topicsTitle}>
          {selected.topics.map((topic, topicIndex) => {
            const lock = mockTopicLock(selected.id, topicIndex);
            const meta =
              topic.kind === "theory"
                ? copy.theory
                : copy.exercises(topic.exerciseCount ?? 0);

            return (
              <li key={topic.id}>
                <FolderRow
                  name={topic.names[locale]}
                  meta={meta}
                  locked={lock === "locked"}
                  current={lock === "current"}
                  badge={
                    lock === "current"
                      ? copy.current
                      : lock === "open"
                        ? copy.open
                        : copy.locked
                  }
                  folderLabel={copy.folder}
                />
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
      </main>
    </div>
  );
}
