"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { drillBack } from "@/components/study-drill-transition";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { TopicPathRow } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import {
  topicAvailability,
  topicListMeta,
  topicRowState,
} from "@/lib/curriculum";
import { studyCopy, topicListLine } from "@/lib/study-copy";
import { topicLandingHref } from "@/lib/study-route";

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
        transitionTypes={drillBack}
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
                mark={topic.id}
                name={topic.names[locale]}
                meta={meta}
                state={topicRowState(lock, topic, finished)}
                accessibleLabel={copy.folder}
                copy={copy}
                href={topicLandingHref(selected.id, topic, finished)}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
