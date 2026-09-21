import {
  cardAvailability,
  topicAvailability,
  type Card,
  type CurriculumModule,
  type Topic,
} from "@/lib/curriculum";

export type StudyDepth = "module" | "topic" | "card";

/**
 * Where to send the student when this study URL is missing or still locked.
 * An unlocked card stays put, including an exercise card.
 */
export function studyRedirect(args: {
  selected: CurriculumModule | undefined;
  topic?: Topic;
  topicIndex?: number;
  card?: Card;
  cardIndex?: number;
  finished: ReadonlySet<string>;
  depth: StudyDepth;
}): string | null {
  if (!args.selected || args.selected.status !== "open") return "/study";
  if (args.depth === "module") return null;

  const topicIndex = args.topicIndex ?? -1;
  const topicUnlocked =
    args.topic !== undefined &&
    topicIndex >= 0 &&
    topicAvailability(
      args.selected.status,
      args.selected.topics,
      topicIndex,
      args.finished,
    ) !== "locked";
  if (!topicUnlocked || !args.topic) return `/study/${args.selected.id}`;
  if (args.depth === "topic") return null;

  const cardIndex = args.cardIndex ?? -1;
  const cardUnlocked =
    args.card !== undefined &&
    cardIndex >= 0 &&
    cardAvailability(args.topic, cardIndex, args.finished) !== "locked";
  if (!cardUnlocked) return `/study/${args.selected.id}/${args.topic.id}`;
  return null;
}
