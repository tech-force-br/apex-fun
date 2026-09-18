"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderRow } from "@/components/study-folder-row";
import { StudyHeader } from "@/components/study-header";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { curriculum } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

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
      <StudyHeader
        wordmark={copy.wordmark}
        email={session.email}
        signOutLabel={copy.signOut}
        onSignOut={onSignOut}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="mt-2 text-muted">{copy.intro}</p>

        <ol className="mt-8 space-y-3">
          {curriculum.map((module) => {
            const open = module.status === "open";
            return (
              <li key={module.id}>
                <FolderRow
                  name={module.names[locale]}
                  href={open ? `/study/${module.id}` : undefined}
                  locked={!open}
                  badge={open ? copy.open : copy.comingLater}
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
