"use client";

import type { ReactNode } from "react";

export const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-space px-3 py-2.5 text-ink outline-none placeholder:text-muted/70 focus:border-accent/70 focus:ring-2 focus:ring-accent/25";

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
        className="cursor-pointer rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-space"
      >
        {saveLabel}
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer rounded-lg border border-white/15 bg-space px-4 py-2.5 text-sm font-medium text-ink hover:border-accent/40"
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
    <ul className="space-y-1 text-sm text-red-300" role="alert">
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
    "cursor-pointer rounded-md border border-white/10 bg-space px-1.5 py-0.5 text-xs text-muted hover:border-accent/40 hover:text-ink disabled:opacity-40";
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
