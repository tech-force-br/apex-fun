import type { Locale } from "@/lib/locale";
import { variablesExerciseCards } from "@/lib/variables-exercises";
import { variablesTheoryCards } from "@/lib/variables-theory";

export type LocalizedText = Record<Locale, string>;

export type TopicLock = "open" | "current" | "locked";

export type ModuleStatus = "open" | "coming_later";

/** One compiler error text, with the message shown when the student's code fails to compile and the error contains `text`. */
export type CompileFailMatch = {
  id: string;
  text: string;
  messages: LocalizedText;
};

/** Shared by every exercise. Explains one compile error. It is not stored on a card. */
export type CompileFailTest = {
  id: string;
  match: CompileFailMatch;
  previewCode: string;
};

export type HiddenTest = {
  id: string;
  checkApex: string;
  messages: LocalizedText;
  previewCode: string;
};

export type TheoryCard = {
  id: string;
  type: "theory";
  bodies: LocalizedText;
  imageRefs: string[];
  sampleApex: string;
};

export type ExerciseCard = {
  id: string;
  type: "exercise";
  prompts: LocalizedText;
  hiddenTests: HiddenTest[];
};

export type Card = TheoryCard | ExerciseCard;

export type Topic = {
  id: string;
  names: LocalizedText;
  cards: Card[];
};

export type CurriculumModule = {
  id: string;
  names: LocalizedText;
  status: ModuleStatus;
  topics: Topic[];
};

export const variablesTopicIds = [
  "what-a-variable-is",
  "naming-rules",
  "declaring",
  "assigning",
  "system-debug",
  "integer",
  "string",
  "boolean",
  "decimal",
  "date",
  "concatenation",
  "mixed-review",
] as const;

export type VariablesTopicId = (typeof variablesTopicIds)[number];

const variablesTopicMeta: Record<
  VariablesTopicId,
  Omit<Topic, "cards" | "id">
> = {
  "what-a-variable-is": {
    names: {
      en: "What a variable is",
      "pt-BR": "O que é uma variável",
    },
  },
  "naming-rules": {
    names: { en: "Naming rules", "pt-BR": "Regras de nomes" },
  },
  declaring: {
    names: { en: "Declaring", "pt-BR": "Declaração" },
  },
  assigning: {
    names: { en: "Assigning", "pt-BR": "Atribuição" },
  },
  "system-debug": {
    names: { en: "System.debug", "pt-BR": "System.debug" },
  },
  integer: {
    names: { en: "Integer", "pt-BR": "Integer" },
  },
  string: {
    names: { en: "String", "pt-BR": "String" },
  },
  boolean: {
    names: { en: "Boolean", "pt-BR": "Boolean" },
  },
  decimal: {
    names: { en: "Decimal", "pt-BR": "Decimal" },
  },
  date: {
    names: { en: "Date", "pt-BR": "Date" },
  },
  concatenation: {
    names: { en: "Concatenation", "pt-BR": "Concatenação" },
  },
  "mixed-review": {
    names: { en: "Mixed review", "pt-BR": "Revisão mista" },
  },
};

export const curriculum: CurriculumModule[] = [
  {
    id: "variables",
    names: { en: "Variables", "pt-BR": "Variáveis" },
    status: "open",
    topics: variablesTopicIds.map((id) => ({
      id,
      ...variablesTopicMeta[id],
      cards: [...variablesTheoryCards[id], ...variablesExerciseCards[id]],
    })),
  },
  {
    id: "operators",
    names: { en: "Operators", "pt-BR": "Operadores" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "if-and-else",
    names: { en: "If and else", "pt-BR": "If e else" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "lists",
    names: { en: "Lists", "pt-BR": "Listas" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "sets",
    names: { en: "Sets", "pt-BR": "Conjuntos" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "loops",
    names: { en: "Loops", "pt-BR": "Laços" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "sobjects",
    names: { en: "sObjects", "pt-BR": "sObjects" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "maps",
    names: { en: "Maps", "pt-BR": "Mapas" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "soql",
    names: { en: "SOQL", "pt-BR": "SOQL" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "dml",
    names: { en: "DML", "pt-BR": "DML" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "methods",
    names: { en: "Methods", "pt-BR": "Métodos" },
    status: "coming_later",
    topics: [],
  },
  {
    id: "classes",
    names: { en: "Classes", "pt-BR": "Classes" },
    status: "coming_later",
    topics: [],
  },
];

export const emptyLocalizedText: LocalizedText = { en: "", "pt-BR": "" };

export function getModule(id: string, modules: CurriculumModule[]) {
  return modules.find((item) => item.id === id);
}

export function getTopic(
  selected: CurriculumModule | undefined,
  topicId: string,
) {
  return selected?.topics.find((item) => item.id === topicId);
}

export function getCard(topic: Topic | undefined, cardId: string) {
  return topic?.cards.find((item) => item.id === cardId);
}

function exerciseCardCount(topic: Topic) {
  return topic.cards.filter((card) => card.type === "exercise").length;
}

export type TopicListMeta =
  | { kind: "theory" }
  | { kind: "exercises"; count: number }
  | { kind: "theory-and-exercises"; count: number };

/** Topic-list fact from the theory and exercise cards that exist. */
export function topicListMeta(topic: Topic): TopicListMeta | undefined {
  const exercises = exerciseCardCount(topic);
  const hasTheory = topic.cards.some((card) => card.type === "theory");
  if (hasTheory && exercises > 0) {
    return { kind: "theory-and-exercises", count: exercises };
  }
  if (exercises > 0) return { kind: "exercises", count: exercises };
  if (hasTheory) return { kind: "theory" };
  return undefined;
}

/**
 * Finished when every card on the topic is finished.
 * An empty card list stays unfinished. There is no required card count.
 */
export function topicIsComplete(
  topic: Topic,
  finished: ReadonlySet<string>,
) {
  return (
    topic.cards.length > 0 &&
    topic.cards.every((card) => finished.has(card.id))
  );
}

/**
 * Share of cards finished, as a whole percent at or below the exact rate.
 * An empty card list is 0%. A finished topic is 100%, and the topic list
 * shows a check for that topic instead of this percent.
 */
export function topicDonePercent(
  topic: Topic,
  finished: ReadonlySet<string>,
) {
  const total = topic.cards.length;
  if (total === 0) return 0;
  const done = topic.cards.filter((card) => finished.has(card.id)).length;
  return Math.floor((done * 100) / total);
}

/**
 * The last card on the topic is finished.
 * The progress bar and Continue use this. An empty card list stays unfinished.
 */
export function lastCardFinished(
  topic: Topic,
  finished: ReadonlySet<string>,
) {
  const last = topic.cards[topic.cards.length - 1];
  return last !== undefined && finished.has(last.id);
}

/** Student progress only. The first unfinished step is current. Later steps are locked. */
function stepLock(index: number, firstUnfinished: number): TopicLock {
  if (firstUnfinished < 0 || index < firstUnfinished) return "open";
  if (index === firstUnfinished) return "current";
  return "locked";
}

/**
 * Owner map access, applied after the student lock.
 * A locked step becomes open. The current step stays current.
 */
function withOwnerAccess(lock: TopicLock, unlockAll: boolean): TopicLock {
  if (unlockAll && lock === "locked") return "open";
  return lock;
}

/** Coming-later modules stay locked for students. The owner can open them. */
export function moduleAvailability(
  status: ModuleStatus,
  unlockAll: boolean,
): TopicLock {
  return withOwnerAccess(status === "open" ? "open" : "locked", unlockAll);
}

/**
 * First unfinished topic in an open module is current.
 * Finished topics stay open. Later topics stay locked.
 * The owner can open every topic, including in a coming-later module.
 */
export function topicAvailability(
  status: ModuleStatus,
  topics: Topic[],
  topicIndex: number,
  finished: ReadonlySet<string>,
  unlockAll: boolean,
): TopicLock {
  const firstUnfinished = topics.findIndex(
    (topic) => !topicIsComplete(topic, finished),
  );
  if (!unlockAll && status !== "open") return "locked";
  return withOwnerAccess(stepLock(topicIndex, firstUnfinished), unlockAll);
}

/** What one topic row shows. A finished unlocked topic is done. */
export type TopicRowState =
  | { kind: "done" }
  | { kind: "current"; percent: number }
  | { kind: "open" }
  | { kind: "locked" };

export function topicRowState(
  lock: TopicLock,
  topic: Topic,
  finished: ReadonlySet<string>,
): TopicRowState {
  if (lock !== "locked" && topicIsComplete(topic, finished)) return { kind: "done" };
  if (lock === "current") {
    return { kind: "current", percent: topicDonePercent(topic, finished) };
  }
  if (lock === "locked") return { kind: "locked" };
  return { kind: "open" };
}

/** Finished cards stay open. The next unfinished card is current. The owner can open later cards. */
export function cardAvailability(
  topic: Topic,
  cardIndex: number,
  finished: ReadonlySet<string>,
  unlockAll: boolean,
): TopicLock {
  const firstUnfinished = topic.cards.findIndex(
    (card) => !finished.has(card.id),
  );
  return withOwnerAccess(stepLock(cardIndex, firstUnfinished), unlockAll);
}

/** Circle on a card row. Ignores owner unlock. The first unfinished card is next. */
export type CardMark = "done" | "next" | "later";

export function cardMark(
  topic: Topic,
  cardIndex: number,
  finished: ReadonlySet<string>,
): CardMark {
  if (finished.has(topic.cards[cardIndex].id)) return "done";
  const firstUnfinished = topic.cards.findIndex(
    (card) => !finished.has(card.id),
  );
  if (cardIndex === firstUnfinished) return "next";
  return "later";
}

/** Card title: the first paragraph of a theory body, or the exercise prompt. */
export function cardLabel(card: Card, locale: Locale) {
  const text =
    card.type === "theory" ? card.bodies[locale] : card.prompts[locale];
  const title = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .find((paragraph) => paragraph.length > 0);
  if (!title) {
    if (locale === "pt-BR") {
      return card.type === "theory" ? "Card de teoria" : "Card de exercício";
    }
    return card.type === "theory" ? "Theory card" : "Exercise card";
  }
  return title;
}
