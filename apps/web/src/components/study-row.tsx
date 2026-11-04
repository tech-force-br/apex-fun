import type { ReactNode } from "react";
import Link from "next/link";
import { ModuleIcon, StudyGlyph } from "@/components/study-marks";
import { drillForward } from "@/components/study-drill-transition";
import { DoneCheck, LockIcon } from "@/components/study-status-mark";
import type { TopicRowState } from "@/lib/curriculum";
import type { ModuleStopState } from "@/lib/module-stop";

type TopicStatusCopy = {
  completed: string;
  locked: string;
  open: string;
  topicCardsDone: (percent: number) => string;
};

function folderTone(kind: TopicRowState["kind"]) {
  switch (kind) {
    case "done":
      return "bg-done-soft text-done";
    case "locked":
      return "bg-locked text-muted";
    case "current":
      return "bg-white text-accent-deep";
    case "open":
      return "bg-locked text-accent-deep";
  }
}

function FolderIcon({ mark, kind }: { mark: string; kind: TopicRowState["kind"] }) {
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${folderTone(kind)} ${
        kind === "current" ? "study-module-shadow" : ""
      }`}
    >
      <StudyGlyph mark={mark} />
    </span>
  );
}

/** Subject glyph for one module. The stop supplies the card surface. */
export function ModuleGlyph({
  moduleId,
  state,
}: {
  moduleId: string;
  state: ModuleStopState;
}) {
  const locked = state.kind === "later" && state.locked;
  const tone =
    state.kind === "done"
      ? "text-done"
      : locked
        ? "text-muted"
        : "text-accent-deep";
  return (
    <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${tone}`}>
      <ModuleIcon moduleId={moduleId} />
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
      <button type="button" disabled className={`${className} study-lock-cursor`} aria-label={label}>
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
      return <LockIcon />;
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
  mark: string;
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
      return "border-line bg-locked";
    case "done":
      return "border-done bg-done-soft hover:border-done";
    case "current":
      return "border-line bg-white hover:border-accent";
    case "open":
      return "border-line bg-locked hover:border-accent";
  }
}

/**
 * Topic row. The icon and card of the current topic ease up and down together.
 * A shadow sits under both. The line toward the next topic stays still.
 */
export function TopicPathRow({
  name,
  meta,
  mark,
  state,
  accessibleLabel,
  copy,
  href,
  connectBelow = false,
}: StudyEntryProps & { connectBelow?: boolean }) {
  const locked = state.kind === "locked";
  const current = state.kind === "current";

  return (
    <div className={`relative ${connectBelow ? "mb-3" : ""}`}>
      {connectBelow ? (
        <span
          aria-hidden
          className="absolute top-[2.875rem] bottom-0 left-6 w-px -translate-x-1/2 bg-line"
        />
      ) : null}
      <div
        className={`flex w-full items-stretch gap-3 text-left ${
          current ? "study-module-float" : ""
        }`}
      >
        <span className="flex w-12 shrink-0 justify-center">
          <FolderIcon mark={mark} kind={state.kind} />
        </span>
        <StudyAction
          locked={locked}
          current={current}
          href={href}
          label={entryLabel(name, accessibleLabel, topicStatusLabel(state, copy))}
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${pathSurface(
            state.kind,
          )} ${current ? "study-module-shadow" : ""}`}
          transitionTypes={drillForward}
        >
          <EntryText name={name} meta={meta} locked={locked} />
          <TopicStatus state={state} />
        </StudyAction>
      </div>
    </div>
  );
}

type ModuleStatusCopy = {
  completed: string;
  comingLater: string;
  moduleTopicsDone: (percent: number) => string;
};

export type ModuleStopConnector = "left" | "right" | "down";

/** Small chevron on the dotted path. A page-colored understroke keeps the dots readable. */
function MapArrow({ direction }: { direction: ModuleStopConnector }) {
  const turn = direction === "down" ? "rotate-90" : direction === "left" ? "rotate-180" : "";
  return (
    <svg
      viewBox="0 0 12 12"
      className={`pointer-events-none absolute top-1/2 left-1/2 z-[1] size-2 -translate-x-1/2 -translate-y-1/2 text-accent sm:size-2.5 ${turn}`}
      fill="none"
    >
      <path
        d="M3.2 1.8 8.4 6 3.2 10.2"
        stroke="var(--color-space)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.2 1.8 8.4 6 3.2 10.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapDots({
  axis,
  direction,
  className,
}: {
  axis: "x" | "y";
  direction: ModuleStopConnector;
  className: string;
}) {
  const horizontal = axis === "x";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--color-accent) 1.5px, transparent 1.7px)",
        backgroundSize: horizontal ? "7px 4px" : "4px 7px",
        backgroundRepeat: horizontal ? "repeat-x" : "repeat-y",
        backgroundPosition: "center",
      }}
    >
      <MapArrow direction={direction} />
    </span>
  );
}

/**
 * Gap bridge between stops. The cell that renders the stop is the positioning parent.
 * Horizontal dots sit on the glyph center: 1px border + pt-3 + half of the h-10 glyph.
 */
function MapConnector({ connector }: { connector: ModuleStopConnector | null }) {
  if (connector === "left" || connector === "right") {
    return (
      <MapDots
        axis="x"
        direction={connector}
        className={`top-[33px] h-1 w-3 -translate-y-1/2 sm:w-8 ${
          connector === "left" ? "right-full" : "left-full"
        }`}
      />
    );
  }
  if (connector === "down") {
    return (
      <MapDots
        axis="y"
        direction="down"
        className="top-full left-1/2 h-10 w-1 -translate-x-1/2 sm:h-14"
      />
    );
  }
  return null;
}

function ModuleMark({ state }: { state: ModuleStopState }) {
  if (state.kind === "done") return <DoneCheck />;
  if (state.kind === "later") return <LockIcon />;
  return (
    <span className="text-xs font-semibold tabular-nums leading-none text-ink sm:text-sm">
      {state.percent}%
    </span>
  );
}

function moduleStatusLabel(state: ModuleStopState, copy: ModuleStatusCopy) {
  switch (state.kind) {
    case "done":
      return copy.completed;
    case "later":
      return copy.comingLater;
    case "open":
      return copy.moduleTopicsDone(state.percent);
  }
}

function moduleSurface(state: ModuleStopState) {
  if (state.kind === "done") return "border-done bg-done-soft hover:border-done";
  if (state.kind === "later") {
    return state.locked ? "border-line bg-locked" : "border-line bg-locked hover:border-accent";
  }
  return "border-line bg-white hover:border-accent";
}

/**
 * One module on the study map.
 * `current` is the first unfinished open module. It floats, with a shadow under the card. The connector does not.
 * A coming-later stop can still be a link for the owner.
 */
export function ModuleStop({
  name,
  state,
  accessibleLabel,
  copy,
  href,
  leading,
  connector = null,
  current = false,
}: {
  name: string;
  state: ModuleStopState;
  /** Folder word. The row appends the spoken status once. */
  accessibleLabel: string;
  copy: ModuleStatusCopy;
  href: string;
  leading: ReactNode;
  connector?: ModuleStopConnector | null;
  current?: boolean;
}) {
  const locked = state.kind === "later" && state.locked;

  return (
    <>
      <MapConnector connector={connector} />
      <span className={`block h-full ${current ? "study-module-float" : ""}`}>
        <StudyAction
          locked={locked}
          current={current}
          href={href}
          label={entryLabel(name, accessibleLabel, moduleStatusLabel(state, copy))}
          className={`relative z-10 flex h-full w-full flex-col items-center rounded-lg border px-1.5 pt-3 pb-2.5 text-center transition sm:px-3 ${moduleSurface(state)} ${
            current ? "study-module-shadow" : ""
          }`}
          transitionTypes={drillForward}
        >
          {leading}
          <span
            className={`my-1.5 block w-full text-xs font-medium leading-4 sm:text-sm sm:leading-5 ${
              locked ? "text-muted" : "text-ink"
            }`}
          >
            {name}
          </span>
          <span className="mt-auto flex h-6 items-center justify-center">
            <ModuleMark state={state} />
          </span>
        </StudyAction>
      </span>
    </>
  );
}
