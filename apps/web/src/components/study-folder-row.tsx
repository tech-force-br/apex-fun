import Link from "next/link";

export function FolderIcon({
  active,
  locked,
}: {
  active?: boolean;
  locked?: boolean;
}) {
  return (
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
        active ? "bg-accent/15 text-accent" : "bg-space text-muted"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M3.75 6.5A1.75 1.75 0 0 1 5.5 4.75h3.1c.3 0 .58.14.76.38l.9 1.12h8.24A1.75 1.75 0 0 1 20.25 8v9.5A1.75 1.75 0 0 1 18.5 19.25h-13A1.75 1.75 0 0 1 3.75 17.5z" />
      </svg>
      {locked ? (
        <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-space-card text-muted ring-1 ring-white/10">
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
    </span>
  );
}

type FolderRowProps = {
  name: string;
  meta?: string;
  badge: string;
  folderLabel: string;
} & (
  | { state: "open"; href: string }
  | { state: "locked" }
  | { state: "current" }
);

export function FolderRow(props: FolderRowProps) {
  const { name, meta, badge, folderLabel, state } = props;
  const href = state === "open" ? props.href : undefined;
  const locked = state === "locked";
  const current = state === "current";

  const className = `flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
    href || locked ? "cursor-pointer" : ""
  } ${
    current
      ? "border-accent/40 bg-accent/10"
      : locked
        ? "border-white/10 bg-space-card/60"
        : "border-white/10 bg-space-card/95 hover:border-accent/40"
  }`;

  const inner = (
    <>
      <FolderIcon active={current || Boolean(href)} locked={locked} />
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-medium ${
            locked ? "text-muted" : "text-ink"
          }`}
        >
          {name}
        </span>
        {meta ? <span className="mt-0.5 block text-xs text-muted">{meta}</span> : null}
      </span>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
          current
            ? "bg-accent/15 text-accent"
            : locked
              ? "bg-white/5 text-muted"
              : "bg-accent/15 text-accent"
        }`}
      >
        {badge}
      </span>
    </>
  );

  if (state === "open") {
    return (
      <Link
        href={props.href}
        className={className}
        aria-label={`${name}, ${folderLabel}`}
      >
        {inner}
      </Link>
    );
  }

  if (locked) {
    return (
      <button
        type="button"
        disabled
        className={className}
        aria-label={`${name}, ${folderLabel}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={className}
      aria-current="step"
      aria-label={`${name}, ${folderLabel}`}
    >
      {inner}
    </div>
  );
}
