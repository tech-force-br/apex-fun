"use client";

import {
  cardForward,
  drillBack,
  drillForward,
} from "@/components/study-drill-transition";
import type { ConfettiOrigin } from "@/components/study-confetti";
import { markTopicProgressMotion } from "@/components/study-topic-progress";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  lastCardFinished,
  type CurriculumModule,
  type Topic,
} from "@/lib/curriculum";
import { countModuleFirstTries, type ModuleScore } from "@/lib/module-score";
import {
  clearPinnedCard,
  finishCard,
  getFirstAttemptSnapshot,
  resetModuleProgress,
  useReachedIndex,
} from "@/lib/study-progress";
import { theoryAdvance } from "@/lib/study-route";

/** Same length as the topic-bar width ease, so 100% is visible before the modal. */
const MODULE_RESULT_DELAY_MS = 500;

export type Advance = {
  label: string;
  tone: "continue" | "next";
  run: (at: ConfettiOrigin) => void;
};

/** Confetti for this card, and the module dialog once the delay has elapsed. */
export type CardFinish = {
  burst?: ConfettiOrigin;
  result?: {
    score: ModuleScore;
    onModuleList: () => void;
    onRestart: () => void;
    onDismiss: () => void;
  };
};

/**
 * What this card is doing after Continue on its last card.
 * The bar stays at 100% for every phase. Dismissed keeps that pose without the dialog.
 */
type Phase =
  | {
      kind: "next";
      href: string;
      label: string;
      origin: ConfettiOrigin;
      transitionTypes: string[];
    }
  | { kind: "filling"; origin: ConfettiOrigin; score: ModuleScore }
  | { kind: "result"; origin: ConfettiOrigin; score: ModuleScore }
  | { kind: "dismissed"; origin: ConfettiOrigin };

export function useCardAdvance({
  selected,
  topic,
  topicIndex,
  cardId,
  cardIndex,
  finished,
  copy,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  cardId: string;
  cardIndex: number;
  finished: ReadonlySet<string>;
  copy: { continue: string; nextTopic: string };
}): {
  lastFinished: boolean;
  advance: Advance | undefined;
  finish: CardFinish | undefined;
} {
  const router = useRouter();
  const reached = useReachedIndex(topic.id);
  const [phase, setPhase] = useState<Phase | null>(null);
  const phaseRef = useRef<Phase | null>(null);
  const startedFor = useRef<string | null>(null);
  const selectedRef = useRef(selected);
  const cardIdRef = useRef(cardId);

  useEffect(() => {
    selectedRef.current = selected;
    cardIdRef.current = cardId;
  }, [selected, cardId]);

  function show(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  useEffect(() => {
    return () => {
      const current = phaseRef.current;
      // Continue already marked the card finished. Leaving before the modal
      // opens must not keep a failed module in that state.
      if (current?.kind === "filling" && !current.score.passed) {
        resetModuleProgress(selectedRef.current, null);
      }
      clearPinnedCard(cardIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase?.kind !== "filling") return;
    const { origin, score } = phase;
    const timer = window.setTimeout(() => {
      if (!score.passed) {
        resetModuleProgress(selectedRef.current, cardIdRef.current);
      }
      const next: Phase = { kind: "result", origin, score };
      phaseRef.current = next;
      setPhase(next);
    }, MODULE_RESULT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    finished,
    copy,
  );

  let advance: Advance | undefined;
  if (
    phase?.kind === "filling" ||
    phase?.kind === "result" ||
    phase?.kind === "dismissed"
  ) {
    advance = undefined;
  } else if (phase?.kind === "next") {
    const href = phase.href;
    const transitionTypes = phase.transitionTypes;
    advance = {
      label: phase.label,
      tone: "next",
      run: () => router.push(href, { transitionTypes }),
    };
  } else if (destination?.completesTopic && destination.next === "result") {
    advance = {
      label: copy.continue,
      tone: "continue",
      run: (origin) => {
        if (startedFor.current === cardId) return;
        startedFor.current = cardId;
        const score = countModuleFirstTries(
          selected,
          getFirstAttemptSnapshot(),
        );
        finishCard(cardId);
        show({ kind: "filling", origin, score });
      },
    };
  } else if (destination?.completesTopic) {
    const href = destination.href;
    const nextLabel = destination.nextLabel;
    advance = {
      label: copy.continue,
      tone: "continue",
      run: (origin) => {
        if (startedFor.current === cardId) return;
        startedFor.current = cardId;
        finishCard(cardId);
        show({
          kind: "next",
          href,
          label: nextLabel,
          origin,
          transitionTypes: drillForward,
        });
      },
    };
  } else if (destination) {
    const href = destination.href;
    advance = {
      label: copy.continue,
      tone: "continue",
      run: () => {
        markTopicProgressMotion({
          fromIndex: cardIndex,
          toIndex: cardIndex + 1,
          reached,
          cardCount: topic.cards.length,
          lastFinished: lastCardFinished(topic, finished),
        });
        finishCard(cardId);
        router.push(href, { transitionTypes: cardForward });
      },
    };
  }

  const finish: CardFinish | undefined = phase
    ? {
        burst: phase.origin,
        result:
          phase.kind === "result"
            ? {
                score: phase.score,
                onModuleList: () =>
                  router.push("/study", { transitionTypes: drillBack }),
                onRestart: () =>
                  router.push(`/study/${selected.id}`, {
                    transitionTypes: drillBack,
                  }),
                onDismiss: () =>
                  show({ kind: "dismissed", origin: phase.origin }),
              }
            : undefined,
      }
    : undefined;

  return {
    lastFinished: lastCardFinished(topic, finished) || phase !== null,
    advance,
    finish,
  };
}
