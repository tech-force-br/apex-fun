import {
  cardAvailability,
  lastCardFinished,
  moduleAvailability,
  topicAvailability,
  type Card,
  type CurriculumModule,
  type Topic,
} from "@/lib/curriculum";

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
    };

/**
 * Where this study URL lands.
 * A missing or locked step redirects. An unlocked card stays, including an exercise.
 * topicIndex and cardIndex are omitted when this page has no such id.
 * A negative index means the id is not in the list.
 * `pinnedCardId` keeps that one card on screen after a module wipe.
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
  pinnedCardId: string | null;
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

  const stayOnPinnedCard =
    args.depth === "card" &&
    args.pinnedCardId != null &&
    args.card != null &&
    args.card.id === args.pinnedCardId;

  const topicIndex = args.topicIndex;
  if (
    args.topic === undefined ||
    topicIndex === undefined ||
    topicIndex < 0 ||
    (!stayOnPinnedCard &&
      topicAvailability(
        selected.status,
        selected.topics,
        topicIndex,
        args.finished,
        args.unlockAll,
      ) === "locked")
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
  if (
    !stayOnPinnedCard &&
    cardAvailability(topic, cardIndex, args.finished, args.unlockAll) ===
      "locked"
  ) {
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
  };
}

/**
 * Where a card's advance button goes.
 * An earlier card opens the next card.
 * The last card of an earlier topic completes that topic. The button after
 * that click opens the next topic. `nextLabel` is that button's text.
 * The last card of the last topic fills the bar and plays confetti, then opens the module result modal.
 * The button before the click still says Continue.
 * Once the last card is finished, no card shows Continue.
 */
export function theoryAdvance(
  selected: CurriculumModule,
  topic: Topic,
  topicIndex: number,
  cardIndex: number,
  finished: ReadonlySet<string>,
  copy: { nextTopic: string },
):
  | { href: string; completesTopic: false }
  | {
      href: string;
      completesTopic: true;
      next: "topic";
      nextLabel: string;
    }
  | { completesTopic: true; next: "result" }
  | undefined {
  if (lastCardFinished(topic, finished)) return undefined;
  const nextCard = topic.cards[cardIndex + 1];
  if (nextCard) {
    return {
      href: `/study/${selected.id}/${topic.id}/${nextCard.id}`,
      completesTopic: false,
    };
  }
  const nextTopic = selected.topics[topicIndex + 1];
  if (nextTopic) {
    return {
      href: `/study/${selected.id}/${nextTopic.id}`,
      completesTopic: true,
      next: "topic",
      nextLabel: copy.nextTopic,
    };
  }
  return { completesTopic: true, next: "result" };
}

/** Wide chrome lines up with a card page and with admin. Other pages stay narrow. */
export function studyChromeWidth(pathname: string): "wide" | "narrow" {
  if (pathname.startsWith("/admin")) return "wide";
  const [root, moduleId, topicId, cardId, extra] = pathname
    .split("/")
    .filter(Boolean);
  if (root === "study" && moduleId && topicId && cardId && extra === undefined) {
    return "wide";
  }
  return "narrow";
}
