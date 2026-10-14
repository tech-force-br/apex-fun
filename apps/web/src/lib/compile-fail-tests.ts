import type { CompileFailTest } from "@/lib/curriculum";

/**
 * Shared compile-fail explanations for every exercise.
 * Stored in code for now, the same way as the seed cards.
 * A refresh restores this list. The site does not invent match text.
 */
export const compileFailTests: CompileFailTest[] = [
  {
    id: "missing-semicolon",
    match: {
      id: "missing-semicolon",
      text: "missing ';'",
      messages: {
        en: "There is a semicolon (;) missing somewhere.",
        "pt-BR": "Tem um ponto e vírgula (;) faltando em algum lugar.",
      },
    },
    previewCode: "Integer seatCount = 3",
  },
];
