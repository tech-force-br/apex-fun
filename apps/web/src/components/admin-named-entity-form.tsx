"use client";

import { useState, type ReactNode } from "react";
import type { LocalizedText } from "@/lib/curriculum";
import { adminCopy } from "@/lib/admin-copy";
import type { ModuleDraft, SaveIssue, TopicDraft } from "@/lib/curriculum-store";
import {
  AdminFormActions,
  IssueList,
  LocalizedFields,
} from "@/components/admin-fields";
import { SegmentedControl } from "@/components/segmented-control";
import { useLocale } from "@/components/locale-provider";

function NamedEntityForm<T extends { names: LocalizedText }>({
  title,
  initial,
  issues,
  onDirty,
  onSave,
  onRemove,
  choice,
}: {
  title: string;
  initial: T;
  issues: SaveIssue[];
  onDirty: () => void;
  onSave: (draft: T) => void;
  onRemove?: () => void;
  choice: (draft: T, patch: (next: Partial<T>) => void) => ReactNode;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const [draft, setDraft] = useState(initial);

  function patch(next: Partial<T>) {
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
      <LocalizedFields
        enLabel={copy.nameEn}
        ptLabel={copy.namePt}
        value={draft.names}
        onChange={(names) => patch({ names } as Partial<T>)}
      />
      {choice(draft, patch)}
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

  return (
    <NamedEntityForm
      title={title}
      initial={initial}
      issues={issues}
      onDirty={onDirty}
      onSave={onSave}
      onRemove={onRemove}
      choice={(draft, patch) => (
        <div>
          <p className="text-sm text-muted">{copy.status}</p>
          <SegmentedControl
            className="mt-2"
            aria-label={copy.status}
            value={draft.status}
            onChange={(status) => patch({ status })}
            options={[
              { value: "open", label: copy.statusOpen },
              { value: "coming_later", label: copy.statusLater },
            ]}
          />
        </div>
      )}
    />
  );
}

export function AdminTopicForm({
  title,
  initial,
  issues,
  onDirty,
  onSave,
  onRemove,
}: {
  title: string;
  initial: TopicDraft;
  issues: SaveIssue[];
  onDirty: () => void;
  onSave: (draft: TopicDraft) => void;
  onRemove?: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  return (
    <NamedEntityForm
      title={title}
      initial={initial}
      issues={issues}
      onDirty={onDirty}
      onSave={onSave}
      onRemove={onRemove}
      choice={(draft, patch) => (
        <div>
          <p className="text-sm text-muted">{copy.topicKind}</p>
          <SegmentedControl
            className="mt-2"
            aria-label={copy.topicKind}
            value={draft.kind}
            onChange={(kind) => patch({ kind })}
            options={[
              { value: "theory", label: copy.kindTheory },
              { value: "exercises", label: copy.kindExercises },
            ]}
          />
        </div>
      )}
    />
  );
}
