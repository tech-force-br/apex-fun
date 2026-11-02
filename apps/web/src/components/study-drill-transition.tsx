import { ViewTransition, type ReactNode } from "react";

/** Deeper study route: map → module → card. */
export const drillForward = ["nav-forward"];

/** Shallower study route: card → module → map. */
export const drillBack = ["nav-back"];

/**
 * Continue to the next card in the same topic.
 * `card-switch` keeps the back link, list, and bar in place.
 * Continue is hidden until that transition ends.
 * `card-forward` animates the lesson, so the page boundary stays off.
 * A card list link passes no transition type.
 */
export const cardForward = ["card-forward", "card-switch"];

const pageMotion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Continue to the next card only. The name pairs the old and new lesson, and
 * card-forward uses the page slide class. Any other navigation leaves the
 * class at "none", so this boundary stays inside the page snapshot.
 */
const lessonMotion = {
  "card-forward": "nav-forward",
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
