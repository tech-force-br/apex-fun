"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let finished = new Set<string>();
const emptyFinished = new Set<string>();

function notify() {
  for (const listener of listeners) listener();
}

export function finishCard(id: string) {
  if (finished.has(id)) return;
  finished = new Set(finished);
  finished.add(id);
  notify();
}

export function subscribeFinished(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getFinishedSnapshot() {
  return finished;
}

export function getFinishedServerSnapshot() {
  return emptyFinished;
}

export function useFinishedCards() {
  return useSyncExternalStore(
    subscribeFinished,
    getFinishedSnapshot,
    getFinishedServerSnapshot,
  );
}

const reachedListeners = new Set<() => void>();
let reachedByTopic = new Map<string, number>();
const emptyReached = new Map<string, number>();

function notifyReached() {
  for (const listener of reachedListeners) listener();
}

/** Raises the furthest card index shown in a topic. A lower index does not stick. */
export function reachCard(topicId: string, cardIndex: number) {
  const prev = reachedByTopic.get(topicId) ?? 0;
  if (cardIndex <= prev) return;
  const next = new Map(reachedByTopic);
  next.set(topicId, cardIndex);
  reachedByTopic = next;
  notifyReached();
}

export function subscribeReached(onStoreChange: () => void) {
  reachedListeners.add(onStoreChange);
  return () => {
    reachedListeners.delete(onStoreChange);
  };
}

export function getReachedSnapshot() {
  return reachedByTopic;
}

export function getReachedServerSnapshot() {
  return emptyReached;
}

export function useReachedIndex(topicId: string) {
  const reached = useSyncExternalStore(
    subscribeReached,
    getReachedSnapshot,
    getReachedServerSnapshot,
  );
  return reached.get(topicId) ?? 0;
}
