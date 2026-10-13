export function RunSpinner() {
  return (
    <span
      className="inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}

export function CheckResult({
  passed,
  unavailable,
  message,
  log,
  logLabel,
}: {
  passed: boolean;
  unavailable: boolean;
  message: string;
  log: string;
  logLabel: string;
}) {
  const tone = unavailable
    ? "text-muted"
    : passed
      ? "text-accent-deep"
      : "text-[#ba0517]";

  return (
    <div className="space-y-3" role="status">
      {message ? <p className={`text-sm font-bold ${tone}`}>{message}</p> : null}
      {log ? (
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {logLabel}
          </p>
          <pre className="mt-1.5 max-h-40 overflow-auto rounded-md border border-line bg-white px-3 py-2 font-mono text-xs whitespace-pre-wrap text-ink">
            {log}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
