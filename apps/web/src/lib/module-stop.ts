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
 */
export type ModuleStopState =
  | { kind: "done" }
  | { kind: "open"; percent: number }
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
  };
}
