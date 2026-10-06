"use client";

import { useId, type ReactNode } from "react";
import type { LocalizedText } from "@/lib/curriculum";

export const fieldClassName =
  "mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none placeholder:text-muted/80 focus:border-accent focus:ring-2 focus:ring-accent/30";

export const textareaClassName = `${fieldClassName} min-h-32 resize-y`;

export const monoTextareaClassName = `${textareaClassName} font-mono text-sm`;

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-muted" htmlFor={htmlFor}>
      {label}
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      id={id}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClassName}
    />
  );
}

export function LocalizedFields({
  enLabel,
  ptLabel,
  value,
  onChange,
  multiline = false,
  rows,
}: {
  enLabel: string;
  ptLabel: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const enId = useId();
  const ptId = useId();

  return (
    <>
      <Field label={enLabel} htmlFor={enId}>
        {multiline ? (
          <TextArea
            id={enId}
            value={value.en}
            rows={rows}
            onChange={(en) => onChange({ ...value, en })}
          />
        ) : (
          <TextInput
            id={enId}
            value={value.en}
            onChange={(en) => onChange({ ...value, en })}
          />
        )}
      </Field>
      <Field label={ptLabel} htmlFor={ptId}>
        {multiline ? (
          <TextArea
            id={ptId}
            value={value["pt-BR"]}
            rows={rows}
            onChange={(pt) => onChange({ ...value, "pt-BR": pt })}
          />
        ) : (
          <TextInput
            id={ptId}
            value={value["pt-BR"]}
            onChange={(pt) => onChange({ ...value, "pt-BR": pt })}
          />
        )}
      </Field>
    </>
  );
}

export function TextArea({
  id,
  value,
  onChange,
  mono,
  rows,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className={mono ? monoTextareaClassName : textareaClassName}
      spellCheck={!mono}
    />
  );
}

export function AdminForm({
  title,
  issueMessages,
  saveLabel,
  removeLabel,
  onSave,
  onRemove,
  children,
}: {
  title: string;
  issueMessages: string[];
  saveLabel: string;
  removeLabel: string;
  onSave: () => void;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      {children}
      <IssueList messages={issueMessages} />
      <AdminFormActions
        saveLabel={saveLabel}
        removeLabel={removeLabel}
        onSave={onSave}
        onRemove={onRemove}
      />
    </form>
  );
}

export function AdminFormActions({
  saveLabel,
  removeLabel,
  onSave,
  onRemove,
}: {
  saveLabel: string;
  removeLabel: string;
  onSave: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onSave}
        className="cursor-pointer rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#014486]"
      >
        {saveLabel}
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer rounded-md border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink hover:bg-space"
        >
          {removeLabel}
        </button>
      ) : null}
    </div>
  );
}

export function IssueList({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <ul className="space-y-1 text-sm font-bold text-[#ba0517]" role="alert">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export function MoveButtons({
  upLabel,
  downLabel,
  onUp,
  onDown,
  disableUp,
  disableDown,
}: {
  upLabel: string;
  downLabel: string;
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  const btn =
    "cursor-pointer rounded-md border border-line bg-white px-1.5 py-0.5 text-xs text-muted hover:border-accent hover:text-ink disabled:opacity-40";
  return (
    <span className="flex shrink-0 gap-1">
      <button
        type="button"
        className={btn}
        aria-label={upLabel}
        disabled={disableUp}
        onClick={(event) => {
          event.stopPropagation();
          onUp();
        }}
      >
        ▲
      </button>
      <button
        type="button"
        className={btn}
        aria-label={downLabel}
        disabled={disableDown}
        onClick={(event) => {
          event.stopPropagation();
          onDown();
        }}
      >
        ▼
      </button>
    </span>
  );
}
