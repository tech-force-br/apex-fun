"use server";

import { cookies } from "next/headers";
import { compileFailTests } from "@/lib/compile-fail-tests";
import type {
  CompileFailMatch,
  CompileFailTest,
  ExerciseCard,
  HiddenTest,
} from "@/lib/curriculum";
import { curriculum } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";
import {
  MOCK_SESSION_COOKIE,
  parseMockSessionCookie,
  sessionIsAdmin,
} from "@/lib/mock-auth";
import { postToRunner } from "@/lib/runner";
import {
  scoreCompileFailPreview,
  scoreExercise,
  type ExerciseCheck,
} from "@/lib/score-run";

const MAX_SOURCE = 20_000;

const copy = {
  en: {
    passed: "Passed.",
    runnerDown: "The runner on this machine did not answer. Start it and try again.",
    signIn: "Sign in again to check this exercise.",
    missing: "This exercise is not in the saved curriculum.",
    needCheck: "Add check Apex before running this preview.",
    needMatch: "Add a compile-fail match before running this preview.",
    compiled: "This sample compiled, so this explanation would be skipped.",
    unmatched:
      "This sample failed to compile, and no match text on this test is in the error.",
  },
  "pt-BR": {
    passed: "Passou.",
    runnerDown: "O runner nesta máquina não respondeu. Inicie-o e tente de novo.",
    signIn: "Entre de novo para verificar este exercício.",
    missing: "Este exercício não está no currículo salvo.",
    needCheck: "Adicione o Apex de verificação antes de rodar esta prévia.",
    needMatch: "Adicione um texto de falha de compilação antes de rodar esta prévia.",
    compiled: "Este exemplo compilou, então esta explicação seria pulada.",
    unmatched:
      "Este exemplo não compilou, e nenhum texto deste teste está no erro.",
  },
} as const;

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "pt-BR";
}

async function signedIn() {
  const store = await cookies();
  return parseMockSessionCookie(store.get(MOCK_SESSION_COOKIE)?.value);
}

function withPassLabel(result: ExerciseCheck, locale: Locale): ExerciseCheck {
  if (result.unavailable) {
    return { ...result, message: copy[locale].runnerDown };
  }
  if (result.passed) {
    return { ...result, message: copy[locale].passed };
  }
  return result;
}

function findExercise(cardId: string): ExerciseCard | null {
  for (const moduleItem of curriculum) {
    for (const topic of moduleItem.topics) {
      for (const card of topic.cards) {
        if (card.type === "exercise" && card.id === cardId) return card;
      }
    }
  }
  return null;
}

function asText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  if (value.length > max) return null;
  return value;
}

function asMatches(value: unknown): CompileFailMatch[] | null {
  if (!Array.isArray(value) || value.length > 20) return null;
  const matches: CompileFailMatch[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const match = item as {
      id?: unknown;
      text?: unknown;
      messages?: { en?: unknown; "pt-BR"?: unknown };
    };
    const matchId = asText(match.id, 200);
    const text = asText(match.text, 2_000);
    const en = asText(match.messages?.en, 2_000);
    const pt = asText(match.messages?.["pt-BR"], 2_000);
    if (!matchId || text == null || en == null || pt == null) return null;
    matches.push({ id: matchId, text, messages: { en, "pt-BR": pt } });
  }
  return matches;
}

function asTest(value: unknown): HiddenTest | null {
  if (!value || typeof value !== "object") return null;
  const test = value as HiddenTest;
  const id = asText(test.id, 200);
  const checkApex = asText(test.checkApex, MAX_SOURCE);
  const previewCode = asText(test.previewCode, MAX_SOURCE);
  if (!id || checkApex == null || previewCode == null) return null;
  const en = asText(test.messages?.en, 2_000);
  const pt = asText(test.messages?.["pt-BR"], 2_000);
  if (en == null || pt == null) return null;
  return {
    id,
    checkApex,
    messages: { en, "pt-BR": pt },
    previewCode,
  };
}

function asCompileFailTest(value: unknown): CompileFailTest | null {
  if (!value || typeof value !== "object") return null;
  const test = value as CompileFailTest;
  const id = asText(test.id, 200);
  const previewCode = asText(test.previewCode, MAX_SOURCE);
  const matches = asMatches(test.matches);
  if (!id || previewCode == null || !matches) return null;
  return { id, previewCode, matches };
}

function asCompileFailList(value: unknown): CompileFailTest[] | null {
  if (!Array.isArray(value) || value.length > 40) return null;
  const tests: CompileFailTest[] = [];
  for (const item of value) {
    const test = asCompileFailTest(item);
    if (!test) return null;
    tests.push(test);
  }
  return tests;
}

function blocked(message: string): ExerciseCheck {
  return { passed: false, unavailable: true, message, log: "" };
}

export async function validateExercise(
  cardId: string,
  code: string,
  locale: Locale,
): Promise<ExerciseCheck> {
  const lang = isLocale(locale) ? locale : "en";
  const session = await signedIn();
  if (!session) return blocked(copy[lang].signIn);
  if (typeof cardId !== "string" || typeof code !== "string" || code.length > MAX_SOURCE) {
    return blocked(copy[lang].runnerDown);
  }

  const card = findExercise(cardId);
  if (!card) return blocked(copy[lang].missing);

  const result = await scoreExercise(
    compileFailTests,
    card.hiddenTests,
    code,
    lang,
    postToRunner,
  );
  return withPassLabel(result, lang);
}

export async function previewHiddenTest(
  input: unknown,
  compileFailInput: unknown,
  locale: Locale,
): Promise<ExerciseCheck> {
  const lang = isLocale(locale) ? locale : "en";
  const session = await signedIn();
  if (!session || !sessionIsAdmin(session)) return blocked(copy[lang].signIn);

  const test = asTest(input);
  const shared = asCompileFailList(compileFailInput);
  if (!test || !shared) return blocked(copy[lang].runnerDown);
  if (test.checkApex.trim().length === 0) {
    return blocked(copy[lang].needCheck);
  }

  const result = await scoreExercise(
    shared,
    [test],
    test.previewCode,
    lang,
    postToRunner,
  );
  return withPassLabel(result, lang);
}

export async function previewCompileFailTest(
  input: unknown,
  locale: Locale,
): Promise<ExerciseCheck> {
  const lang = isLocale(locale) ? locale : "en";
  const session = await signedIn();
  if (!session || !sessionIsAdmin(session)) return blocked(copy[lang].signIn);

  const test = asCompileFailTest(input);
  if (!test) return blocked(copy[lang].runnerDown);
  if (!test.matches.some((match) => match.text.trim().length > 0)) {
    return blocked(copy[lang].needMatch);
  }

  const result = await scoreCompileFailPreview(test, lang, postToRunner);
  if (result.kind === "unavailable") return blocked(copy[lang].runnerDown);
  if (result.kind === "compiled") {
    return {
      passed: false,
      unavailable: false,
      message: copy[lang].compiled,
      log: result.log,
    };
  }
  if (result.kind === "unmatched") {
    return {
      passed: false,
      unavailable: false,
      message: copy[lang].unmatched,
      log: result.log,
    };
  }
  return {
    passed: false,
    unavailable: false,
    message: result.message,
    log: result.log,
  };
}
