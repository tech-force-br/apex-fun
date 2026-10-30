"use client";

import Link from "next/link";
import {
  cardForward,
  drillBack,
  drillForward,
  StudyLessonTransition,
} from "@/components/study-drill-transition";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { CodeEditor } from "@/components/code-editor";
import { useLocale } from "@/components/locale-provider";
import {
  ConfettiBurst,
  type ConfettiOrigin,
} from "@/components/study-confetti";
import { TopicProgress } from "@/components/study-topic-progress";
import {
  lastCardFinished,
  type CurriculumModule,
  type TheoryCard,
  type Topic,
} from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";
import { studyCopy } from "@/lib/study-copy";
import { finishCard } from "@/lib/study-progress";
import { theoryAdvance } from "@/lib/study-route";

const continueClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md bg-accent px-4 py-2.5 text-left text-sm font-bold text-white hover:bg-[#014486]";

const nextTopicClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md border border-accent bg-white px-4 py-2.5 text-left text-sm font-bold text-accent hover:bg-highlight";

export type Advance = {
  label: string;
  tone: "continue" | "next";
  burst?: ConfettiOrigin;
  run: (at: ConfettiOrigin) => void;
};

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

export function useCardAdvance({
  selected,
  topic,
  topicIndex,
  cardId,
  cardIndex,
  finished,
  copy,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  cardId: string;
  cardIndex: number;
  finished: ReadonlySet<string>;
  copy: { continue: string; nextTopic: string; topicsTitle: string };
}): { lastFinished: boolean; advance: Advance | undefined } {
  const router = useRouter();
  const [held, setHeld] = useState<{
    cardId: string;
    href: string;
    label: string;
    origin: ConfettiOrigin;
    transitionTypes: string[];
  } | null>(null);
  const startedFor = useRef<string | null>(null);
  const active = held?.cardId === cardId ? held : null;
  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    finished,
    copy,
  );

  let advance: Advance | undefined;
  if (active) {
    const href = active.href;
    advance = {
      label: active.label,
      tone: "next",
      burst: active.origin,
      run: () =>
        router.push(href, { transitionTypes: active.transitionTypes }),
    };
  } else if (destination?.completesTopic) {
    const href = destination.href;
    const nextLabel = destination.nextLabel;
    const transitionTypes =
      destination.next === "module" ? drillBack : drillForward;
    advance = {
      label: copy.continue,
      tone: "continue",
      run: (origin) => {
        if (startedFor.current === cardId) return;
        startedFor.current = cardId;
        setHeld({ cardId, href, label: nextLabel, origin, transitionTypes });
        finishCard(cardId);
      },
    };
  } else if (destination) {
    const href = destination.href;
    advance = {
      label: copy.continue,
      tone: "continue",
      run: () => {
        finishCard(cardId);
        router.push(href, { transitionTypes: cardForward });
      },
    };
  }

  return { lastFinished: lastCardFinished(topic, finished), advance };
}

export function StudyCardColumn({
  backHref,
  backLabel,
  topicId,
  cardIndex,
  cardCount,
  progressLabel,
  lastFinished,
  advance,
  children,
}: {
  backHref: string;
  backLabel: string;
  topicId: string;
  cardIndex: number;
  cardCount: number;
  progressLabel: string;
  lastFinished: boolean;
  advance: Advance | undefined;
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
          cardIndex={cardIndex}
          cardCount={cardCount}
          label={progressLabel}
          lastFinished={lastFinished}
        />
        <StudyLessonTransition>
          <div>{children}</div>
        </StudyLessonTransition>
      </main>
      {advance ? <StudyAdvanceBar advance={advance} /> : null}
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
  const { lastFinished, advance } = useCardAdvance({
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
      backHref={`/study/${selected.id}/${topic.id}`}
      backLabel={topic.names[locale]}
      topicId={topic.id}
      cardIndex={cardIndex}
      cardCount={topic.cards.length}
      progressLabel={copy.topicProgress}
      lastFinished={lastFinished}
      advance={advance}
    >
      <p className="mt-4 text-sm text-muted">{copy.theory}</p>
      <TheoryBody card={card} locale={locale} sampleLabel={copy.sample} />
      {advance?.burst ? <ConfettiBurst origin={advance.burst} /> : null}
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
