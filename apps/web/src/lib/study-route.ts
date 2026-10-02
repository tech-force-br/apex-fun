import {
  cardAvailability,
  moduleAvailability,
  topicAvailability,
  type Card,
  type CurriculumModule,
  type Topic,
  type TopicLock,
} from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";

export type StudyDepth = "module" | "topic" | "card";

export type StudyTarget =
  | { status: "redirect"; href: string }
  | { status: "ready"; depth: "module"; selected: CurriculumModule }
  | {
      status: "ready";
      depth: "topic";
      selected: CurriculumModule;
      topic: Topic;
      topicIndex: number;
    }
  | {
      status: "ready";
      depth: "card";
      selected: CurriculumModule;
      topic: Topic;
      topicIndex: number;
      card: Card;
      cardIndex: number;
      cardLock: TopicLock;
    };

/**
 * Where this study URL lands.
 * A missing or locked step redirects. An unlocked card stays, including an exercise.
 * topicIndex and cardIndex are omitted when this page has no such id.
 * A negative index means the id is not in the list.
 */
export function resolveStudyTarget(args: {
  selected: CurriculumModule | undefined;
  topic?: Topic;
  topicIndex?: number;
  card?: Card;
  cardIndex?: number;
  finished: ReadonlySet<string>;
  depth: StudyDepth;
  unlockAll: boolean;
}): StudyTarget {
  if (
    !args.selected ||
    moduleAvailability(args.selected.status, args.unlockAll) === "locked"
  ) {
    return { status: "redirect", href: "/study" };
  }
  const selected = args.selected;

  if (args.depth === "module") {
    return { status: "ready", depth: "module", selected };
  }

  const topicIndex = args.topicIndex;
  if (
    args.topic === undefined ||
    topicIndex === undefined ||
    topicIndex < 0 ||
    topicAvailability(
      selected.status,
      selected.topics,
      topicIndex,
      args.finished,
      args.unlockAll,
    ) === "locked"
  ) {
    return { status: "redirect", href: `/study/${selected.id}` };
  }
  const topic = args.topic;

  if (args.depth === "topic") {
    return { status: "ready", depth: "topic", selected, topic, topicIndex };
  }

  const cardIndex = args.cardIndex;
  if (args.card === undefined || cardIndex === undefined || cardIndex < 0) {
    return {
      status: "redirect",
      href: `/study/${selected.id}/${topic.id}`,
    };
  }
  const cardLock = cardAvailability(
    topic,
    cardIndex,
    args.finished,
    args.unlockAll,
  );
  if (cardLock === "locked") {
    return {
      status: "redirect",
      href: `/study/${selected.id}/${topic.id}`,
    };
  }
  return {
    status: "ready",
    depth: "card",
    selected,
    topic,
    topicIndex,
    card: args.card,
    cardIndex,
    cardLock,
  };
}

/**
 * Where the theory card's button goes.
 * An earlier card opens the next card.
 * The current last card opens the next topic, or the module on the last topic.
 * Re-reading the last card has no button.
 */
export function theoryAdvance(
  selected: CurriculumModule,
  topic: Topic,
  topicIndex: number,
  cardIndex: number,
  cardLock: TopicLock,
  locale: Locale,
  copy: { continue: string; nextTopic: (name: string) => string },
): { href: string; label: string } | undefined {
  const nextCard = topic.cards[cardIndex + 1];
  if (nextCard) {
    return {
      href: `/study/${selected.id}/${topic.id}/${nextCard.id}`,
      label: copy.continue,
    };
  }
  if (cardLock !== "current") return undefined;
  const nextTopic = selected.topics[topicIndex + 1];
  if (nextTopic) {
    return {
      href: `/study/${selected.id}/${nextTopic.id}`,
      label: copy.nextTopic(nextTopic.names[locale]),
    };
  }
  return { href: `/study/${selected.id}`, label: copy.continue };
}
