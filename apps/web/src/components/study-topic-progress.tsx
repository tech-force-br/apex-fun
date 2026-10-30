"use client";

import { useEffect } from "react";
import {
  reachCard,
  usePinnedCardId,
  useReachedIndex,
} from "@/lib/study-progress";

/**
 * Call before a same-topic card change, before the view transition starts.
 * The fill eases only when the shown percent rises.
 */
export function markTopicProgressMotion(args: {
  fromIndex: number;
  toIndex: number;
  reached: number;
  cardCount: number;
  lastFinished: boolean;
}) {
  const from = topicProgressPercent(
    Math.max(args.reached, args.fromIndex),
    args.cardCount,
    args.lastFinished,
  );
  const to = topicProgressPercent(
    Math.max(args.reached, args.toIndex),
    args.cardCount,
    args.lastFinished,
  );
  document.documentElement.dataset.cardProgress = to > from ? "grow" : "still";
}

/** Furthest card reached, or 100 once the last card is finished. */
export function topicProgressPercent(
  reachedIndex: number,
  cardCount: number,
  lastFinished: boolean,
) {
  if (lastFinished) return 100;
  if (cardCount <= 0 || reachedIndex <= 0) return 0;
  return Math.round((reachedIndex / cardCount) * 100);
}

export function TopicProgress({
  topicId,
  cardId,
  cardIndex,
  cardCount,
  label,
  lastFinished,
}: {
  topicId: string;
  cardId: string;
  cardIndex: number;
  cardCount: number;
  label: string;
  lastFinished: boolean;
}) {
  const stored = useReachedIndex(topicId);
  const pinnedCardId = usePinnedCardId();
  const reachedIndex = Math.max(stored, cardIndex);
  const percent = topicProgressPercent(reachedIndex, cardCount, lastFinished);

  useEffect(() => {
    if (pinnedCardId === cardId) return;
    if (cardIndex > stored) reachCard(topicId, cardIndex);
  }, [topicId, cardId, cardIndex, stored, pinnedCardId]);

  return (
    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        className="study-topic-progress col-start-1 row-start-1 h-2 rounded-full bg-line"
      />
      <div
        aria-hidden
        className="study-topic-progress-fill col-start-1 row-start-1 h-2 justify-self-start rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
      <p className="study-topic-progress-value col-start-2 row-start-1 text-right text-sm font-bold tabular-nums text-ink">
        {percent}%
      </p>
    </div>
  );
}
