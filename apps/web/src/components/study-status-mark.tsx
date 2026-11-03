export function DoneCheck() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-done text-white">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M3.5 8.25 6.4 11.2 12.5 4.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Lock with no word label. Topic rows and coming-later modules share it. */
export function LockIcon() {
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
