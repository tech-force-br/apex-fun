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

/** First shared match whose text is contained in the compiler output. */
export function firstCompileMatch(
  tests: readonly CompileFailTest[],
  raw: string,
): CompileFailMatch | undefined {
  for (const test of tests) {
    for (const match of test.matches) {
      const text = match.text.trim();
      if (text.length > 0 && raw.includes(text)) return match;
    }
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
    return missed(run.log, run.log);
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
    return missed(compileRun.log, compileRun.log);
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
