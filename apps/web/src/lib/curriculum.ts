import type { Locale } from "@/lib/locale";
import { variablesTheoryCards } from "@/lib/variables-theory";

export type LocalizedText = Record<Locale, string>;

export type TopicKind = "theory" | "exercises";

export type TopicLock = "open" | "current" | "locked";

export type ModuleStatus = "open" | "coming_later";

export type HiddenTestMode = "run_clean" | "compile_fail";

export type HiddenTest = {
  id: string;
  mode: HiddenTestMode;
  checkApex: string;
  compileFailMatch: string;
  messages: LocalizedText;
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
  previewCode: string;
};

export type Card = TheoryCard | ExerciseCard;

export type Topic = {
  id: string;
  names: LocalizedText;
  kind: TopicKind;
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
    kind: "theory",
  },
  "naming-rules": {
    names: { en: "Naming rules", "pt-BR": "Regras de nomes" },
    kind: "theory",
  },
  declaring: {
    names: { en: "Declaring", "pt-BR": "Declaração" },
    kind: "theory",
  },
  assigning: {
    names: { en: "Assigning", "pt-BR": "Atribuição" },
    kind: "theory",
  },
  "system-debug": {
    names: { en: "System.debug", "pt-BR": "System.debug" },
    kind: "theory",
  },
  integer: {
    names: { en: "Integer", "pt-BR": "Integer" },
    kind: "exercises",
  },
  string: {
    names: { en: "String", "pt-BR": "String" },
    kind: "exercises",
  },
  boolean: {
    names: { en: "Boolean", "pt-BR": "Boolean" },
    kind: "exercises",
  },
  decimal: {
    names: { en: "Decimal", "pt-BR": "Decimal" },
    kind: "exercises",
  },
  date: {
    names: { en: "Date", "pt-BR": "Date" },
    kind: "exercises",
  },
  concatenation: {
    names: { en: "Concatenation", "pt-BR": "Concatenação" },
    kind: "exercises",
  },
  "mixed-review": {
    names: { en: "Mixed review", "pt-BR": "Revisão mista" },
    kind: "exercises",
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
      cards: variablesTheoryCards[id],
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
    id: "loops",
    names: { en: "Loops", "pt-BR": "Laços" },
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
    id: "sobjects",
    names: { en: "sObjects", "pt-BR": "sObjects" },
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

function stepLock(index: number, firstUnfinished: number): TopicLock {
  if (firstUnfinished < 0 || index < firstUnfinished) return "open";
  if (index === firstUnfinished) return "current";
  return "locked";
}

/**
 * First unfinished topic in an open module is current.
 * Finished topics stay open. Later topics stay locked.
 */
export function topicAvailability(
  status: ModuleStatus,
  topics: Topic[],
  topicIndex: number,
  finished: ReadonlySet<string>,
): TopicLock {
  if (status !== "open") return "locked";
  const firstUnfinished = topics.findIndex(
    (topic) => !topicIsComplete(topic, finished),
  );
  return stepLock(topicIndex, firstUnfinished);
}

/** Finished cards stay open. The next unfinished card is current. */
export function cardAvailability(
  topic: Topic,
  cardIndex: number,
  finished: ReadonlySet<string>,
): TopicLock {
  const firstUnfinished = topic.cards.findIndex(
    (card) => !finished.has(card.id),
  );
  return stepLock(cardIndex, firstUnfinished);
}

export function cardLabel(card: Card, locale: Locale) {
  const text =
    card.type === "theory" ? card.bodies[locale] : card.prompts[locale];
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    if (locale === "pt-BR") {
      return card.type === "theory" ? "Card de teoria" : "Card de exercício";
    }
    return card.type === "theory" ? "Theory card" : "Exercise card";
  }
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
}
