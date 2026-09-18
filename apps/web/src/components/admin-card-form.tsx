"use client";

import { useId, useState } from "react";
import { adminCopy } from "@/lib/admin-copy";
import {
  emptyHiddenTest,
  moveById,
  type CardDraft,
  type ExerciseDraft,
  type SaveIssue,
  type TheoryDraft,
} from "@/lib/curriculum-store";
import type { HiddenTest, HiddenTestMode } from "@/lib/curriculum";
import {
  AdminFormActions,
  Field,
  IssueList,
  MoveButtons,
  TextArea,
  TextInput,
} from "@/components/admin-fields";
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
  const [previewResult, setPreviewResult] = useState(copy.previewIdle);

  function setTheory(next: TheoryDraft) {
    onDirty();
    setDraft(next);
  }

  function setExercise(next: ExerciseDraft) {
    onDirty();
    setDraft(next);
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>

      {draft.type === "theory" ? (
        <TheoryFields draft={draft} onChange={setTheory} />
      ) : (
        <ExerciseFields
          draft={draft}
          previewResult={previewResult}
          onChange={setExercise}
          onPreview={() => setPreviewResult(copy.previewUnavailable)}
        />
      )}

      <IssueList messages={issues.map((issue) => copy.issue(issue))} />
      <AdminFormActions
        saveLabel={copy.save}
        removeLabel={copy.remove}
        onSave={() => onSave(draft)}
        onRemove={onRemove}
      />
    </form>
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
  const bodyEnId = useId();
  const bodyPtId = useId();
  const sampleId = useId();

  return (
    <>
      <Field label={copy.bodyEn} htmlFor={bodyEnId}>
        <TextArea
          id={bodyEnId}
          value={draft.bodies.en}
          rows={8}
          onChange={(en) =>
            onChange({ ...draft, bodies: { ...draft.bodies, en } })
          }
        />
      </Field>
      <Field label={copy.bodyPt} htmlFor={bodyPtId}>
        <TextArea
          id={bodyPtId}
          value={draft.bodies["pt-BR"]}
          rows={8}
          onChange={(pt) =>
            onChange({
              ...draft,
              bodies: { ...draft.bodies, "pt-BR": pt },
            })
          }
        />
      </Field>
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
                className="cursor-pointer rounded-lg border border-white/15 px-3 text-sm text-muted hover:text-ink"
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
          className="mt-2 cursor-pointer rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-xs font-medium text-muted hover:border-accent/40 hover:text-ink"
        >
          {copy.addImage}
        </button>
      </div>
    </>
  );
}

function ExerciseFields({
  draft,
  previewResult,
  onChange,
  onPreview,
}: {
  draft: ExerciseDraft;
  previewResult: string;
  onChange: (draft: ExerciseDraft) => void;
  onPreview: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const promptEnId = useId();
  const promptPtId = useId();
  const previewId = useId();

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
      <Field label={copy.promptEn} htmlFor={promptEnId}>
        <TextArea
          id={promptEnId}
          value={draft.prompts.en}
          rows={5}
          onChange={(en) =>
            onChange({ ...draft, prompts: { ...draft.prompts, en } })
          }
        />
      </Field>
      <Field label={copy.promptPt} htmlFor={promptPtId}>
        <TextArea
          id={promptPtId}
          value={draft.prompts["pt-BR"]}
          rows={5}
          onChange={(pt) =>
            onChange({
              ...draft,
              prompts: { ...draft.prompts, "pt-BR": pt },
            })
          }
        />
      </Field>

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
            className="cursor-pointer rounded-lg border border-dashed border-white/20 px-2.5 py-1 text-xs font-medium text-muted hover:border-accent/40 hover:text-ink"
          >
            {copy.addTest}
          </button>
        </div>

        <ol className="mt-3 space-y-4">
          {draft.hiddenTests.map((test, index) => (
            <li
              key={test.id}
              className="space-y-3 rounded-xl border border-white/10 bg-space/50 p-4"
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
                          onClick={() => patchTest(index, { ...test, mode })}
                          className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm ${
                            active
                              ? "bg-accent/15 text-accent ring-1 ring-accent/40"
                              : "border border-white/10 text-muted hover:text-ink"
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

              {test.mode === "compile_fail" ? (
                <Field
                  label={copy.compileMatch}
                  htmlFor={`${test.id}-match`}
                  hint={copy.compileMatchHelp}
                >
                  <TextInput
                    id={`${test.id}-match`}
                    value={test.compileFailMatch}
                    onChange={(compileFailMatch) =>
                      patchTest(index, { ...test, compileFailMatch })
                    }
                  />
                </Field>
              ) : null}

              <Field
                label={copy.testMessageEn}
                htmlFor={`${test.id}-msg-en`}
              >
                <TextArea
                  id={`${test.id}-msg-en`}
                  value={test.messages.en}
                  rows={3}
                  onChange={(en) =>
                    patchTest(index, {
                      ...test,
                      messages: { ...test.messages, en },
                    })
                  }
                />
              </Field>
              <Field
                label={copy.testMessagePt}
                htmlFor={`${test.id}-msg-pt`}
              >
                <TextArea
                  id={`${test.id}-msg-pt`}
                  value={test.messages["pt-BR"]}
                  rows={3}
                  onChange={(pt) =>
                    patchTest(index, {
                      ...test,
                      messages: { ...test.messages, "pt-BR": pt },
                    })
                  }
                />
              </Field>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-space/50 p-4">
        <h3 className="text-sm font-medium tracking-wide text-muted uppercase">
          {copy.preview}
        </h3>
        <p className="text-xs text-muted">{copy.previewHelp}</p>
        <Field label={copy.previewCode} htmlFor={previewId}>
          <TextArea
            id={previewId}
            value={draft.previewCode}
            mono
            rows={6}
            onChange={(previewCode) => onChange({ ...draft, previewCode })}
          />
        </Field>
        <button
          type="button"
          onClick={onPreview}
          className="cursor-pointer rounded-lg border border-white/15 bg-space px-3 py-2 text-sm font-medium text-ink hover:border-accent/40"
        >
          {copy.previewRun}
        </button>
        <p
          className="rounded-lg border border-white/10 bg-space px-3 py-2 font-mono text-xs text-muted"
          role="status"
        >
          {previewResult}
        </p>
      </div>
    </>
  );
}
