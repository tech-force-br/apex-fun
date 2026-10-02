"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { sessionIsAdmin } from "@/lib/mock-auth";
import { getCard, getModule, getTopic } from "@/lib/curriculum";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { chromeCopy } from "@/lib/locale";
import {
  resolveStudyTarget,
  type StudyDepth,
  type StudyTarget,
} from "@/lib/study-route";
import { useFinishedCards } from "@/lib/study-progress";

export type StudyGate = StudyTarget & {
  finished: ReadonlySet<string>;
  unlockAll: boolean;
};

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
}): StudyGate {
  const router = useRouter();
  const modules = useCurriculumModules();
  const finished = useFinishedCards();
  const { session } = useMockAuth();
  const unlockAll = sessionIsAdmin(session);
  const selected = getModule(ids.moduleId, modules);
  const topic =
    ids.topicId === undefined ? undefined : getTopic(selected, ids.topicId);
  const topicIndex =
    ids.topicId === undefined || !selected
      ? undefined
      : selected.topics.findIndex((item) => item.id === ids.topicId);
  const card =
    ids.cardId === undefined ? undefined : getCard(topic, ids.cardId);
  const cardIndex =
    ids.cardId === undefined || !topic
      ? undefined
      : topic.cards.findIndex((item) => item.id === ids.cardId);
  const depth: StudyDepth = ids.cardId
    ? "card"
    : ids.topicId
      ? "topic"
      : "module";
  const target = resolveStudyTarget({
    selected,
    topic,
    topicIndex,
    card,
    cardIndex,
    finished,
    depth,
    unlockAll,
  });
  const redirectHref = target.status === "redirect" ? target.href : null;

  useEffect(() => {
    if (redirectHref) router.replace(redirectHref);
  }, [redirectHref, router]);

  return { ...target, finished, unlockAll };
}
