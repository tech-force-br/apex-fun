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
