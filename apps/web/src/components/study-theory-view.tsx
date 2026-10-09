"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/code-editor";
import { useLocale } from "@/components/locale-provider";
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

const actionClass =
  "pointer-events-auto max-w-full cursor-pointer rounded-md bg-accent px-4 py-2.5 text-left text-sm font-bold text-white hover:bg-[#014486]";

export function StudyAdvanceBar({
  label,
  onAdvance,
}: {
  label: string;
  onAdvance: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--site-footer-height)+1rem)] z-20">
      <div className="mx-auto flex w-full max-w-3xl justify-center px-6 py-3">
        <button type="button" onClick={onAdvance} className={actionClass}>
          {label}
        </button>
      </div>
    </div>
  );
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
  const router = useRouter();
  const { locale } = useLocale();
  const copy = studyCopy[locale];
  const destination = theoryAdvance(
    selected,
    topic,
    topicIndex,
    cardIndex,
    cardLock,
    locale,
    copy,
  );

  return (
    <main
      className={`mx-auto w-full max-w-3xl flex-1 px-6 pt-10 ${
        destination ? "pb-32" : "pb-10"
      }`}
    >
      <Link
        href={`/study/${selected.id}/${topic.id}`}
        className="cursor-pointer text-sm text-muted hover:text-accent"
      >
        ← {topic.names[locale]}
      </Link>
      <p className="mt-4 text-sm text-muted">{copy.theory}</p>
      <TheoryBody card={card} locale={locale} sampleLabel={copy.sample} />
      {destination ? (
        <StudyAdvanceBar
          label={destination.label}
          onAdvance={() => {
            finishCard(card.id);
            router.push(destination.href);
          }}
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
