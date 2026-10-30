import type { ReactNode } from "react";
import Link from "next/link";
import { drillForward } from "@/components/study-drill-transition";
import { DoneCheck } from "@/components/study-status-mark";
import type { TopicRowState } from "@/lib/curriculum";

type TopicStatusCopy = {
  completed: string;
  locked: string;
  open: string;
  topicCardsDone: (percent: number) => string;
};

function FolderArt({ locked }: { locked?: boolean }) {
  return (
    <>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M3.75 6.5A1.75 1.75 0 0 1 5.5 4.75h3.1c.3 0 .58.14.76.38l.9 1.12h8.24A1.75 1.75 0 0 1 20.25 8v9.5A1.75 1.75 0 0 1 18.5 19.25h-13A1.75 1.75 0 0 1 3.75 17.5z" />
      </svg>
      {locked ? (
        <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-muted ring-1 ring-line">
          <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" aria-hidden>
            <rect
              x="3.5"
              y="7"
              width="9"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M5.25 7V5.25a2.75 2.75 0 0 1 5.5 0V7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : null}
    </>
  );
}

function folderTone(kind: TopicRowState["kind"]) {
  switch (kind) {
    case "done":
      return "bg-done-soft text-done";
    case "locked":
      return "border border-line bg-white text-muted";
    case "current":
    case "open":
      return "bg-highlight text-accent-deep";
  }
}

function FolderIcon({ kind }: { kind: TopicRowState["kind"] }) {
  const tone = folderTone(kind);

  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tone}`}
    >
      <FolderArt locked={kind === "locked"} />
    </span>
  );
}

/** Glyph only. The module stop supplies the card surface. */
export function FolderMark({
  active,
  locked,
  done,
}: {
  active?: boolean;
  locked?: boolean;
  done?: boolean;
}) {
  const tone = done ? "text-done" : active ? "text-accent-deep" : "text-muted";
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${tone}`}
    >
      <FolderArt locked={locked} />
    </span>
  );
}

type StudyActionProps = {
  locked: boolean;
  current?: boolean;
  href: string;
  label: string;
  className: string;
  children: ReactNode;
  /** Set on drill-in rows. Locked rows do not navigate. */
  transitionTypes?: string[];
};

function StudyAction({
  locked,
  current = false,
  href,
  label,
  className,
  children,
  transitionTypes,
}: StudyActionProps) {
  if (locked) {
    return (
      <button type="button" disabled className={className} aria-label={label}>
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} cursor-pointer`}
      aria-current={current ? "step" : undefined}
      aria-label={label}
      transitionTypes={transitionTypes}
    >
      {children}
    </Link>
  );
}

function EntryText({
  name,
  meta,
  locked,
}: {
  name: string;
  meta?: string;
  locked: boolean;
}) {
  return (
    <span className="min-w-0 flex-1">
      <span className={`block truncate font-medium ${locked ? "text-muted" : "text-ink"}`}>
        {name}
      </span>
      {meta ? <span className="mt-0.5 block text-xs text-muted">{meta}</span> : null}
    </span>
  );
}

function LockMark() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-muted">
      <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" aria-hidden>
        <rect
          x="3.25"
          y="7"
          width="9.5"
          height="6.5"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M5.25 7V5.25a2.75 2.75 0 0 1 5.5 0V7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function TopicStatus({ state }: { state: TopicRowState }) {
  switch (state.kind) {
    case "done":
      return <DoneCheck />;
    case "current":
      return (
        <span className="shrink-0 text-sm font-bold tabular-nums text-ink">
          {state.percent}%
        </span>
      );
    case "open":
    case "locked":
      return <LockMark />;
  }
}

function topicStatusLabel(state: TopicRowState, copy: TopicStatusCopy) {
  switch (state.kind) {
    case "done":
      return copy.completed;
    case "current":
      return copy.topicCardsDone(state.percent);
    case "locked":
      return copy.locked;
    case "open":
      return copy.open;
  }
}

type StudyEntryProps = {
  name: string;
  meta?: string;
  state: TopicRowState;
  accessibleLabel: string;
  copy: TopicStatusCopy;
  href: string;
};

function entryLabel(name: string, accessibleLabel: string, statusLabel: string) {
  return `${name}, ${accessibleLabel}, ${statusLabel}`;
}

function pathSurface(kind: TopicRowState["kind"]) {
  switch (kind) {
    case "locked":
      return "border-line bg-white";
    case "done":
      return "border-done bg-done-soft hover:border-done";
    case "current":
      return "border-accent bg-highlight hover:border-accent-deep";
    case "open":
      return "border-line bg-white hover:border-accent";
  }
}

/** Topic row. The icon sits on a line that runs toward the next topic. */
export function TopicPathRow({
  name,
  meta,
  state,
  accessibleLabel,
  copy,
  href,
  connectBelow = false,
}: StudyEntryProps & { connectBelow?: boolean }) {
  const locked = state.kind === "locked";

  return (
    <StudyAction
      locked={locked}
      current={state.kind === "current"}
      href={href}
      label={entryLabel(name, accessibleLabel, topicStatusLabel(state, copy))}
      className="flex w-full items-stretch gap-3 text-left"
      transitionTypes={drillForward}
    >
      <span className="flex w-12 shrink-0 flex-col items-center">
        <FolderIcon kind={state.kind} />
        {connectBelow ? <span aria-hidden className="mt-1.5 w-px flex-1 bg-line" /> : null}
      </span>
      <span
        className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition ${pathSurface(
          state.kind,
        )} ${connectBelow ? "mb-3" : ""}`}
      >
        <EntryText name={name} meta={meta} locked={locked} />
        <TopicStatus state={state} />
      </span>
    </StudyAction>
  );
}

/**
 * One module on the study map.
 * Modules are open, completed, or locked. There is no current module.
 */
export function ModuleStop({
  name,
  badge,
  accessibleLabel,
  locked,
  completed = false,
  href,
  leading,
}: {
  name: string;
  badge: string;
  accessibleLabel: string;
  locked: boolean;
  completed?: boolean;
  href: string;
  leading: ReactNode;
}) {
  const surface = locked
    ? "border-line bg-white"
    : completed
      ? "border-done bg-done-soft hover:border-done"
      : "border-line bg-white hover:border-accent";

  return (
    <StudyAction
      locked={locked}
      href={href}
      label={entryLabel(name, accessibleLabel, badge)}
      className={`relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border px-1.5 py-3 text-center transition sm:px-3 ${surface}`}
      transitionTypes={drillForward}
    >
      {leading}
      <span
        className={`block w-full text-xs font-medium leading-snug sm:text-sm ${
          locked ? "text-muted" : "text-ink"
        }`}
      >
        {name}
      </span>
      <span
        className={`max-w-full rounded-md px-1.5 py-1 text-center text-[10px] font-bold leading-tight sm:px-2 sm:text-xs ${
          completed
            ? "bg-done text-white"
            : locked
              ? "bg-space text-muted"
              : "bg-highlight text-accent-deep"
        }`}
      >
        {badge}
      </span>
    </StudyAction>
  );
}
