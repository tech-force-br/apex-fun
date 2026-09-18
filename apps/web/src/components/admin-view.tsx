"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCardForm } from "@/components/admin-card-form";
import { AdminModuleForm } from "@/components/admin-module-form";
import { AdminTopicForm } from "@/components/admin-topic-form";
import { AdminTree } from "@/components/admin-tree";
import { StudyHeader } from "@/components/study-header";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { adminCopy } from "@/lib/admin-copy";
import {
  selectionKey,
  type AdminSelection,
} from "@/lib/admin-selection";
import {
  cardToDraft,
  createCard,
  createModule,
  createTopic,
  emptyExerciseDraft,
  emptyTheoryDraft,
  moveCard,
  moveModule,
  moveTopic,
  removeCard,
  removeModule,
  removeTopic,
  updateCard,
  updateModule,
  updateTopic,
  useCurriculumModules,
  type CardDraft,
  type ModuleDraft,
  type SaveIssue,
  type TopicDraft,
} from "@/lib/curriculum-store";
import {
  emptyLocalizedText,
  getCard,
  getModule,
  getTopic,
} from "@/lib/curriculum";

export function AdminView() {
  const router = useRouter();
  const { locale } = useLocale();
  const { ready, session, signOut } = useMockAuth();
  const copy = adminCopy[locale];
  const modules = useCurriculumModules();
  const [selection, setSelection] = useState<AdminSelection>({ kind: "pick" });
  const [issues, setIssues] = useState<SaveIssue[]>([]);
  const [saved, setSaved] = useState(false);
  const dirtyRef = useRef(false);
  const nonceRef = useRef(0);
  const savingRef = useRef(false);

  useEffect(() => {
    if (ready && !session) router.replace("/");
  }, [ready, session, router]);

  useEffect(() => {
    savingRef.current = false;
  }, [selection]);

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  function requestSelect(next: AdminSelection) {
    if (
      dirtyRef.current &&
      selectionKey(next) !== selectionKey(selection) &&
      !window.confirm(copy.discardConfirm)
    ) {
      return;
    }
    dirtyRef.current = false;
    setIssues([]);
    setSaved(false);
    setSelection(next);
  }

  function markDirty() {
    dirtyRef.current = true;
    setSaved(false);
  }

  function nextNonce() {
    nonceRef.current += 1;
    return nonceRef.current;
  }

  function afterSave(next: AdminSelection) {
    dirtyRef.current = false;
    setIssues([]);
    setSaved(true);
    setSelection(next);
  }

  function beginSave() {
    if (savingRef.current) return false;
    savingRef.current = true;
    return true;
  }

  function confirmRemove(run: () => void, next: AdminSelection) {
    if (!window.confirm(copy.removeConfirm)) return;
    run();
    dirtyRef.current = false;
    setIssues([]);
    setSaved(false);
    setSelection(next);
  }

  if (!ready || !session) {
    return (
      <main
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        aria-busy="true"
      >
        <p className="text-sm text-muted">{copy.loading}</p>
      </main>
    );
  }

  const editorKey = selectionKey(selection);

  return (
    <div className="relative flex flex-1 flex-col">
      <StudyHeader
        wide
        wordmark={copy.wordmark}
        email={session.email}
        signOutLabel={copy.signOut}
        onSignOut={onSignOut}
        navHref="/study"
        navLabel={copy.studyMap}
      />

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-8 lg:grid-cols-[minmax(18rem,24rem)_1fr]">
        <div className="min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <AdminTree
          modules={modules}
          selection={selection}
          onSelect={requestSelect}
          onAddModule={() =>
            requestSelect({ kind: "new-module", nonce: nextNonce() })
          }
          onAddTopic={(moduleId) =>
            requestSelect({
              kind: "new-topic",
              moduleId,
              nonce: nextNonce(),
            })
          }
          onAddCard={(moduleId, topicId, cardType) =>
            requestSelect({
              kind: "new-card",
              moduleId,
              topicId,
              cardType,
              nonce: nextNonce(),
            })
          }
          onMoveModule={moveModule}
          onMoveTopic={moveTopic}
          onMoveCard={moveCard}
        />
        </div>

        <section className="min-w-0 rounded-2xl border border-white/10 bg-space-card/95 p-6">
          <p className="mb-6 text-xs text-muted">{copy.memoryNote}</p>
          {saved ? (
            <p className="mb-4 text-sm text-accent" role="status">
              {copy.saved}
            </p>
          ) : null}

          <Editor
            key={editorKey}
            selection={selection}
            modules={modules}
            issues={issues}
            onDirty={markDirty}
            onSaveModule={(draft) => {
              if (!beginSave()) return;
              const result =
                selection.kind === "module"
                  ? updateModule(selection.moduleId, draft)
                  : createModule(draft);
              if (!result.ok) {
                savingRef.current = false;
                setIssues(result.issues);
                return;
              }
              afterSave({ kind: "module", moduleId: result.id });
            }}
            onSaveTopic={(draft) => {
              if (selection.kind !== "topic" && selection.kind !== "new-topic") {
                return;
              }
              if (!beginSave()) return;
              const result =
                selection.kind === "topic"
                  ? updateTopic(selection.moduleId, selection.topicId, draft)
                  : createTopic(selection.moduleId, draft);
              if (!result.ok) {
                savingRef.current = false;
                setIssues(result.issues);
                return;
              }
              afterSave({
                kind: "topic",
                moduleId: selection.moduleId,
                topicId: result.id,
              });
            }}
            onSaveCard={(draft) => {
              if (selection.kind !== "card" && selection.kind !== "new-card") {
                return;
              }
              if (!beginSave()) return;
              const result =
                selection.kind === "card"
                  ? updateCard(
                      selection.moduleId,
                      selection.topicId,
                      selection.cardId,
                      draft,
                    )
                  : createCard(selection.moduleId, selection.topicId, draft);
              if (!result.ok) {
                savingRef.current = false;
                setIssues(result.issues);
                return;
              }
              afterSave({
                kind: "card",
                moduleId: selection.moduleId,
                topicId: selection.topicId,
                cardId: result.id,
              });
            }}
            onRemoveModule={() => {
              if (selection.kind !== "module") return;
              confirmRemove(
                () => removeModule(selection.moduleId),
                { kind: "pick" },
              );
            }}
            onRemoveTopic={() => {
              if (selection.kind !== "topic") return;
              confirmRemove(
                () => removeTopic(selection.moduleId, selection.topicId),
                { kind: "module", moduleId: selection.moduleId },
              );
            }}
            onRemoveCard={() => {
              if (selection.kind !== "card") return;
              confirmRemove(
                () =>
                  removeCard(
                    selection.moduleId,
                    selection.topicId,
                    selection.cardId,
                  ),
                {
                  kind: "topic",
                  moduleId: selection.moduleId,
                  topicId: selection.topicId,
                },
              );
            }}
          />
        </section>
      </main>
    </div>
  );
}

function Editor({
  selection,
  modules,
  issues,
  onDirty,
  onSaveModule,
  onSaveTopic,
  onSaveCard,
  onRemoveModule,
  onRemoveTopic,
  onRemoveCard,
}: {
  selection: AdminSelection;
  modules: ReturnType<typeof useCurriculumModules>;
  issues: SaveIssue[];
  onDirty: () => void;
  onSaveModule: (draft: ModuleDraft) => void;
  onSaveTopic: (draft: TopicDraft) => void;
  onSaveCard: (draft: CardDraft) => void;
  onRemoveModule: () => void;
  onRemoveTopic: () => void;
  onRemoveCard: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  if (selection.kind === "pick") {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="mt-2 text-muted">{copy.intro}</p>
        <p className="mt-6 text-sm text-muted">{copy.pickItem}</p>
      </div>
    );
  }

  if (selection.kind === "new-module") {
    return (
      <AdminModuleForm
        title={copy.newModule}
        initial={{ names: { ...emptyLocalizedText }, status: "coming_later" }}
        issues={issues}
        onDirty={onDirty}
        onSave={onSaveModule}
      />
    );
  }

  if (selection.kind === "module") {
    const selected = getModule(selection.moduleId, modules);
    if (!selected) return <p className="text-sm text-muted">{copy.pickItem}</p>;
    return (
      <AdminModuleForm
        title={selected.names[locale]}
        initial={{ names: { ...selected.names }, status: selected.status }}
        issues={issues}
        onDirty={onDirty}
        onSave={onSaveModule}
        onRemove={onRemoveModule}
      />
    );
  }

  if (selection.kind === "new-topic") {
    return (
      <AdminTopicForm
        title={copy.newTopic}
        initial={{ names: { ...emptyLocalizedText }, kind: "theory" }}
        issues={issues}
        onDirty={onDirty}
        onSave={onSaveTopic}
      />
    );
  }

  if (selection.kind === "topic") {
    const topic = getTopic(
      getModule(selection.moduleId, modules),
      selection.topicId,
    );
    if (!topic) return <p className="text-sm text-muted">{copy.pickItem}</p>;
    return (
      <AdminTopicForm
        title={topic.names[locale]}
        initial={{ names: { ...topic.names }, kind: topic.kind }}
        issues={issues}
        onDirty={onDirty}
        onSave={onSaveTopic}
        onRemove={onRemoveTopic}
      />
    );
  }

  if (selection.kind === "new-card") {
    return (
      <AdminCardForm
        title={
          selection.cardType === "theory" ? copy.newTheory : copy.newExercise
        }
        initial={
          selection.cardType === "theory"
            ? emptyTheoryDraft()
            : emptyExerciseDraft()
        }
        issues={issues}
        onDirty={onDirty}
        onSave={onSaveCard}
      />
    );
  }

  const card = getCard(
    getTopic(getModule(selection.moduleId, modules), selection.topicId),
    selection.cardId,
  );
  if (!card) return <p className="text-sm text-muted">{copy.pickItem}</p>;
  return (
    <AdminCardForm
      title={
        card.type === "theory" ? copy.theoryBadge : copy.exerciseBadge
      }
      initial={cardToDraft(card)}
      issues={issues}
      onDirty={onDirty}
      onSave={onSaveCard}
      onRemove={onRemoveCard}
    />
  );
}
