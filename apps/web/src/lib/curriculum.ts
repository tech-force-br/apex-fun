import type { Locale } from "@/lib/locale";

export type TopicKind = "theory" | "exercises";

export type TopicLock = "open" | "current" | "locked";

export type Topic = {
  id: string;
  names: Record<Locale, string>;
  kind: TopicKind;
  exerciseCount?: number;
};

export type CurriculumModule = {
  id: string;
  names: Record<Locale, string>;
  status: "open" | "coming_later";
  topics: Topic[];
};

export const curriculum: CurriculumModule[] = [
  {
    id: "variables",
    names: { en: "Variables", "pt-BR": "Variáveis" },
    status: "open",
    topics: [
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
    ],
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

/** Mock new-student progress: first Variables topic is current. */
export function mockTopicLock(
  moduleId: string,
  topicIndex: number,
): TopicLock {
  if (moduleId !== "variables") return "locked";
  if (topicIndex === 0) return "current";
  return "locked";
}
