"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { CardIndex, lockBadge, StudyRow } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import {
  cardAvailability,
  cardLabel,
  everyCardFinished,
} from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

export function StudyTopicView() {
  const params = useParams<{ moduleId: string; topicId: string }>();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const { selected, topic, finished, redirect } = useStudyGate({
    moduleId: params.moduleId,
    topicId: params.topicId,
  });

  if (redirect || !selected || !topic) return <StudyPending />;

  const cardsDone = everyCardFinished(topic, finished);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href={`/study/${selected.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {selected.names[locale]}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        {topic.names[locale]}
      </h1>
      <p className="mt-2 text-muted">
        {topic.cards.length === 0
          ? copy.emptyCards
          : cardsDone
            ? copy.cardsIntroDone
            : copy.cardsIntro}
      </p>

      <ol className="mt-8 space-y-3" aria-label={copy.cardsTitle}>
        {topic.cards.map((card, cardIndex) => {
          const lock = cardAvailability(topic, cardIndex, finished);

          return (
            <li key={card.id}>
              <StudyRow
                name={cardLabel(card, locale)}
                meta={card.type === "theory" ? copy.theory : copy.exercise}
                badge={lockBadge(lock, copy)}
                accessibleLabel={copy.card}
                lock={lock}
                href={`/study/${selected.id}/${topic.id}/${card.id}`}
                leading={
                  <CardIndex
                    label={String(cardIndex + 1)}
                    active={lock !== "locked"}
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
