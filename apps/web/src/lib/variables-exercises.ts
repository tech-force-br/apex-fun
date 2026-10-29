import type { ExerciseCard, VariablesTopicId } from "@/lib/curriculum";

/**
 * Seed exercises. Run-clean check Apex stays English.
 * Each exercise topic starts with one example card. Mixed review checks two values.
 */
function exercise(
  id: string,
  en: string,
  pt: string,
  tests: ExerciseCard["hiddenTests"],
): ExerciseCard {
  return {
    id,
    type: "exercise",
    prompts: { en, "pt-BR": pt },
    hiddenTests: tests,
  };
}

function runClean(
  id: string,
  checkApex: string,
  en: string,
  pt: string,
  previewCode: string,
): ExerciseCard["hiddenTests"][number] {
  return {
    id,
    checkApex,
    messages: { en, "pt-BR": pt },
    previewCode,
  };
}

const seatCountPreview = "Integer seatCount = 3;";
const mixedPreview = [
  "Integer seatCount = 3;",
  "String label = 'Seats: ' + seatCount;",
].join("\n");

const integerSeatCount: ExerciseCard = exercise(
  "integer-seat-count",
  "Declare an Integer named seatCount and store 3.",
  "Declare um Integer chamado seatCount e guarde 3.",
  [
    runClean(
      "integer-seat-count-is-3",
      "if (seatCount != 3) {\n    System.assert(false);\n}",
      "seatCount needs to be an Integer with the value 3.",
      "seatCount precisa ser um Integer com o valor 3.",
      seatCountPreview,
    ),
  ],
);

const stringAccountName: ExerciseCard = exercise(
  "string-account-name",
  "Declare a String named accountName and store Acme.",
  "Declare uma String chamada accountName e guarde Acme.",
  [
    runClean(
      "string-account-name-is-acme",
      "if (accountName != 'Acme') {\n    System.assert(false);\n}",
      "accountName needs to be a String with the value Acme.",
      "accountName precisa ser uma String com o valor Acme.",
      "String accountName = 'Acme';",
    ),
  ],
);

const booleanIsActive: ExerciseCard = exercise(
  "boolean-is-active",
  "Declare a Boolean named isActive and store true.",
  "Declare um Boolean chamado isActive e guarde true.",
  [
    runClean(
      "boolean-is-active-is-true",
      "if (isActive != true) {\n    System.assert(false);\n}",
      "isActive needs to be a Boolean with the value true.",
      "isActive precisa ser um Boolean com o valor true.",
      "Boolean isActive = true;",
    ),
  ],
);

const decimalAmount: ExerciseCard = exercise(
  "decimal-amount",
  "Declare a Decimal named amount and store 19.99.",
  "Declare um Decimal chamado amount e guarde 19.99.",
  [
    runClean(
      "decimal-amount-is-19-99",
      "if (amount != 19.99) {\n    System.assert(false);\n}",
      "amount needs to be a Decimal with the value 19.99.",
      "amount precisa ser um Decimal com o valor 19.99.",
      "Decimal amount = 19.99;",
    ),
  ],
);

const dateCloseDate: ExerciseCard = exercise(
  "date-close-date",
  "Declare a Date named closeDate and store 15 March 2026.",
  "Declare uma Date chamada closeDate e guarde 15 de março de 2026.",
  [
    runClean(
      "date-close-date-is-15-march-2026",
      "if (closeDate != Date.newInstance(2026, 3, 15)) {\n    System.assert(false);\n}",
      "closeDate needs to be a Date for 15 March 2026.",
      "closeDate precisa ser uma Date de 15 de março de 2026.",
      "Date closeDate = Date.newInstance(2026, 3, 15);",
    ),
  ],
);

const concatenationPreview = [
  "String hello = 'Hello';",
  "String name = 'Ana';",
  "String greeting = hello + ' ' + name;",
].join("\n");

const concatenationGreeting: ExerciseCard = exercise(
  "concatenation-greeting",
  "Declare a String named hello and store Hello. Declare a String named name and store Ana. Then declare a String named greeting and store Hello Ana by joining hello, a space, and name.",
  "Declare uma String chamada hello e guarde Hello. Declare uma String chamada name e guarde Ana. Depois declare uma String chamada greeting e guarde Hello Ana, juntando hello, um espaço e name.",
  [
    runClean(
      "concatenation-hello-is-hello",
      "if (hello != 'Hello') {\n    System.assert(false);\n}",
      "hello needs to be a String with the value Hello.",
      "hello precisa ser uma String com o valor Hello.",
      concatenationPreview,
    ),
    runClean(
      "concatenation-name-is-ana",
      "if (name != 'Ana') {\n    System.assert(false);\n}",
      "name needs to be a String with the value Ana.",
      "name precisa ser uma String com o valor Ana.",
      concatenationPreview,
    ),
    runClean(
      "concatenation-greeting-is-hello-ana",
      "if (greeting != 'Hello Ana') {\n    System.assert(false);\n}",
      "greeting needs to be a String with the value Hello Ana.",
      "greeting precisa ser uma String com o valor Hello Ana.",
      concatenationPreview,
    ),
  ],
);

const mixedSeatLabel: ExerciseCard = exercise(
  "mixed-seat-label",
  "Declare an Integer named seatCount and store 3. Then declare a String named label and store Seats: 3 by joining Seats: with seatCount.",
  "Declare um Integer chamado seatCount e guarde 3. Depois declare uma String chamada label e guarde Seats: 3, juntando Seats: com seatCount.",
  [
    runClean(
      "mixed-seat-count-is-3",
      "if (seatCount != 3) {\n    System.assert(false);\n}",
      "seatCount needs to be an Integer with the value 3.",
      "seatCount precisa ser um Integer com o valor 3.",
      mixedPreview,
    ),
    runClean(
      "mixed-label-is-seats-3",
      "if (label != 'Seats: 3') {\n    System.assert(false);\n}",
      "label needs to be a String with the value Seats: 3.",
      "label precisa ser uma String com o valor Seats: 3.",
      mixedPreview,
    ),
  ],
);

/** One list per topic. Theory-only topics stay empty until an exercise is added. */
export const variablesExerciseCards: Record<VariablesTopicId, ExerciseCard[]> = {
  "what-a-variable-is": [],
  "naming-rules": [],
  declaring: [],
  assigning: [],
  "system-debug": [],
  integer: [integerSeatCount],
  string: [stringAccountName],
  boolean: [booleanIsActive],
  decimal: [decimalAmount],
  date: [dateCloseDate],
  concatenation: [concatenationGreeting],
  "mixed-review": [mixedSeatLabel],
};
