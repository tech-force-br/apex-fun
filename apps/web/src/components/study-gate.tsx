"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import {
  cardAvailability,
  getCard,
  getModule,
  getTopic,
  type TopicLock,
} from "@/lib/curriculum";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { chromeCopy } from "@/lib/locale";
import { studyRedirect, type StudyDepth } from "@/lib/study-route";
import { useFinishedCards } from "@/lib/study-progress";

export function StudyPending() {
  const { locale } = useLocale();

  return (
    <main
      className="relative flex flex-1 items-center justify-center px-6 py-12"
      aria-busy="true"
    >
      <p className="text-sm text-muted">{chromeCopy[locale].loading}</p>
    </main>
  );
}

export function useStudyGate(ids: {
  moduleId: string;
  topicId?: string;
  cardId?: string;
}) {
  const router = useRouter();
  const modules = useCurriculumModules();
  const finished = useFinishedCards();
  const selected = getModule(ids.moduleId, modules);
  const topic =
    ids.topicId === undefined ? undefined : getTopic(selected, ids.topicId);
  const topicIndex =
    ids.topicId === undefined
      ? undefined
      : (selected?.topics.findIndex((item) => item.id === ids.topicId) ?? -1);
  const card =
    ids.cardId === undefined ? undefined : getCard(topic, ids.cardId);
  const cardIndex =
    ids.cardId === undefined
      ? undefined
      : (topic?.cards.findIndex((item) => item.id === ids.cardId) ?? -1);
  const depth: StudyDepth = ids.cardId ? "card" : ids.topicId ? "topic" : "module";
  const redirect = studyRedirect({
    selected,
    topic,
    topicIndex,
    card,
    cardIndex,
    finished,
    depth,
  });
  const cardLock: TopicLock | undefined =
    topic && cardIndex !== undefined && cardIndex >= 0
      ? cardAvailability(topic, cardIndex, finished)
      : undefined;

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  return {
    selected,
    topic,
    card,
    cardIndex: cardIndex ?? -1,
    cardLock,
    finished,
    redirect,
  };
}
