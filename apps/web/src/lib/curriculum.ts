import type { Locale } from "@/lib/locale";

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
  exerciseCount?: number;
  cards: Card[];
};

export type CurriculumModule = {
  id: string;
  names: LocalizedText;
  status: ModuleStatus;
  topics: Topic[];
};

const variablesTopics: Omit<Topic, "cards">[] = [
  {
    id: "what-a-variable-is",
    names: {
      en: "What a variable is",
      "pt-BR": "O que é uma variável",
    },
    kind: "theory",
  },
  {
    id: "naming-rules",
    names: { en: "Naming rules", "pt-BR": "Regras de nomes" },
    kind: "theory",
  },
  {
    id: "declaring",
    names: { en: "Declaring", "pt-BR": "Declaração" },
    kind: "theory",
  },
  {
    id: "assigning",
    names: { en: "Assigning", "pt-BR": "Atribuição" },
    kind: "theory",
  },
  {
    id: "system-debug",
    names: { en: "System.debug", "pt-BR": "System.debug" },
    kind: "theory",
  },
  {
    id: "integer",
    names: { en: "Integer", "pt-BR": "Integer" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "string",
    names: { en: "String", "pt-BR": "String" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "boolean",
    names: { en: "Boolean", "pt-BR": "Boolean" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "decimal",
    names: { en: "Decimal", "pt-BR": "Decimal" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "date",
    names: { en: "Date", "pt-BR": "Date" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "concatenation",
    names: { en: "Concatenation", "pt-BR": "Concatenação" },
    kind: "exercises",
    exerciseCount: 10,
  },
  {
    id: "mixed-review",
    names: { en: "Mixed review", "pt-BR": "Revisão mista" },
    kind: "exercises",
    exerciseCount: 50,
  },
];

export const curriculum: CurriculumModule[] = [
  {
    id: "variables",
    names: { en: "Variables", "pt-BR": "Variáveis" },
    status: "open",
    topics: variablesTopics.map((topic) => ({ ...topic, cards: [] })),
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

export function topicExerciseCount(topic: Topic) {
  const fromCards = topic.cards.filter((card) => card.type === "exercise")
    .length;
  if (fromCards > 0) return fromCards;
  return topic.exerciseCount ?? 0;
}

/** Mock new-student progress: first topic in an open module is current. */
export function mockTopicLock(
  status: ModuleStatus,
  topicIndex: number,
): TopicLock {
  if (status !== "open") return "locked";
  if (topicIndex === 0) return "current";
  return "locked";
}

export function cardLabel(card: Card) {
  const text =
    card.type === "theory" ? card.bodies.en : card.prompts.en;
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return card.type === "theory" ? "Theory card" : "Exercise card";
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
}
