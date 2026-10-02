"use client";

import { useState } from "react";
import { adminCopy } from "@/lib/admin-copy";
import type { ModuleDraft, SaveIssue, TopicDraft } from "@/lib/curriculum-store";
import {
  AdminForm,
  LocalizedFields,
} from "@/components/admin-fields";
import { SegmentedControl } from "@/components/segmented-control";
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
  const [draft, setDraft] = useState(initial);

  function patch(next: Partial<ModuleDraft>) {
    onDirty();
    setDraft((current) => ({ ...current, ...next }));
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
      <LocalizedFields
        enLabel={copy.nameEn}
        ptLabel={copy.namePt}
        value={draft.names}
        onChange={(names) => patch({ names })}
      />
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
    </AdminForm>
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
  const [draft, setDraft] = useState(initial);

  function patch(next: Partial<TopicDraft>) {
    onDirty();
    setDraft((current) => ({ ...current, ...next }));
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
      <LocalizedFields
        enLabel={copy.nameEn}
        ptLabel={copy.namePt}
        value={draft.names}
        onChange={(names) => patch({ names })}
      />
    </AdminForm>
  );
}
