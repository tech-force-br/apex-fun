export function topicProgressPercent(cardIndex: number, cardCount: number) {
  if (cardCount <= 0 || cardIndex <= 0) return 0;
  return Math.round((cardIndex / cardCount) * 100);
}

export function TopicProgress({
  cardIndex,
  cardCount,
  label,
  percent: percentOverride,
}: {
  cardIndex: number;
  cardCount: number;
  label: string;
  percent?: number;
}) {
  const percent = percentOverride ?? topicProgressPercent(cardIndex, cardCount);

  return (
    <div className="mt-3 flex items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="w-11 shrink-0 text-right text-sm font-bold tabular-nums text-ink">
        {percent}%
      </p>
    </div>
  );
}
