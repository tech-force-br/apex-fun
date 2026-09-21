"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { FolderIcon, lockBadge, StudyRow } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import { topicAvailability, topicListMeta } from "@/lib/curriculum";
import { studyCopy, topicListLine } from "@/lib/study-copy";

export function StudyModuleView() {
  const params = useParams<{ moduleId: string }>();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const { selected, finished, redirect } = useStudyGate({
    moduleId: params.moduleId,
  });

  if (redirect || !selected) return <StudyPending />;

  return (
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
          const lock = topicAvailability(
            selected.status,
            selected.topics,
            topicIndex,
            finished,
          );
          const meta = topicListLine(topicListMeta(topic), copy);

          return (
            <li key={topic.id}>
              <StudyRow
                name={topic.names[locale]}
                meta={meta}
                badge={lockBadge(lock, copy)}
                accessibleLabel={copy.folder}
                lock={lock}
                href={`/study/${selected.id}/${topic.id}`}
                leading={
                  <FolderIcon
                    active={lock !== "locked"}
                    locked={lock === "locked"}
                  />
                }
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
