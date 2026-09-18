"use client";

import { useId, useState } from "react";
import { adminCopy } from "@/lib/admin-copy";
import type { ModuleDraft, SaveIssue } from "@/lib/curriculum-store";
import {
  AdminFormActions,
  Field,
  IssueList,
  TextInput,
} from "@/components/admin-fields";
import { useLocale } from "@/components/locale-provider";

export function AdminModuleForm({
  title,
  initial,
  issues,
  onDirty,
  onSave,
  onRemove,
}: {
  title: string;
  initial: ModuleDraft;
  issues: SaveIssue[];
  onDirty: () => void;
  onSave: (draft: ModuleDraft) => void;
  onRemove?: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const nameEnId = useId();
  const namePtId = useId();
  const [draft, setDraft] = useState(initial);

  function patch(next: Partial<ModuleDraft>) {
    onDirty();
    setDraft((current) => ({ ...current, ...next }));
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

      <Field label={copy.nameEn} htmlFor={nameEnId}>
        <TextInput
          id={nameEnId}
          value={draft.names.en}
          onChange={(en) => patch({ names: { ...draft.names, en } })}
        />
      </Field>
      <Field label={copy.namePt} htmlFor={namePtId}>
        <TextInput
          id={namePtId}
          value={draft.names["pt-BR"]}
          onChange={(pt) =>
            patch({ names: { ...draft.names, "pt-BR": pt } })
          }
        />
      </Field>

      <fieldset>
        <legend className="text-sm text-muted">{copy.status}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["open", "coming_later"] as const).map((status) => {
            const active = draft.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => patch({ status })}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-accent text-space"
                    : "border border-white/15 text-muted hover:text-ink"
                }`}
              >
                {status === "open" ? copy.statusOpen : copy.statusLater}
              </button>
            );
          })}
        </div>
      </fieldset>

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
