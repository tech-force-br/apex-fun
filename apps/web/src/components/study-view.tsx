"use client";

import { FolderRow } from "@/components/study-folder-row";
import { useLocale } from "@/components/locale-provider";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { studyCopy } from "@/lib/study-copy";

export function StudyView() {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const modules = useCurriculumModules();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        {copy.title}
      </h1>
      <p className="mt-2 text-muted">{copy.intro}</p>

      <ol className="mt-8 space-y-3">
        {modules.map((item) => {
          const open = item.status === "open";
          return (
            <li key={item.id}>
              <FolderRow
                name={item.names[locale]}
                badge={open ? copy.open : copy.comingLater}
                folderLabel={copy.folder}
                {...(open
                  ? { state: "open" as const, href: `/study/${item.id}` }
                  : { state: "locked" as const })}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
