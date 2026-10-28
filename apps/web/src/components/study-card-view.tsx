"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CheckResult, RunSpinner } from "@/components/check-result";
import { CodeEditor } from "@/components/code-editor";
import { TopicCardPane } from "@/components/study-card-pane";
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

  const lesson =
    gate.card.type === "exercise" ? (
      <StudyExerciseView
        key={gate.card.id}
        selected={gate.selected}
        topic={gate.topic}
        topicIndex={gate.topicIndex}
        card={gate.card}
        cardIndex={gate.cardIndex}
        finished={gate.finished}
      />
    ) : (
      <StudyTheoryView
        key={gate.card.id}
        selected={gate.selected}
        topic={gate.topic}
        topicIndex={gate.topicIndex}
        card={gate.card}
        cardIndex={gate.cardIndex}
        finished={gate.finished}
      />
    );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:h-[calc(100dvh-var(--site-footer-height)-var(--study-header-height))] md:min-h-0 md:flex-row md:overflow-hidden">
      <TopicCardPane
        moduleId={gate.selected.id}
        topic={gate.topic}
        finished={gate.finished}
        unlockAll={gate.unlockAll}
        activeCardId={gate.card.id}
      />
      {lesson}
    </div>
  );
}

function StudyExerciseView({
  selected,
  topic,
  topicIndex,
  card,
  cardIndex,
  finished,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  card: ExerciseCard;
  cardIndex: number;
  finished: ReadonlySet<string>;
}) {
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = studyCopy[locale];
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExerciseCheck | null>(null);
  const [earnedAdvance, setEarnedAdvance] = useState(false);
  const prompt = card.prompts[locale].trim();
  const { lastFinished, advance } = useCardAdvance({
    selected,
    topic,
    topicIndex,
    cardId: card.id,
    cardIndex,
    finished,
    copy,
  });
  const visibleAdvance = earnedAdvance ? advance : undefined;
  const showValidate = code.trim().length > 0;

  async function onValidate() {
    if (running) return;
    syncSessionCookie(session);
    setRunning(true);
    try {
      const next = await validateExercise(card.id, code, locale);
      if (next.passed) setEarnedAdvance(true);
      setResult(next);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
      <main
        className={`w-full md:min-h-0 md:flex-1 md:overflow-y-auto ${
          visibleAdvance ? "pb-28 md:pb-0" : ""
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
          lastFinished={lastFinished}
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
            onChange={setCode}
          />
        </div>
        {showValidate ? (
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
        ) : null}
        {result && !running ? (
          <div className="mt-4 rounded-lg border border-line bg-white p-4">
            <CheckResult
              passed={result.passed}
              unavailable={result.unavailable}
              message={result.passed ? copy.passed : result.message}
              log={result.log}
              logLabel={copy.log}
            />
          </div>
        ) : null}
        {visibleAdvance?.burst ? (
          <ConfettiBurst origin={visibleAdvance.burst} />
        ) : null}
      </main>
      {visibleAdvance ? <StudyAdvanceBar advance={visibleAdvance} /> : null}
    </div>
  );
}
