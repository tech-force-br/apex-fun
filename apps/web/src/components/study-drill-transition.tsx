import { ViewTransition, type ReactNode } from "react";

/** Deeper study route: map → module → card. */
export const drillForward = ["nav-forward"];

/** Shallower study route: card → module → map. */
export const drillBack = ["nav-back"];

/**
 * A later card in the same topic.
 * `card-switch` keeps the back link, list, bar, and Continue in place.
 * `card-forward` animates the lesson, so the page boundary stays off.
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

/**
 * Same-topic card moves only. The name pairs the old and new lesson, and
 * card-forward / card-back use the page slide classes. Any other navigation
 * leaves the class at "none", so this boundary stays inside the page snapshot.
 */
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
    <ViewTransition
      name="study-lesson"
      enter={lessonMotion}
      exit={lessonMotion}
      update={lessonMotion}
      share={lessonMotion}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
