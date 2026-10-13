"use client";

import { useId, useState } from "react";
import { CheckResult, RunSpinner } from "@/components/check-result";
import { useMockAuth } from "@/components/mock-auth-provider";
import { adminCopy } from "@/lib/admin-copy";
import { previewHiddenTest } from "@/lib/exercise-check-action";
import { syncSessionCookie } from "@/lib/mock-auth";
import type { ExerciseCheck } from "@/lib/score-run";
import {
  emptyHiddenTest,
  moveById,
  useCompileFailTests,
  type CardDraft,
  type ExerciseDraft,
  type SaveIssue,
  type TheoryDraft,
} from "@/lib/curriculum-store";
import type { HiddenTest } from "@/lib/curriculum";
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
  const { session } = useMockAuth();
  const compileFail = useCompileFailTests();
  const copy = adminCopy[locale];
  const [runningId, setRunningId] = useState<string | null>(null);
  const [previewResults, setPreviewResults] = useState<
    Record<string, ExerciseCheck>
  >({});
  const locked = runningId !== null;

  async function runPreview(test: HiddenTest) {
    if (locked) return;
    syncSessionCookie(session);
    setRunningId(test.id);
    try {
      const next = await previewHiddenTest(test, compileFail, locale);
      setPreviewResults((current) => ({ ...current, [test.id]: next }));
    } finally {
      setRunningId(null);
    }
  }

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

              <Field
                label={copy.checkApex}
                htmlFor={`${test.id}-check`}
                hint={copy.checkApexHelp}
              >
                <div className="mt-1.5">
                  <div
                    className={locked ? "pointer-events-none opacity-60" : undefined}
                    aria-busy={locked}
                  >
                    <CodeEditor
                      id={`${test.id}-check`}
                      key={`${test.id}-check`}
                      initialValue={test.checkApex}
                      readOnly={locked}
                      label={copy.checkApex}
                      minHeight="9rem"
                      onChange={(checkApex) =>
                        patchTest(index, { ...test, checkApex })
                      }
                    />
                  </div>
                </div>
              </Field>
              <LocalizedFields
                enLabel={copy.testMessageEn}
                ptLabel={copy.testMessagePt}
                value={test.messages}
                multiline
                rows={3}
                onChange={(messages) => patchTest(index, { ...test, messages })}
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
      </div>
    </>
  );
}

export function TestPreview({
  editorKey,
  previewCode,
  busy,
  locked,
  result,
  onChange,
  onRun,
}: {
  editorKey: string;
  previewCode: string;
  busy: boolean;
  locked: boolean;
  result: ExerciseCheck | undefined;
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
        <div
          className={`mt-1.5 ${locked ? "pointer-events-none opacity-60" : ""}`}
          aria-busy={locked}
        >
          <CodeEditor
            id={previewId}
            key={editorKey}
            initialValue={previewCode}
            readOnly={locked}
            label={copy.previewCode}
            minHeight="9rem"
            onChange={onChange}
          />
        </div>
      </Field>
      <button
        type="button"
        onClick={onRun}
        disabled={locked}
        aria-busy={busy}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-ink hover:bg-space"
      >
        {busy ? <RunSpinner /> : null}
        {busy ? copy.previewChecking : copy.previewRun}
      </button>
      {busy ? (
        <p className="text-sm text-muted" role="status">
          {copy.previewChecking}
        </p>
      ) : result ? (
        <CheckResult
          passed={result.passed}
          unavailable={result.unavailable}
          message={result.message}
          log={result.log}
          logLabel={copy.log}
        />
      ) : (
        <p className="text-sm text-muted" role="status">
          {copy.previewIdle}
        </p>
      )}
    </div>
  );
}
