"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { CardIndex, CardSheetRow, lockBadge } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import {
  cardAvailability,
  cardLabel,
  topicIsComplete,
} from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

export function StudyTopicView() {
  const params = useParams<{ moduleId: string; topicId: string }>();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const gate = useStudyGate({
    moduleId: params.moduleId,
    topicId: params.topicId,
  });

  if (gate.status !== "ready" || gate.depth !== "topic") return <StudyPending />;

  const { selected, topic, finished, unlockAll } = gate;

  const cardsDone = topicIsComplete(topic, finished);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href={`/study/${selected.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {selected.names[locale]}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
        {topic.names[locale]}
      </h1>
      <p className="mt-2 text-muted">
        {topic.cards.length === 0
          ? copy.emptyCards
          : cardsDone
            ? copy.cardsIntroDone
            : copy.cardsIntro}
      </p>

      <section className="mt-8 overflow-hidden rounded-lg border border-line bg-white">
        <div className="border-b border-line bg-space px-4 py-2.5">
          <p id="card-list-label" className="text-xs font-bold text-accent-deep">
            {copy.cardsTitle}
          </p>
        </div>
        <ol className="divide-y divide-line" aria-labelledby="card-list-label">
          {topic.cards.map((card, cardIndex) => {
            const lock = cardAvailability(topic, cardIndex, finished, unlockAll);

            return (
              <li key={card.id}>
                <CardSheetRow
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
                      kind={card.type}
                    />
                  }
                />
              </li>
            );
          })}
        </ol>
      </section>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
