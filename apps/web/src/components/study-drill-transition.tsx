import { ViewTransition, type ReactNode } from "react";

/** Deeper study route: map → module → topic → card. */
export const drillForward = ["nav-forward"];

/** Shallower study route: card → topic → module → map. */
export const drillBack = ["nav-back"];

/**
 * A later card in the same topic.
 * `card-switch` keeps the back link, list, bar, and Continue in place.
 * `card-forward` is the only type the lesson boundary animates, so the page
 * boundary stays off.
 */
export const cardForward = ["card-forward", "card-switch"];

/**
 * An earlier card in the same topic.
 * Same split as `cardForward`: the lesson slides back, and the page does not.
 */
export const cardBack = ["card-back", "card-switch"];

const pageMotion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/** Same-topic card moves only. A drill navigation leaves this name off, so the lesson stays inside the page snapshot. */
const lessonMotion = {
  "card-forward": "nav-forward",
  "card-back": "nav-back",
  default: "none",
} as const;

export function StudyDrillTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={pageMotion} exit={pageMotion} default="none">
      {children}
    </ViewTransition>
  );
}

export function StudyLessonTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={lessonMotion} exit={lessonMotion} default="none">
      {children}
    </ViewTransition>
  );
}
