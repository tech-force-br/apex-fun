"use client";

import { useState } from "react";
import { TestPreview } from "@/components/admin-card-form";
import {
  AdminForm,
  Field,
  LocalizedFields,
  MoveButtons,
  TextInput,
} from "@/components/admin-fields";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { adminCopy } from "@/lib/admin-copy";
import type { CompileFailMatch, CompileFailTest } from "@/lib/curriculum";
import {
  emptyCompileFailTest,
  emptyCompileMatch,
  moveById,
  type SaveIssue,
} from "@/lib/curriculum-store";
import { previewCompileFailTest } from "@/lib/exercise-check-action";
import { syncSessionCookie } from "@/lib/mock-auth";
import type { ExerciseCheck } from "@/lib/score-run";

export function AdminCompileFailForm({
  initial,
  issues,
  onDirty,
  onSave,
}: {
  initial: CompileFailTest[];
  issues: SaveIssue[];
  onDirty: () => void;
  onSave: (draft: CompileFailTest[]) => void;
}) {
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = adminCopy[locale];
  const [tests, setTests] = useState(initial);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [previewResults, setPreviewResults] = useState<
    Record<string, ExerciseCheck>
  >({});
  const locked = runningId !== null;

  function update(next: CompileFailTest[]) {
    onDirty();
    setTests(next);
  }

  function patchTest(index: number, next: CompileFailTest) {
    const copyTests = tests.slice();
    copyTests[index] = next;
    update(copyTests);
  }

  async function runPreview(test: CompileFailTest) {
    if (locked) return;
    syncSessionCookie(session);
    setRunningId(test.id);
    try {
      const next = await previewCompileFailTest(test, locale);
      setPreviewResults((current) => ({ ...current, [test.id]: next }));
    } finally {
      setRunningId(null);
    }
  }

  return (
    <AdminForm
      title={copy.compileFailTests}
      issueMessages={issues.map((issue) => copy.issue(issue))}
      saveLabel={copy.save}
      removeLabel={copy.remove}
      onSave={() => onSave(tests)}
    >
      <p className="text-sm text-muted">{copy.compileFailIntro}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => update([...tests, emptyCompileFailTest()])}
          className="cursor-pointer rounded-md border border-dashed border-line bg-white px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-ink"
        >
          {copy.addCompileFail}
        </button>
      </div>
      {tests.length === 0 ? (
        <p className="text-sm text-muted">{copy.compileFailEmpty}</p>
      ) : (
        <ol className="space-y-4">
          {tests.map((test, index) => (
            <li
              key={test.id}
              className="space-y-3 rounded-lg border border-line bg-space p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  {copy.compileFailN(index + 1)}
                </p>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    upLabel={copy.moveUp}
                    downLabel={copy.moveDown}
                    disableUp={index === 0}
                    disableDown={index === tests.length - 1}
                    onUp={() => update(moveById(tests, test.id, -1))}
                    onDown={() => update(moveById(tests, test.id, 1))}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update(tests.filter((item) => item.id !== test.id))
                    }
                    className="cursor-pointer text-xs text-muted hover:text-ink"
                  >
                    {copy.remove}
                  </button>
                </div>
              </div>
              <MatchSets
                test={test}
                onChange={(matches) => patchTest(index, { ...test, matches })}
              />
              <TestPreview
                editorKey={test.id}
                previewCode={test.previewCode}
                busy={runningId === test.id}
                locked={locked}
                result={previewResults[test.id]}
                onChange={(previewCode) =>
                  patchTest(index, { ...test, previewCode })
                }
                onRun={() => void runPreview(test)}
              />
            </li>
          ))}
        </ol>
      )}
    </AdminForm>
  );
}

function MatchSets({
  test,
  onChange,
}: {
  test: CompileFailTest;
  onChange: (matches: CompileFailMatch[]) => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  function patchMatch(index: number, next: CompileFailMatch) {
    const matches = test.matches.slice();
    matches[index] = next;
    onChange(matches);
  }

  return (
    <div className="space-y-3">
      {test.matches.map((match, index) => (
        <div
          key={match.id}
          className="space-y-3 rounded-md border border-line bg-white p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">{copy.matchN(index + 1)}</p>
            <button
              type="button"
              onClick={() =>
                onChange(test.matches.filter((item) => item.id !== match.id))
              }
              className="cursor-pointer text-xs text-muted hover:text-ink"
            >
              {copy.remove}
            </button>
          </div>
          <Field
            label={copy.compileMatch}
            htmlFor={`${match.id}-match`}
            hint={copy.compileMatchHelp}
          >
            <TextInput
              id={`${match.id}-match`}
              value={match.text}
              onChange={(text) => patchMatch(index, { ...match, text })}
            />
          </Field>
          <LocalizedFields
            enLabel={copy.testMessageEn}
            ptLabel={copy.testMessagePt}
            value={match.messages}
            multiline
            rows={3}
            onChange={(messages) => patchMatch(index, { ...match, messages })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...test.matches, emptyCompileMatch()])}
        className="cursor-pointer rounded-md border border-dashed border-line bg-white px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-ink"
      >
        {copy.addMatch}
      </button>
    </div>
  );
}
