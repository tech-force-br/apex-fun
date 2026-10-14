"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CheckResult, RunSpinner } from "@/components/check-result";
import { CodeEditor } from "@/components/code-editor";
import { StudyPending, useStudyGate } from "@/components/study-gate";
import { TopicProgress } from "@/components/study-topic-progress";
import {
  StudyAdvanceBar,
  StudyTheoryView,
  useCardAdvance,
} from "@/components/study-theory-view";
import { ConfettiBurst } from "@/components/study-confetti";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import type { CurriculumModule, ExerciseCard, Topic } from "@/lib/curriculum";
import { validateExercise } from "@/lib/exercise-check-action";
import { syncSessionCookie } from "@/lib/mock-auth";
import type { ExerciseCheck } from "@/lib/score-run";
import { studyCopy } from "@/lib/study-copy";
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
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = studyCopy[locale];
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExerciseCheck | null>(null);
  const [misses, setMisses] = useState(0);
  const prompt = card.prompts[locale].trim();
  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    "current",
    copy,
  );
  const { held, onAdvance, onNext } = useCardAdvance(card.id, destination);
  const showAdvance =
    result?.passed === true && !running && (destination !== undefined || held !== null);

  async function onValidate() {
    if (running) return;
    syncSessionCookie(session);
    setRunning(true);
    try {
      const next = await validateExercise(card.id, code, locale);
      setResult(next);
      if (!next.passed && !next.unavailable) {
        setMisses((count) => count + 1);
      }
    } finally {
      setRunning(false);
    }
  }

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
      <TopicProgress
        cardIndex={cardIndex}
        cardCount={topic.cards.length}
        label={copy.topicProgress}
        percent={held ? 100 : undefined}
      />
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
      <div
        className={`mt-6 ${running ? "pointer-events-none opacity-60" : ""}`}
        aria-busy={running}
      >
        <CodeEditor
          key={card.id}
          blockClipboard
          readOnly={running}
          label={copy.editor}
          minHeight="12rem"
          onChange={(value) => {
            setCode(value);
            setResult(null);
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => void onValidate()}
        disabled={running}
        aria-busy={running}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#014486]"
      >
        {running ? <RunSpinner /> : null}
        {running ? copy.validating : copy.validate}
      </button>
      {result && !running ? (
        <div className="mt-4">
          <CheckResult
            passed={result.passed}
            unavailable={result.unavailable}
            message={result.message}
            log={result.log}
            logLabel={copy.log}
          />
        </div>
      ) : null}
      {misses >= 2 && result && !result.passed && !result.unavailable && !running ? (
        <p className="mt-4 text-sm text-ink">{copy.theoryHint}</p>
      ) : null}
      {held ? <ConfettiBurst /> : null}
      {showAdvance ? (
        <StudyAdvanceBar
          label={held?.label ?? copy.continue}
          variant={held ? "next" : "continue"}
          onAdvance={held ? onNext : onAdvance}
        />
      ) : null}
    </main>
  );
}
