"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { StudyTheoryView } from "@/components/study-theory-view";
import { useLocale } from "@/components/locale-provider";
import type { CurriculumModule, ExerciseCard, Topic } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

export function StudyCardView() {
  const params = useParams<{
    moduleId: string;
    topicId: string;
    cardId: string;
  }>();
  const gate = useStudyGate({
    moduleId: params.moduleId,
    topicId: params.topicId,
    cardId: params.cardId,
  });

  if (
    gate.redirect ||
    !gate.selected ||
    !gate.topic ||
    gate.topicIndex === undefined ||
    gate.topicIndex < 0 ||
    !gate.card ||
    gate.cardIndex < 0 ||
    !gate.cardLock ||
    gate.cardLock === "locked"
  ) {
    return <StudyPending />;
  }

  if (gate.card.type === "exercise") {
    return (
      <ExerciseUnavailable
        selected={gate.selected}
        topic={gate.topic}
        card={gate.card}
      />
    );
  }

  return (
    <StudyTheoryView
      selected={gate.selected}
      topic={gate.topic}
      topicIndex={gate.topicIndex}
      card={gate.card}
      cardIndex={gate.cardIndex}
      cardLock={gate.cardLock}
    />
  );
}

function ExerciseUnavailable({
  selected,
  topic,
  card,
}: {
  selected: CurriculumModule;
  topic: Topic;
  card: ExerciseCard;
}) {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const prompt = card.prompts[locale].trim();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link
        href={`/study/${selected.id}/${topic.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {topic.names[locale]}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        {copy.exercise}
      </h1>
      {prompt ? (
        <p className="mt-4 text-base leading-7 whitespace-pre-wrap text-ink">
          {prompt}
        </p>
      ) : null}
      <p className="mt-6 text-muted">{copy.exerciseUnavailable}</p>
    </main>
  );
}
