"use client";

import { useSyncExternalStore } from "react";
import { useMockAuth } from "@/components/mock-auth-provider";
import { sessionIsAdmin } from "@/lib/mock-auth";

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
  const studentView = useSyncExternalStore(
    subscribeStudentView,
    getStudentViewSnapshot,
    getStudentViewServerSnapshot,
  );
  return { studentView, setStudentView };
}

/** Owner unlocks, unless the owner turned on student view. */
export function useUnlockAll() {
  const { session } = useMockAuth();
  const { studentView } = useStudentView();
  return sessionIsAdmin(session) && !studentView;
}
