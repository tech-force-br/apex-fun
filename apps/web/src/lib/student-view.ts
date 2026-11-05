"use client";

import { useSyncExternalStore } from "react";
import {
  getMockSessionServerSnapshot,
  getMockSessionSnapshot,
  sessionIsAdmin,
  subscribeMockSession,
} from "@/lib/mock-auth";

let studentView = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeStudentView(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStudentViewSnapshot() {
  return studentView;
}

export function getStudentViewServerSnapshot() {
  return false;
}

export function setStudentView(next: boolean) {
  if (studentView === next) return;
  studentView = next;
  emit();
}

export function useStudentView() {
  return useSyncExternalStore(
    subscribeStudentView,
    getStudentViewSnapshot,
    getStudentViewServerSnapshot,
  );
}

/** Owner unlocks, unless the owner turned on student view. */
export function useUnlockAll() {
  const session = useSyncExternalStore(
    subscribeMockSession,
    getMockSessionSnapshot,
    getMockSessionServerSnapshot,
  );
  const studentView = useStudentView();
  return sessionIsAdmin(session) && !studentView;
}
