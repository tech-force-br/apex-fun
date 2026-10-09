"use client";

import { useId, useState } from "react";
import { adminCopy } from "@/lib/admin-copy";
import {
  emptyCompileMatch,
  emptyHiddenTest,
  moveById,
  type CardDraft,
  type ExerciseDraft,
  type SaveIssue,
  type TheoryDraft,
} from "@/lib/curriculum-store";
import type {
  CompileFailMatch,
  HiddenTest,
  HiddenTestMode,
} from "@/lib/curriculum";
import {
  AdminForm,
  Field,
  LocalizedFields,
  MoveButtons,
  TextArea,
  TextInput,
} from "@/components/admin-fields";
import { CodeEditor } from "@/components/code-editor";
import { useLocale } from "@/components/locale-provider";

export function AdminCardForm({
  title,
  initial,
  issues,
  onDirty,
  onSave,
  onRemove,
}: {
  title: string;
  initial: CardDraft;
  issues: SaveIssue[];
  onDirty: () => void;
  onSave: (draft: CardDraft) => void;
  onRemove?: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const [draft, setDraft] = useState(initial);

  function setTheory(next: TheoryDraft) {
    onDirty();
    setDraft(next);
  }

  function setExercise(next: ExerciseDraft) {
    onDirty();
    setDraft(next);
  }

  return (
    <AdminForm
      title={title}
      issueMessages={issues.map((issue) => copy.issue(issue))}
      saveLabel={copy.save}
      removeLabel={copy.remove}
      onSave={() => onSave(draft)}
      onRemove={onRemove}
    >
      {draft.type === "theory" ? (
        <TheoryFields draft={draft} onChange={setTheory} />
      ) : (
        <ExerciseFields draft={draft} onChange={setExercise} />
      )}
    </AdminForm>
  );
}

function TheoryFields({
  draft,
  onChange,
}: {
  draft: TheoryDraft;
  onChange: (draft: TheoryDraft) => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const sampleId = useId();

  return (
    <>
      <LocalizedFields
        enLabel={copy.bodyEn}
        ptLabel={copy.bodyPt}
        value={draft.bodies}
        multiline
        rows={8}
        onChange={(bodies) => onChange({ ...draft, bodies })}
      />
      <Field label={copy.sampleApex} htmlFor={sampleId} hint={copy.sampleApexHelp}>
        <TextArea
          id={sampleId}
          value={draft.sampleApex}
          mono
          rows={6}
          onChange={(sampleApex) => onChange({ ...draft, sampleApex })}
        />
      </Field>

      <div>
        <p className="text-sm text-muted">{copy.imageRefs}</p>
        <ul className="mt-2 space-y-2">
          {draft.imageRefs.map((ref, index) => (
            <li key={`image-${index}`} className="flex gap-2">
              <TextInput
                id={`image-${index}`}
                value={ref}
                placeholder={copy.imageUrl}
                ariaLabel={copy.imageUrl}
                onChange={(value) => {
                  const imageRefs = draft.imageRefs.slice();
                  imageRefs[index] = value;
                  onChange({ ...draft, imageRefs });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    imageRefs: draft.imageRefs.filter((_, i) => i !== index),
                  })
                }
                className="cursor-pointer rounded-md border border-line bg-white px-3 text-sm font-bold text-muted hover:text-ink"
              >
                {copy.remove}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            onChange({ ...draft, imageRefs: [...draft.imageRefs, ""] })
          }
          className="mt-2 cursor-pointer rounded-md border border-dashed border-line bg-white px-3 py-1.5 text-xs font-bold text-muted hover:border-accent hover:text-ink"
        >
          {copy.addImage}
        </button>
      </div>
    </>
  );
}

function ExerciseFields({
  draft,
  onChange,
}: {
  draft: ExerciseDraft;
  onChange: (draft: ExerciseDraft) => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const [previewResults, setPreviewResults] = useState<Record<string, string>>(
    {},
  );

  function patchTest(index: number, next: HiddenTest) {
    const hiddenTests = draft.hiddenTests.slice();
    hiddenTests[index] = next;
    onChange({ ...draft, hiddenTests });
  }

  function moveTest(id: string, direction: -1 | 1) {
    onChange({
      ...draft,
      hiddenTests: moveById(draft.hiddenTests, id, direction),
    });
  }

  function setMode(index: number, test: HiddenTest, mode: HiddenTestMode) {
    const matches =
      mode === "compile_fail" && test.matches.length === 0
        ? [emptyCompileMatch()]
        : test.matches;
    patchTest(index, { ...test, mode, matches });
  }

  return (
    <>
      <LocalizedFields
        enLabel={copy.promptEn}
        ptLabel={copy.promptPt}
        value={draft.prompts}
        multiline
        rows={5}
        onChange={(prompts) => onChange({ ...draft, prompts })}
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium tracking-wide text-muted uppercase">
            {copy.hiddenTests}
          </h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                hiddenTests: [...draft.hiddenTests, emptyHiddenTest()],
              })
            }
            className="cursor-pointer rounded-md border border-dashed border-line bg-white px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-ink"
          >
            {copy.addTest}
          </button>
        </div>

        <ol className="mt-3 space-y-4">
          {draft.hiddenTests.map((test, index) => (
            <li
              key={test.id}
              className="space-y-3 rounded-lg border border-line bg-space p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">
                  {copy.testN(index + 1)}
                </p>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    upLabel={copy.moveUp}
                    downLabel={copy.moveDown}
                    disableUp={index === 0}
                    disableDown={index === draft.hiddenTests.length - 1}
                    onUp={() => moveTest(test.id, -1)}
                    onDown={() => moveTest(test.id, 1)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...draft,
                        hiddenTests: draft.hiddenTests.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="cursor-pointer text-xs text-muted hover:text-ink"
                  >
                    {copy.remove}
                  </button>
                </div>
              </div>

              <fieldset>
                <legend className="text-sm text-muted">{copy.testMode}</legend>
                <div className="mt-2 grid gap-2">
                  {(["run_clean", "compile_fail"] as HiddenTestMode[]).map(
                    (mode) => {
                      const active = test.mode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setMode(index, test, mode)}
                          className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm font-bold ${
                            active
                              ? "bg-highlight text-accent-deep ring-1 ring-accent"
                              : "border border-line bg-white text-muted hover:text-ink"
                          }`}
                        >
                          {mode === "run_clean"
                            ? copy.modeRunClean
                            : copy.modeCompileFail}
                        </button>
                      );
                    },
                  )}
                </div>
              </fieldset>

              {test.mode === "run_clean" ? (
                <>
                  <Field
                    label={copy.checkApex}
                    htmlFor={`${test.id}-check`}
                    hint={copy.checkApexHelp}
                  >
                    <TextArea
                      id={`${test.id}-check`}
                      value={test.checkApex}
                      mono
                      rows={5}
                      onChange={(checkApex) =>
                        patchTest(index, { ...test, checkApex })
                      }
                    />
                  </Field>
                  <LocalizedFields
                    enLabel={copy.testMessageEn}
                    ptLabel={copy.testMessagePt}
                    value={test.messages}
                    multiline
                    rows={3}
                    onChange={(messages) =>
                      patchTest(index, { ...test, messages })
                    }
                  />
                </>
              ) : (
                <CompileMatchSets
                  test={test}
                  onChange={(matches) => patchTest(index, { ...test, matches })}
                />
              )}

              <TestPreview
                test={test}
                result={previewResults[test.id] ?? copy.previewIdle}
                onChange={(previewCode) =>
                  patchTest(index, { ...test, previewCode })
                }
                onRun={() =>
                  setPreviewResults((current) => ({
                    ...current,
                    [test.id]: copy.previewUnavailable,
                  }))
                }
              />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function CompileMatchSets({
  test,
  onChange,
}: {
  test: HiddenTest;
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

function TestPreview({
  test,
  result,
  onChange,
  onRun,
}: {
  test: HiddenTest;
  result: string;
  onChange: (previewCode: string) => void;
  onRun: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const previewId = useId();

  return (
    <div className="space-y-3 rounded-md border border-line bg-white p-3">
      <h4 className="text-sm font-medium tracking-wide text-muted uppercase">
        {copy.preview}
      </h4>
      <p className="text-xs text-muted">{copy.previewHelp}</p>
      <Field label={copy.previewCode} htmlFor={previewId}>
        <div className="mt-1.5">
          <CodeEditor
            id={previewId}
            key={test.id}
            initialValue={test.previewCode}
            label={copy.previewCode}
            minHeight="9rem"
            onChange={onChange}
          />
        </div>
      </Field>
      <button
        type="button"
        onClick={onRun}
        className="cursor-pointer rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-ink hover:bg-space"
      >
        {copy.previewRun}
      </button>
      <p
        className="rounded-md border border-line bg-white px-3 py-2 font-mono text-xs text-muted"
        role="status"
      >
        {result}
      </p>
    </div>
  );
}
