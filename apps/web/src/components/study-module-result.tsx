"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/components/locale-provider";
import { ConfettiRain } from "@/components/study-confetti";
import type { ModuleScore } from "@/lib/module-score";
import { studyCopy } from "@/lib/study-copy";

function HouseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 1.7 1.6 7.1h1.6V14h3.7V9.3h2.2V14h3.7V7.1h1.6L8 1.7Z" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 2.1a5.9 5.9 0 1 0 5.3 8.4l-1.5-.6A4.4 4.4 0 1 1 8 3.6c1.3 0 2.4.5 3.2 1.4H9.1v1.5H13V2.6h-1.5v1.3A5.9 5.9 0 0 0 8 2.1Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4 4 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function trapTab(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "Tab") return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "button:not([disabled])",
    ),
  ];
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  const inside = event.currentTarget.contains(active);
  if (event.shiftKey && (active === first || !inside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !inside)) {
    event.preventDefault();
    first.focus();
  }
}

export function ModuleResultDialog({
  score,
  onModuleList,
  onRestart,
  onDismiss,
}: {
  score: ModuleScore;
  onModuleList: () => void;
  onRestart: () => void;
  onDismiss: () => void;
}) {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const primaryRef = useRef<HTMLButtonElement>(null);
  const title = score.passed ? copy.modulePassedTitle : copy.moduleRestartTitle;
  const body = score.passed ? copy.modulePassedBody : copy.moduleRestartBody;

  useEffect(() => {
    primaryRef.current?.focus();
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40" />
      {score.passed ? <ConfettiRain /> : null}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-result-title"
        aria-describedby="module-result-body"
        className="relative max-h-[min(40rem,calc(100vh-2rem))] w-full max-w-md overflow-y-auto rounded-lg border border-line bg-white p-6"
        onKeyDown={trapTab}
      >
        {score.passed ? null : (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={copy.close}
            className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-space hover:text-ink"
          >
            <CloseIcon />
          </button>
        )}
        <h2 id="module-result-title" className="pr-8 text-2xl font-bold text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm font-bold text-accent-deep">
          {copy.moduleScore(score.percent, score.clean, score.total)}
        </p>
        <p id="module-result-body" className="mt-3 text-base leading-7 text-ink">
          {body}
        </p>
        {score.topics.length > 0 ? (
          <div className="mt-5">
            <h3 className="text-sm font-bold text-ink">{copy.topicsTitle}</h3>
            <ul className="mt-2 divide-y divide-line">
              {score.topics.map((topic) => (
                <li
                  key={topic.topicId}
                  className="flex items-baseline justify-between gap-3 py-2 text-sm"
                >
                  <span className="text-ink">{topic.names[locale]}</span>
                  <span className="shrink-0 font-bold tabular-nums text-accent-deep">
                    {copy.moduleScore(topic.percent, topic.clean, topic.total)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {score.passed ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              ref={primaryRef}
              type="button"
              onClick={onModuleList}
              className="cursor-pointer rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#014486]"
            >
              {copy.moduleList}
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-md border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink hover:bg-space"
            >
              {copy.share}
            </button>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              ref={primaryRef}
              type="button"
              onClick={onModuleList}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent-deep px-4 py-2.5 text-sm font-bold text-white hover:bg-[#021f40]"
            >
              <HouseIcon />
              {copy.home}
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-[#014486]"
            >
              <RestartIcon />
              {copy.restart}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
