"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { FolderIcon, lockBadge, TopicPathRow } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import { topicAvailability, topicListMeta } from "@/lib/curriculum";
import { studyCopy, topicListLine } from "@/lib/study-copy";

export function StudyModuleView() {
  const params = useParams<{ moduleId: string }>();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const gate = useStudyGate({
    moduleId: params.moduleId,
  });

  if (gate.status !== "ready" || gate.depth !== "module") return <StudyPending />;

  const { selected, finished, unlockAll } = gate;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href="/study"
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {copy.backToMap}
      </Link>
      <p
        id="topic-list-label"
        className="mt-6 text-xs font-bold tracking-[0.14em] text-accent uppercase"
      >
        {copy.topicsTitle}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
        {selected.names[locale]}
      </h1>
      <p className="mt-2 text-muted">{copy.topicsIntro}</p>

      <ol className="mt-8" aria-labelledby="topic-list-label">
        {selected.topics.map((topic, topicIndex) => {
          const lock = topicAvailability(
            selected.status,
            selected.topics,
            topicIndex,
            finished,
            unlockAll,
          );
          const meta = topicListLine(topicListMeta(topic), copy);

          return (
            <li key={topic.id}>
              <TopicPathRow
                connectBelow={topicIndex < selected.topics.length - 1}
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
