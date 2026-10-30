"use client";

import { useSyncExternalStore } from "react";

/**
 * Tab progress. One snapshot so a module wipe and the card pin land together.
 * A render that sees the wipe also sees the pin.
 */
type Progress = {
  finished: ReadonlySet<string>;
  reached: ReadonlyMap<string, number>;
  firstClean: ReadonlyMap<string, boolean>;
  /** This card stays on screen after a wipe. Other URLs still follow locks. */
  pinnedCardId: string | null;
};

const emptyFinished = new Set<string>();
const emptyReached = new Map<string, number>();
const emptyFirstClean = new Map<string, boolean>();

let progress: Progress = {
  finished: emptyFinished,
  reached: emptyReached,
  firstClean: emptyFirstClean,
  pinnedCardId: null,
};

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function commit(next: Progress) {
  progress = next;
  notify();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function finishCard(id: string) {
  if (progress.finished.has(id)) return;
  const finished = new Set(progress.finished);
  finished.add(id);
  commit({ ...progress, finished });
}

function getFinishedSnapshot() {
  return progress.finished;
}

export function useFinishedCards() {
  return useSyncExternalStore(
    subscribe,
    getFinishedSnapshot,
    () => emptyFinished,
  );
}

/** Raises the furthest card index shown in a topic. A lower index does not stick. */
export function reachCard(topicId: string, cardIndex: number) {
  const prev = progress.reached.get(topicId) ?? 0;
  if (cardIndex <= prev) return;
  const reached = new Map(progress.reached);
  reached.set(topicId, cardIndex);
  commit({ ...progress, reached });
}

function getReachedSnapshot() {
  return progress.reached;
}

export function useReachedIndex(topicId: string) {
  const reached = useSyncExternalStore(
    subscribe,
    getReachedSnapshot,
    () => emptyReached,
  );
  return reached.get(topicId) ?? 0;
}

/** Records the first scored Run. A later Run does not change it. */
export function recordFirstAttempt(cardId: string, clean: boolean) {
  if (progress.firstClean.has(cardId)) return;
  const firstClean = new Map(progress.firstClean);
  firstClean.set(cardId, clean);
  commit({ ...progress, firstClean });
}

export function getFirstAttemptSnapshot() {
  return progress.firstClean;
}

export function useFirstAttempts() {
  return useSyncExternalStore(
    subscribe,
    getFirstAttemptSnapshot,
    () => emptyFirstClean,
  );
}

function getPinnedCardId() {
  return progress.pinnedCardId;
}

export function usePinnedCardId() {
  return useSyncExternalStore(subscribe, getPinnedCardId, () => null);
}

/**
 * Wipes finished cards, first tries, and progress bars for one module.
 * `pinCardId` is written in the same snapshot. Null clears any pin.
 */
export function resetModuleProgress(
  module: {
    topics: { id: string; cards: { id: string }[] }[];
  },
  pinCardId: string | null,
) {
  const cardIds = new Set(
    module.topics.flatMap((topic) => topic.cards.map((card) => card.id)),
  );
  const topicIds = new Set(module.topics.map((topic) => topic.id));
  commit({
    finished: new Set([...progress.finished].filter((id) => !cardIds.has(id))),
    firstClean: new Map(
      [...progress.firstClean].filter(([id]) => !cardIds.has(id)),
    ),
    reached: new Map([...progress.reached].filter(([id]) => !topicIds.has(id))),
    pinnedCardId: pinCardId,
  });
}

/** Drops the pin when that card leaves the screen. */
export function clearPinnedCard(cardId: string) {
  if (progress.pinnedCardId !== cardId) return;
  commit({ ...progress, pinnedCardId: null });
}
