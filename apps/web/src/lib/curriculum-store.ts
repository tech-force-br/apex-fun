"use client";

import { useSyncExternalStore } from "react";
import {
  curriculum,
  emptyLocalizedText,
  getCard,
  getModule,
  getTopic,
  type Card,
  type CurriculumModule,
  type ExerciseCard,
  type HiddenTest,
  type LocalizedText,
  type ModuleStatus,
  type TheoryCard,
  type Topic,
  type TopicKind,
} from "@/lib/curriculum";

export type SaveIssue = {
  code:
    | "name_en"
    | "name_pt"
    | "body_en"
    | "body_pt"
    | "prompt_en"
    | "prompt_pt"
    | "need_hidden_test"
    | "test_check"
    | "test_match"
    | "test_message_en"
    | "test_message_pt";
  testIndex?: number;
};

export type StoreResult =
  | { ok: true; id: string }
  | { ok: false; issues: SaveIssue[] };

export type ModuleDraft = {
  names: LocalizedText;
  status: ModuleStatus;
};

export type TopicDraft = {
  names: LocalizedText;
  kind: TopicKind;
};

export type TheoryDraft = Omit<TheoryCard, "id">;
export type ExerciseDraft = Omit<ExerciseCard, "id">;
export type CardDraft = TheoryDraft | ExerciseDraft;

const listeners = new Set<() => void>();
let snapshot: CurriculumModule[] = curriculum;

function notify() {
  for (const listener of listeners) listener();
}

function commit(next: CurriculumModule[]) {
  snapshot = next;
  notify();
}

function cloneCurriculum() {
  return structuredClone(snapshot);
}

export function subscribeCurriculum(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function getCurriculumSnapshot() {
  return snapshot;
}

export function getCurriculumServerSnapshot() {
  return curriculum;
}

export function useCurriculumModules() {
  return useSyncExternalStore(
    subscribeCurriculum,
    getCurriculumSnapshot,
    getCurriculumServerSnapshot,
  );
}

function isBlank(value: string) {
  return value.trim().length === 0;
}

function trimText(value: LocalizedText): LocalizedText {
  return { en: value.en.trim(), "pt-BR": value["pt-BR"].trim() };
}

function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function uniqueId(used: string[], base: string) {
  if (!used.includes(base)) return base;
  let n = 2;
  while (used.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function moveById<T extends { id: string }>(
  list: T[],
  id: string,
  direction: -1 | 1,
) {
  const index = list.findIndex((item) => item.id === id);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, item);
  return copy;
}

function withModule(
  moduleId: string,
  fn: (selected: CurriculumModule) => void | boolean,
) {
  const next = cloneCurriculum();
  const selected = getModule(moduleId, next);
  if (!selected) return false;
  if (fn(selected) === false) return false;
  commit(next);
  return true;
}

function withTopic(
  moduleId: string,
  topicId: string,
  fn: (topic: Topic) => void | boolean,
) {
  const next = cloneCurriculum();
  const topic = getTopic(getModule(moduleId, next), topicId);
  if (!topic) return false;
  if (fn(topic) === false) return false;
  commit(next);
  return true;
}

export function validateNames(names: LocalizedText): SaveIssue[] {
  const issues: SaveIssue[] = [];
  if (isBlank(names.en)) issues.push({ code: "name_en" });
  if (isBlank(names["pt-BR"])) issues.push({ code: "name_pt" });
  return issues;
}

export function validateCard(draft: CardDraft): SaveIssue[] {
  if (draft.type === "theory") {
    const issues: SaveIssue[] = [];
    if (isBlank(draft.bodies.en)) issues.push({ code: "body_en" });
    if (isBlank(draft.bodies["pt-BR"])) issues.push({ code: "body_pt" });
    return issues;
  }

  const issues: SaveIssue[] = [];
  if (isBlank(draft.prompts.en)) issues.push({ code: "prompt_en" });
  if (isBlank(draft.prompts["pt-BR"])) issues.push({ code: "prompt_pt" });
  if (draft.hiddenTests.length === 0) {
    issues.push({ code: "need_hidden_test" });
    return issues;
  }

  draft.hiddenTests.forEach((test, testIndex) => {
    if (isBlank(test.checkApex)) {
      issues.push({ code: "test_check", testIndex });
    }
    if (test.mode === "compile_fail" && isBlank(test.compileFailMatch)) {
      issues.push({ code: "test_match", testIndex });
    }
    if (isBlank(test.messages.en)) {
      issues.push({ code: "test_message_en", testIndex });
    }
    if (isBlank(test.messages["pt-BR"])) {
      issues.push({ code: "test_message_pt", testIndex });
    }
  });
  return issues;
}

function toTheoryCard(id: string, draft: TheoryDraft): TheoryCard {
  return {
    id,
    type: "theory",
    bodies: trimText(draft.bodies),
    imageRefs: draft.imageRefs.map((ref) => ref.trim()).filter(Boolean),
    sampleApex: draft.sampleApex.trim(),
  };
}

function toExerciseCard(id: string, draft: ExerciseDraft): ExerciseCard {
  return {
    id,
    type: "exercise",
    prompts: trimText(draft.prompts),
    previewCode: draft.previewCode,
    hiddenTests: draft.hiddenTests.map((test) => ({
      ...test,
      checkApex: test.checkApex.trim(),
      compileFailMatch: test.compileFailMatch.trim(),
      messages: trimText(test.messages),
    })),
  };
}

function toCard(id: string, draft: CardDraft): Card {
  return draft.type === "theory"
    ? toTheoryCard(id, draft)
    : toExerciseCard(id, draft);
}

export function emptyHiddenTest(): HiddenTest {
  return {
    id: crypto.randomUUID(),
    mode: "run_clean",
    checkApex: "",
    compileFailMatch: "",
    messages: { ...emptyLocalizedText },
  };
}

export function emptyTheoryDraft(): TheoryDraft {
  return {
    type: "theory",
    bodies: { ...emptyLocalizedText },
    imageRefs: [],
    sampleApex: "",
  };
}

export function emptyExerciseDraft(): ExerciseDraft {
  return {
    type: "exercise",
    prompts: { ...emptyLocalizedText },
    hiddenTests: [emptyHiddenTest()],
    previewCode: "",
  };
}

export function cardToDraft(card: Card): CardDraft {
  if (card.type === "theory") {
    return {
      type: "theory",
      bodies: { ...card.bodies },
      imageRefs: [...card.imageRefs],
      sampleApex: card.sampleApex,
    };
  }
  return {
    type: "exercise",
    prompts: { ...card.prompts },
    hiddenTests: structuredClone(card.hiddenTests),
    previewCode: card.previewCode,
  };
}

export function createModule(draft: ModuleDraft): StoreResult {
  const issues = validateNames(draft.names);
  if (issues.length > 0) return { ok: false, issues };
  const next = cloneCurriculum();
  const id = uniqueId(
    next.map((item) => item.id),
    slugify(draft.names.en),
  );
  next.push({
    id,
    names: trimText(draft.names),
    status: draft.status,
    topics: [],
  });
  commit(next);
  return { ok: true, id };
}

export function updateModule(moduleId: string, draft: ModuleDraft): StoreResult {
  const issues = validateNames(draft.names);
  if (issues.length > 0) return { ok: false, issues };
  const found = withModule(moduleId, (selected) => {
    selected.names = trimText(draft.names);
    selected.status = draft.status;
  });
  if (!found) return { ok: false, issues: [] };
  return { ok: true, id: moduleId };
}

export function removeModule(moduleId: string) {
  commit(cloneCurriculum().filter((item) => item.id !== moduleId));
}

export function moveModule(moduleId: string, direction: -1 | 1) {
  commit(moveById(cloneCurriculum(), moduleId, direction));
}

export function createTopic(moduleId: string, draft: TopicDraft): StoreResult {
  const issues = validateNames(draft.names);
  if (issues.length > 0) return { ok: false, issues };
  let id = "";
  const found = withModule(moduleId, (selected) => {
    id = uniqueId(
      selected.topics.map((item) => item.id),
      slugify(draft.names.en),
    );
    selected.topics.push({
      id,
      names: trimText(draft.names),
      kind: draft.kind,
      cards: [],
    });
  });
  if (!found) return { ok: false, issues: [] };
  return { ok: true, id };
}

export function updateTopic(
  moduleId: string,
  topicId: string,
  draft: TopicDraft,
): StoreResult {
  const issues = validateNames(draft.names);
  if (issues.length > 0) return { ok: false, issues };
  const found = withTopic(moduleId, topicId, (topic) => {
    topic.names = trimText(draft.names);
    topic.kind = draft.kind;
  });
  if (!found) return { ok: false, issues: [] };
  return { ok: true, id: topicId };
}

export function removeTopic(moduleId: string, topicId: string) {
  withModule(moduleId, (selected) => {
    selected.topics = selected.topics.filter((item) => item.id !== topicId);
  });
}

export function moveTopic(
  moduleId: string,
  topicId: string,
  direction: -1 | 1,
) {
  withModule(moduleId, (selected) => {
    selected.topics = moveById(selected.topics, topicId, direction);
  });
}

export function createCard(
  moduleId: string,
  topicId: string,
  draft: CardDraft,
): StoreResult {
  const issues = validateCard(draft);
  if (issues.length > 0) return { ok: false, issues };
  const id = crypto.randomUUID();
  const found = withTopic(moduleId, topicId, (topic) => {
    topic.cards.push(toCard(id, draft));
  });
  if (!found) return { ok: false, issues: [] };
  return { ok: true, id };
}

export function updateCard(
  moduleId: string,
  topicId: string,
  cardId: string,
  draft: CardDraft,
): StoreResult {
  const issues = validateCard(draft);
  if (issues.length > 0) return { ok: false, issues };
  const found = withTopic(moduleId, topicId, (topic) => {
    if (!getCard(topic, cardId)) return false;
    topic.cards = topic.cards.map((card) =>
      card.id === cardId ? toCard(cardId, draft) : card,
    );
  });
  if (!found) return { ok: false, issues: [] };
  return { ok: true, id: cardId };
}

export function removeCard(moduleId: string, topicId: string, cardId: string) {
  withTopic(moduleId, topicId, (topic) => {
    topic.cards = topic.cards.filter((item) => item.id !== cardId);
  });
}

export function moveCard(
  moduleId: string,
  topicId: string,
  cardId: string,
  direction: -1 | 1,
) {
  withTopic(moduleId, topicId, (topic) => {
    topic.cards = moveById(topic.cards, cardId, direction);
  });
}
