import {
  moduleAvailability,
  moduleTopicsDonePercent,
  type CurriculumModule,
} from "@/lib/curriculum";
import { moduleIsComplete } from "@/lib/module-score";

/**
 * What one module stop shows.
 * A coming-later module stays `later` when the owner can open it.
 * `locked` is the student lock only.
 * `current` marks the first unfinished open module. `moduleStopState` leaves it false.
 */
export type ModuleStopState =
  | { kind: "done" }
  | { kind: "open"; percent: number; current: boolean }
  | { kind: "later"; locked: boolean };

export function moduleStopState(
  module: CurriculumModule,
  finished: ReadonlySet<string>,
  firstClean: ReadonlyMap<string, boolean>,
  unlockAll: boolean,
): ModuleStopState {
  if (module.status !== "open") {
    return {
      kind: "later",
      locked: moduleAvailability(module.status, unlockAll) === "locked",
    };
  }
  if (moduleIsComplete(module, finished, firstClean)) return { kind: "done" };
  return {
    kind: "open",
    percent: moduleTopicsDonePercent(module, finished),
    current: false,
  };
}

/** The first unfinished open module is the one that floats. Later open modules stay open. */
export function markCurrentModule<T extends { state: ModuleStopState }>(
  stops: readonly T[],
): T[] {
  let marked = false;
  return stops.map((stop) => {
    if (stop.state.kind !== "open" || marked) return stop;
    marked = true;
    return { ...stop, state: { ...stop.state, current: true } };
  });
}
