"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { useLocale } from "@/components/locale-provider";
import { cardAvailability, cardLabel, type Topic } from "@/lib/curriculum";
import { studyCopy } from "@/lib/study-copy";

export function TopicCardPane({
  moduleId,
  topic,
  finished,
  unlockAll,
  activeCardId,
}: {
  moduleId: string;
  topic: Topic;
  finished: ReadonlySet<string>;
  unlockAll: boolean;
  activeCardId: string;
}) {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const paneRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const pane = paneRef.current;
    const item = activeRef.current;
    if (!pane || !item) return;
    const paneRect = pane.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < paneRect.top) {
      pane.scrollTop -= paneRect.top - itemRect.top;
    } else if (itemRect.bottom > paneRect.bottom) {
      pane.scrollTop += itemRect.bottom - paneRect.bottom;
    }
  }, [activeCardId]);

  return (
    <nav
      ref={paneRef}
      aria-label={copy.topicCards}
      className="max-h-64 min-h-0 w-full shrink-0 overflow-y-auto rounded-lg border border-line bg-white p-3 md:max-h-none md:w-72"
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {copy.topicCards}
      </p>
      <h2 className="mt-1 truncate text-sm font-bold text-ink">
        {topic.names[locale]}
      </h2>
      <ol className="mt-3 space-y-1.5">
        {topic.cards.map((card, cardIndex) => {
          const lock = cardAvailability(topic, cardIndex, finished, unlockAll);
          const done = finished.has(card.id);
          const locked = lock === "locked";
          const current = card.id === activeCardId;
          const status = locked ? copy.locked : done ? copy.done : copy.notDone;
          const typeLabel = card.type === "theory" ? copy.theory : copy.exercise;
          const name = cardLabel(card, locale);
          const className = `flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left ${
            current
              ? "border-accent bg-highlight"
              : locked
                ? "border-transparent"
                : "border-transparent hover:bg-space"
          }`;
          const inner = (
            <>
              <CardStatusMark done={done} locked={locked} />
              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate text-sm font-medium ${
                    locked ? "text-muted" : "text-ink"
                  }`}
                >
                  {name}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {typeLabel}
                  <span aria-hidden="true"> · </span>
                  <span className={done && !locked ? "font-bold text-accent-deep" : undefined}>
                    {status}
                  </span>
                </span>
              </span>
            </>
          );
          const label = `${name}, ${typeLabel}, ${status}`;

          return (
            <li key={card.id} ref={current ? activeRef : undefined}>
              {locked ? (
                <button
                  type="button"
                  disabled
                  className={className}
                  aria-label={label}
                >
                  {inner}
                </button>
              ) : (
                <Link
                  href={`/study/${moduleId}/${topic.id}/${card.id}`}
                  className={`${className} cursor-pointer`}
                  aria-current={current ? "page" : undefined}
                  aria-label={label}
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CardStatusMark({ done, locked }: { done: boolean; locked: boolean }) {
  if (locked) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <rect
            x="3.5"
            y="7"
            width="9"
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

  if (done) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-highlight text-accent-deep">
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

  return (
    <span
      className="h-6 w-6 shrink-0 rounded-full border border-line bg-white"
      aria-hidden="true"
    />
  );
}
