import type { ReactNode } from "react";
import Link from "next/link";
import type { TopicLock } from "@/lib/curriculum";

export function lockBadge(
  lock: TopicLock,
  copy: { current: string; open: string; locked: string },
) {
  if (lock === "current") return copy.current;
  if (lock === "locked") return copy.locked;
  return copy.open;
}

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

/** Bordered folder used on the topic path. */
export function FolderIcon({
  active,
  locked,
}: {
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
        active ? "bg-highlight text-accent-deep" : "border border-line bg-white text-muted"
      }`}
    >
      <FolderArt locked={locked} />
    </span>
  );
}

/** Glyph only. The module stop supplies the card surface. */
export function FolderMark({
  active,
  locked,
}: {
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${
        active ? "text-accent-deep" : "text-muted"
      }`}
    >
      <FolderArt locked={locked} />
    </span>
  );
}

export function CardIndex({
  label,
  active,
  kind,
}: {
  label: string;
  active: boolean;
  kind: "theory" | "exercise";
}) {
  const tone = !active
    ? "border border-line bg-white text-muted"
    : kind === "exercise"
      ? "border border-accent bg-white text-accent"
      : "bg-highlight text-accent-deep";

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${tone}`}
    >
      {label}
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
};

function StudyAction({
  locked,
  current = false,
  href,
  label,
  className,
  children,
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

function EntryBadge({ badge, locked }: { badge: string; locked: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-md px-3 py-1 text-xs font-bold ${
        locked ? "bg-space text-muted" : "bg-highlight text-accent-deep"
      }`}
    >
      {badge}
    </span>
  );
}

type StudyEntryProps = {
  name: string;
  meta?: string;
  badge: string;
  accessibleLabel: string;
  lock: TopicLock;
  href: string;
  leading: ReactNode;
};

function entryLabel(name: string, accessibleLabel: string) {
  return `${name}, ${accessibleLabel}`;
}

function pathSurface(locked: boolean, current: boolean) {
  if (locked) return "border-line bg-white";
  if (current) return "border-accent bg-highlight hover:border-accent-deep";
  return "border-line bg-white hover:border-accent";
}

/** Topic row. The icon sits on a line that runs toward the next topic. */
export function TopicPathRow({
  name,
  meta,
  badge,
  accessibleLabel,
  lock,
  href,
  leading,
  connectBelow = false,
}: StudyEntryProps & { connectBelow?: boolean }) {
  const locked = lock === "locked";
  const current = lock === "current";

  return (
    <StudyAction
      locked={locked}
      current={current}
      href={href}
      label={entryLabel(name, accessibleLabel)}
      className="flex w-full items-stretch gap-3 text-left"
    >
      <span className="flex w-12 shrink-0 flex-col items-center">
        {leading}
        {connectBelow ? <span aria-hidden className="mt-1.5 w-px flex-1 bg-line" /> : null}
      </span>
      <span
        className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 py-3 transition ${pathSurface(
          locked,
          current,
        )} ${connectBelow ? "mb-3" : ""}`}
      >
        <EntryText name={name} meta={meta} locked={locked} />
        <EntryBadge badge={badge} locked={locked} />
      </span>
    </StudyAction>
  );
}

/** Card row inside the topic's single bordered list. */
export function CardSheetRow({
  name,
  meta,
  badge,
  accessibleLabel,
  lock,
  href,
  leading,
}: StudyEntryProps) {
  const locked = lock === "locked";
  const current = lock === "current";
  const surface = locked
    ? "bg-white"
    : current
      ? "bg-highlight shadow-[inset_3px_0_0_var(--color-accent)]"
      : "bg-white hover:bg-highlight";

  return (
    <StudyAction
      locked={locked}
      current={current}
      href={href}
      label={entryLabel(name, accessibleLabel)}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${surface}`}
    >
      {leading}
      <EntryText name={name} meta={meta} locked={locked} />
      <EntryBadge badge={badge} locked={locked} />
    </StudyAction>
  );
}

/**
 * One module on the study map.
 * Modules are open or locked. There is no current module.
 */
export function ModuleStop({
  name,
  badge,
  accessibleLabel,
  locked,
  href,
  leading,
}: {
  name: string;
  badge: string;
  accessibleLabel: string;
  locked: boolean;
  href: string;
  leading: ReactNode;
}) {
  const surface = locked
    ? "border-line bg-white"
    : "border-line bg-white hover:border-accent";

  return (
    <StudyAction
      locked={locked}
      href={href}
      label={entryLabel(name, accessibleLabel)}
      className={`relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border px-1.5 py-3 text-center transition sm:px-3 ${surface}`}
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
          locked ? "bg-space text-muted" : "bg-highlight text-accent-deep"
        }`}
      >
        {badge}
      </span>
    </StudyAction>
  );
}
