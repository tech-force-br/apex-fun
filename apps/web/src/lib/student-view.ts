"use client";

import { useSyncExternalStore } from "react";
import {
  getMockSessionServerSnapshot,
  getMockSessionSnapshot,
  sessionIsAdmin,
  subscribeMockSession,
} from "@/lib/mock-auth";

let studentView = false;
/** Pill value from before the builder opened. Null while the builder is closed. */
let studentViewBeforeAdmin: boolean | null = null;
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

/** Remember the pill, then turn student view off for the builder. */
export function suspendStudentViewForAdmin() {
  if (studentViewBeforeAdmin === null) {
    studentViewBeforeAdmin = studentView;
  }
  setStudentView(false);
}

/** Put the pill back to the value from before the builder opened. */
export function restoreStudentViewAfterAdmin() {
  if (studentViewBeforeAdmin === null) return;
  const next = studentViewBeforeAdmin;
  studentViewBeforeAdmin = null;
  setStudentView(next);
}

/** An explicit pill choice replaces any value saved for the builder. */
export function chooseStudentView(next: boolean) {
  studentViewBeforeAdmin = null;
  setStudentView(next);
}

export function resetStudentView() {
  studentViewBeforeAdmin = null;
  setStudentView(false);
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
