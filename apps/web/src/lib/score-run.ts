import type {
  CompileFailMatch,
  CompileFailTest,
  HiddenTest,
} from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";

/** What `POST /run` returns. The website decides pass/fail. */
export type RunnerBody = {
  compiled: boolean;
  clean: boolean;
  log: string;
  raw: string;
  error?: string;
};

export type ExerciseCheck = {
  passed: boolean;
  /** The runner did not produce a student result. Do not count it as a missed check. */
  unavailable: boolean;
  message: string;
  log: string;
};

export function glueProgram(student: string, check: string) {
  const studentText = student.replace(/\s+$/u, "");
  const studentLines =
    studentText.length === 0 ? 0 : studentText.split(/\r?\n/u).length;
  const checkText = check.replace(/^\s+/u, "").replace(/\s+$/u, "");
  const program =
    checkText.length === 0 ? studentText : `${studentText}\n${checkText}`;
  return { program, studentLines };
}

function errorLine(raw: string) {
  const named = raw.match(/line (\d+)/);
  if (named) return Number(named[1]);
  const anon = raw.match(/<anonymous>:(\d+)/);
  if (anon) return Number(anon[1]);
  return null;
}

/** A compile error on the student's lines, not inside the hidden check. */
function studentCompile(raw: string, studentLines: number) {
  if (studentLines <= 0) return false;
  const line = errorLine(raw);
  return line == null || line <= studentLines;
}

function missed(message: string, log: string): ExerciseCheck {
  return { passed: false, unavailable: false, message, log };
}

function unavailable(): ExerciseCheck {
  return { passed: false, unavailable: true, message: "", log: "" };
}

function compilePosition(line: string, position: string, locale: Locale) {
  if (locale === "pt-BR") {
    return `verificar linha ${line}, posição ${position}:`;
  }
  return `check line ${line}, position ${position}:`;
}

/**
 * One compiler position: `<anonymous>:1:20` or a bare `1:20`.
 * The position keeps every digit, so `14:32:01` is not a position.
 */
function firstCompilePosition(text: string) {
  const compilePositionPattern =
    /<anonymous>:(\d+):(\d+)(?!\d)(?!:\d)|(^|[^A-Za-z0-9_.])(\d+):(\d+)(?!\d)(?!:\d)/g;
  for (const match of text.matchAll(compilePositionPattern)) {
    const anonymous = match[1] != null;
    const prefix = match[3] ?? "";
    const index = match.index ?? 0;
    if (
      !anonymous &&
      prefix === ":" &&
      index > 0 &&
      /\d/.test(text[index - 1] ?? "")
    ) {
      continue;
    }
    return match;
  }
  return undefined;
}

/**
 * The compiler writes a position as `<anonymous>:1:20` or `1:20`.
 * That position is a line above the rest of the error.
 * The log stays the runner's error text, and matching still uses the raw compiler text.
 */
export function compilePositionMessage(text: string, locale: Locale) {
  const match = firstCompilePosition(text);
  if (!match || match.index == null) return text;
  const line = match[1] ?? match[4];
  const position = match[2] ?? match[5];
  if (!line || !position) return text;
  const prefixLength = match[1] != null ? 0 : (match[3] ?? "").length;
  const start = match.index + prefixLength;
  let end = match.index + match[0].length;
  if (text[end] === ":" && !/\d/.test(text[end + 1] ?? "")) end += 1;
  const error = `${text.slice(0, start)}${text.slice(end)}`
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  const heading = compilePosition(line, position, locale);
  return error.length > 0 ? `${heading}\n${error}` : heading;
}

/** First shared match whose text is contained in the compiler output. */
export function firstCompileMatch(
  tests: readonly CompileFailTest[],
  raw: string,
): CompileFailMatch | undefined {
  for (const test of tests) {
    const match = test.match;
    const text = match?.text.trim() ?? "";
    if (text.length > 0 && raw.includes(text)) return match;
  }
  return undefined;
}

export type CompileFailPreview =
  | { kind: "unavailable" }
  | { kind: "compiled"; log: string }
  | { kind: "matched"; message: string; log: string }
  | { kind: "unmatched"; log: string };

export async function scoreTest(
  test: HiddenTest,
  studentCode: string,
  locale: Locale,
  runApex: (apex: string) => Promise<RunnerBody>,
): Promise<ExerciseCheck> {
  const { program, studentLines } = glueProgram(studentCode, test.checkApex);
  let run: RunnerBody;
  try {
    run = await runApex(program);
  } catch {
    return unavailable();
  }
  if (run.error) return unavailable();

  if (run.clean) {
    return { passed: true, unavailable: false, message: "", log: run.log };
  }
  if (!run.compiled && studentCompile(run.raw, studentLines)) {
    return missed(compilePositionMessage(run.log, locale), run.log);
  }
  return missed(test.messages[locale]?.trim() ?? "", run.log);
}

/**
 * Compile the student snippet alone. A compile failure stops the check and
 * uses the shared list. Run-clean tests run only after that snippet compiles.
 *
 * When the snippet compiles, the card log stays that run's debug lines.
 * A hidden test can pass or fail without replacing them.
 */
export async function scoreExercise(
  compileFailTests: readonly CompileFailTest[],
  tests: readonly HiddenTest[],
  studentCode: string,
  locale: Locale,
  runApex: (apex: string) => Promise<RunnerBody>,
): Promise<ExerciseCheck> {
  let compileRun: RunnerBody;
  try {
    compileRun = await runApex(glueProgram(studentCode, "").program);
  } catch {
    return unavailable();
  }
  if (compileRun.error) return unavailable();

  if (!compileRun.compiled) {
    const match = firstCompileMatch(compileFailTests, compileRun.raw);
    if (match) {
      return missed(match.messages[locale]?.trim() ?? "", compileRun.log);
    }
    return missed(compilePositionMessage(compileRun.log, locale), compileRun.log);
  }

  const studentLog = compileRun.log;
  let last: ExerciseCheck = {
    passed: true,
    unavailable: false,
    message: "",
    log: studentLog,
  };
  for (const test of tests) {
    const scored = await scoreTest(test, studentCode, locale, runApex);
    if (scored.unavailable) return scored;
    last = { ...scored, log: studentLog };
    if (!last.passed) return last;
  }
  return last;
}

/** Compile one shared test's sample and see whether that test explains the error. */
export async function scoreCompileFailPreview(
  test: CompileFailTest,
  locale: Locale,
  runApex: (apex: string) => Promise<RunnerBody>,
): Promise<CompileFailPreview> {
  let run: RunnerBody;
  try {
    run = await runApex(glueProgram(test.previewCode, "").program);
  } catch {
    return { kind: "unavailable" };
  }
  if (run.error) return { kind: "unavailable" };
  if (run.compiled) return { kind: "compiled", log: run.log };
  const match = firstCompileMatch([test], run.raw);
  if (!match) return { kind: "unmatched", log: run.log };
  return {
    kind: "matched",
    message: match.messages[locale]?.trim() ?? "",
    log: run.log,
  };
}
