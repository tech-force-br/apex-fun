"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { useLocale } from "@/components/locale-provider";
import { ConfettiBurst } from "@/components/study-confetti";
import { TopicProgress } from "@/components/study-topic-progress";
import type {
  CurriculumModule,
  TheoryCard,
  Topic,
  TopicLock,
} from "@/lib/curriculum";
import type { Locale } from "@/lib/locale";
import { studyCopy } from "@/lib/study-copy";
import { finishCard } from "@/lib/study-progress";
import { theoryAdvance } from "@/lib/study-route";

const continueClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md bg-accent px-4 py-2.5 text-left text-sm font-bold text-white hover:bg-[#014486]";

const nextTopicClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md border border-accent bg-white px-4 py-2.5 text-left text-sm font-bold text-accent hover:bg-highlight";

export function StudyAdvanceBar({
  label,
  variant = "continue",
  onAdvance,
}: {
  label: string;
  variant?: "continue" | "next";
  onAdvance: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--site-footer-height)+1rem)] z-20">
      <div className="mx-auto flex w-full max-w-3xl justify-center px-6 py-3">
        <button
          type="button"
          onClick={onAdvance}
          className={variant === "next" ? nextTopicClass : continueClass}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export function useCardAdvance(
  cardId: string,
  destination: { href: string; label: string; completesTopic: boolean } | undefined,
) {
  const router = useRouter();
  const [held, setHeld] = useState<{ href: string; label: string } | null>(null);
  const started = useRef(false);

  function onAdvance() {
    if (!destination || started.current) return;
    if (!destination.completesTopic) {
      finishCard(cardId);
      router.push(destination.href);
      return;
    }
    started.current = true;
    setHeld({ href: destination.href, label: destination.label });
    finishCard(cardId);
  }

  function onNext() {
    if (!held) return;
    router.push(held.href);
  }

  return { held, onAdvance, onNext };
}

export function StudyTheoryView({
  selected,
  topic,
  topicIndex,
  card,
  cardIndex,
  cardLock,
}: {
  selected: CurriculumModule;
  topic: Topic;
  topicIndex: number;
  card: TheoryCard;
  cardIndex: number;
  cardLock: TopicLock;
}) {
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    cardLock,
    copy,
  );
  const { held, onAdvance, onNext } = useCardAdvance(card.id, destination);
  const showBar = destination !== undefined || held !== null;

  return (
    <main
      className={`mx-auto w-full max-w-3xl flex-1 px-6 pt-10 ${
        showBar ? "pb-32" : "pb-10"
      }`}
    >
      <Link
        href={`/study/${selected.id}/${topic.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {topic.names[locale]}
      </Link>
      <TopicProgress
        cardIndex={cardIndex}
        cardCount={topic.cards.length}
        label={copy.topicProgress}
        percent={held ? 100 : undefined}
      />
      <p className="mt-4 text-sm text-muted">{copy.theory}</p>
      <TheoryBody card={card} locale={locale} sampleLabel={copy.sample} />
      {held ? <ConfettiBurst /> : null}
      {showBar ? (
        <StudyAdvanceBar
          label={held?.label ?? copy.continue}
          variant={held ? "next" : "continue"}
          onAdvance={held ? onNext : onAdvance}
        />
      ) : null}
    </main>
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
