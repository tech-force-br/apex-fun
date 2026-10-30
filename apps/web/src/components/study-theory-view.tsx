"use client";

import Link from "next/link";
import { drillBack, StudyLessonTransition } from "@/components/study-drill-transition";
import type { ReactNode } from "react";
import { CodeEditor } from "@/components/code-editor";
import { useLocale } from "@/components/locale-provider";
import {
  useCardAdvance,
  type Advance,
  type CardFinish,
} from "@/components/study-card-advance";
import { ConfettiBurst } from "@/components/study-confetti";
import { ModuleResultDialog } from "@/components/study-module-result";
import { TopicProgress } from "@/components/study-topic-progress";
import type { CurriculumModule, TheoryCard, Topic } from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";
import { studyCopy } from "@/lib/study-copy";

const continueClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md bg-accent px-4 py-2.5 text-left text-sm font-bold text-white hover:bg-[#014486]";

const nextTopicClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md border border-accent bg-white px-4 py-2.5 text-left text-sm font-bold text-accent hover:bg-highlight";

export function StudyAdvanceBar({ advance }: { advance: Advance }) {
  return (
    <div className="study-card-advance pointer-events-none fixed inset-x-0 bottom-[calc(var(--site-footer-height)+1rem)] z-20 flex justify-center px-6 md:pointer-events-auto md:static md:z-auto md:shrink-0 md:px-0 md:pt-4">
      <button
        type="button"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          advance.run({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }}
        className={advance.tone === "next" ? nextTopicClass : continueClass}
      >
        {advance.label}
      </button>
    </div>
  );
}

export function StudyCardColumn({
  backHref,
  backLabel,
  topicId,
  cardId,
  cardIndex,
  cardCount,
  progressLabel,
  lastFinished,
  advance,
  finish,
  children,
}: {
  backHref: string;
  backLabel: string;
  topicId: string;
  cardId: string;
  cardIndex: number;
  cardCount: number;
  progressLabel: string;
  lastFinished: boolean;
  advance: Advance | undefined;
  finish?: CardFinish;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
      <main
        className={`w-full md:min-h-0 md:flex-1 md:overflow-y-auto ${
          advance ? "pb-28 md:pb-0" : ""
        }`}
      >
        <Link
          href={backHref}
          transitionTypes={drillBack}
          className="study-card-back cursor-pointer text-sm text-muted hover:text-accent"
        >
          ← {backLabel}
        </Link>
        <TopicProgress
          topicId={topicId}
          cardId={cardId}
          cardIndex={cardIndex}
          cardCount={cardCount}
          label={progressLabel}
          lastFinished={lastFinished}
        />
        <StudyLessonTransition>
          <div className="study-lesson">{children}</div>
        </StudyLessonTransition>
      </main>
      {advance ? <StudyAdvanceBar advance={advance} /> : null}
      {finish?.burst ? <ConfettiBurst origin={finish.burst} /> : null}
      {finish?.result ? (
        <ModuleResultDialog
          score={finish.result.score}
          onModuleList={finish.result.onModuleList}
          onRestart={finish.result.onRestart}
          onDismiss={finish.result.onDismiss}
        />
      ) : null}
    </div>
  );
}

export function StudyTheoryView({
  selected,
  topic,
  topicIndex,
  card,
  cardIndex,
  finished,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  card: TheoryCard;
  cardIndex: number;
  finished: ReadonlySet<string>;
}) {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const { lastFinished, advance, finish } = useCardAdvance({
    selected,
    topic,
    topicIndex,
    cardId: card.id,
    cardIndex,
    finished,
    copy,
  });

  return (
    <StudyCardColumn
      backHref={`/study/${selected.id}`}
      backLabel={selected.names[locale]}
      topicId={topic.id}
      cardId={card.id}
      cardIndex={cardIndex}
      cardCount={topic.cards.length}
      progressLabel={copy.topicProgress}
      lastFinished={lastFinished}
      advance={advance}
      finish={finish}
    >
      <p className="mt-4 text-sm text-muted">{copy.theory}</p>
      <TheoryBody card={card} locale={locale} sampleLabel={copy.sample} />
    </StudyCardColumn>
  );
}

function TheoryBody({
  card,
  locale,
  sampleLabel,
}: {
  card: TheoryCard;
  locale: Locale;
  sampleLabel: string;
}) {
  const paragraphs = card.bodies[locale]
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, index) =>
        index === 0 ? (
          <h1
            key={index}
            className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            {paragraph}
          </h1>
        ) : (
          <p key={index} className="mt-4 text-base leading-7 text-ink">
            {paragraph}
          </p>
        ),
      )}
      {card.imageRefs.map((src) => (
        // Admin image URLs are arbitrary, so this cannot go through the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="mt-6 max-w-full rounded-lg border border-line"
        />
      ))}
      {card.sampleApex ? (
        <figure className="mt-8">
          <figcaption className="text-xs font-medium tracking-wide text-muted uppercase">
            {sampleLabel}
          </figcaption>
          <div className="mt-2">
            <CodeEditor
              key={`${card.id}:${card.sampleApex}`}
              initialValue={card.sampleApex}
              readOnly
              blockClipboard
              label={sampleLabel}
            />
          </div>
        </figure>
      ) : null}
    </>
  );
}
