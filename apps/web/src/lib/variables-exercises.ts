import type { ExerciseCard } from "@/lib/curriculum";

const passingPreview = "Integer seatCount = 3;";

/**
 * Seed exercises. Run-clean check Apex stays English.
 * Integer starts with one card: declare seatCount and store 3.
 */
export const integerSeatCount: ExerciseCard = {
  id: "integer-seat-count",
  type: "exercise",
  prompts: {
    en: "Declare an Integer named seatCount and store 3.\n\nWrite the type, the name, and the number on one line.",
    "pt-BR":
      "Declare um Integer chamado seatCount e guarde 3.\n\nEscreva o tipo, o nome e o número na mesma linha.",
  },
  hiddenTests: [
    {
      id: "integer-seat-count-declared",
      mode: "compile_fail",
      checkApex: "",
      matches: [
        {
          id: "integer-seat-count-duplicate",
          text: "Duplicate variable: seatCount",
          messages: {
            en: "Declare an Integer named seatCount.",
            "pt-BR": "Declare um Integer chamado seatCount.",
          },
        },
      ],
      messages: { en: "", "pt-BR": "" },
      previewCode: passingPreview,
    },
    {
      id: "integer-seat-count-is-3",
      mode: "run_clean",
      checkApex: "if (seatCount != 3) {\n    System.assert(false);\n}",
      matches: [],
      messages: {
        en: "seatCount needs to be an Integer with the value 3.",
        "pt-BR": "seatCount precisa ser um Integer com o valor 3.",
      },
      previewCode: passingPreview,
    },
  ],
};
