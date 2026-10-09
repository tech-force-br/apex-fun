"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import {
  StudyAdvanceBar,
  StudyTheoryView,
} from "@/components/study-theory-view";
import { useLocale } from "@/components/locale-provider";
import type { CurriculumModule, ExerciseCard, Topic } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";
import { finishCard } from "@/lib/study-progress";
import { theoryAdvance } from "@/lib/study-route";

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

  if (gate.status !== "ready" || gate.depth !== "card") {
    return <StudyPending />;
  }

  if (gate.card.type === "exercise") {
    return (
      <StudyExerciseView
        key={gate.card.id}
        selected={gate.selected}
        topic={gate.topic}
        topicIndex={gate.topicIndex}
        card={gate.card}
        cardIndex={gate.cardIndex}
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

function StudyExerciseView({
  selected,
  topic,
  topicIndex,
  card,
  cardIndex,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  card: ExerciseCard;
  cardIndex: number;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const [validated, setValidated] = useState(false);
  const prompt = card.prompts[locale].trim();
  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    "current",
    locale,
    copy,
  );
  const showAdvance = validated && destination !== undefined;

  return (
    <main
      className={`mx-auto w-full max-w-3xl flex-1 px-6 pt-10 ${
        showAdvance ? "pb-32" : "pb-10"
      }`}
    >
      <Link
        href={`/study/${selected.id}/${topic.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {topic.names[locale]}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
        {copy.exercise}
      </h1>
      {prompt ? (
        <p
          className="mt-4 text-base leading-7 whitespace-pre-wrap text-ink"
          onCopy={(event) => event.preventDefault()}
          onCut={(event) => event.preventDefault()}
          onPaste={(event) => event.preventDefault()}
        >
          {prompt}
        </p>
      ) : null}
      <div className="mt-6">
        <CodeEditor
          key={card.id}
          blockClipboard
          label={copy.editor}
          minHeight="12rem"
        />
      </div>
      <button
        type="button"
        onClick={() => setValidated(true)}
        className="mt-4 cursor-pointer rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#014486]"
      >
        {copy.validate}
      </button>
      <p className="mt-4 text-sm text-muted">{copy.exerciseUnavailable}</p>
      {showAdvance ? (
        <StudyAdvanceBar
          label={destination.label}
          onAdvance={() => {
            finishCard(card.id);
            router.push(destination.href);
          }}
        />
      ) : null}
    </main>
  );
}
