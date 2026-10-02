"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import { FolderIcon, StudyRow } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import { moduleAvailability } from "@/lib/curriculum";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { sessionIsAdmin } from "@/lib/mock-auth";
import { studyCopy } from "@/lib/study-copy";

export function StudyView() {
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = studyCopy[locale];
  const modules = useCurriculumModules();
  const unlockAll = sessionIsAdmin(session);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        {copy.title}
      </h1>
      <p className="mt-2 text-muted">{copy.intro}</p>

      <ol className="mt-8 space-y-3">
        {modules.map((item) => {
          const lock = moduleAvailability(item.status, unlockAll);
          const open = lock !== "locked";
          return (
            <li key={item.id}>
              <StudyRow
                name={item.names[locale]}
                badge={item.status === "open" ? copy.open : copy.comingLater}
                accessibleLabel={copy.folder}
                lock={lock}
                href={`/study/${item.id}`}
                leading={<FolderIcon active={open} locked={!open} />}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
