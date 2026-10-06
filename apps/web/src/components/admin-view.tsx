"use client";

import { useRef, useState } from "react";
import { AdminCardForm } from "@/components/admin-card-form";
import {
  AdminModuleForm,
  AdminTopicForm,
} from "@/components/admin-named-entity-form";
import { AdminTree } from "@/components/admin-tree";
import { useLocale } from "@/components/locale-provider";
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
  type SaveIssue,
  type StoreResult,
} from "@/lib/curriculum-store";
import {
  emptyLocalizedText,
  getCard,
  getModule,
  getTopic,
} from "@/lib/curriculum";

export function AdminView() {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const modules = useCurriculumModules();
  const [selection, setSelection] = useState<AdminSelection>({ kind: "pick" });
  const [issues, setIssues] = useState<SaveIssue[]>([]);
  const [saved, setSaved] = useState(false);
  const dirtyRef = useRef(false);
  const nonceRef = useRef(0);

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

  function confirmRemove(run: () => void, next: AdminSelection) {
    if (!window.confirm(copy.removeConfirm)) return;
    run();
    dirtyRef.current = false;
    setIssues([]);
    setSaved(false);
    setSelection(next);
  }

  function remove() {
    if (selection.kind === "module") {
      confirmRemove(() => removeModule(selection.moduleId), { kind: "pick" });
      return;
    }
    if (selection.kind === "topic") {
      confirmRemove(
        () => removeTopic(selection.moduleId, selection.topicId),
        { kind: "module", moduleId: selection.moduleId },
      );
      return;
    }
    if (selection.kind === "card") {
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
    }
  }

  const editorKey = selectionKey(selection);

  return (
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

      <section className="min-w-0 rounded-lg border border-line bg-white p-6">
        <p className="mb-6 text-xs text-muted">{copy.memoryNote}</p>
        {saved ? (
          <p className="mb-4 text-sm font-bold text-accent-deep" role="status">
            {copy.saved}
          </p>
        ) : null}

        <Editor
          key={editorKey}
          selection={selection}
          modules={modules}
          issues={issues}
          onDirty={markDirty}
          onReject={setIssues}
          onSaved={afterSave}
          onRemove={remove}
        />
      </section>
    </main>
  );
}

function Editor({
  selection,
  modules,
  issues,
  onDirty,
  onReject,
  onSaved,
  onRemove,
}: {
  selection: AdminSelection;
  modules: ReturnType<typeof useCurriculumModules>;
  issues: SaveIssue[];
  onDirty: () => void;
  onReject: (issues: SaveIssue[]) => void;
  onSaved: (next: AdminSelection) => void;
  onRemove: () => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  function apply(result: StoreResult, next: (id: string) => AdminSelection) {
    if (!result.ok) {
      onReject(result.issues);
      return;
    }
    onSaved(next(result.id));
  }

  if (selection.kind === "pick") {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
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
        onSave={(draft) =>
          apply(createModule(draft), (moduleId) => ({
            kind: "module",
            moduleId,
          }))
        }
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
        onSave={(draft) =>
          apply(updateModule(selection.moduleId, draft), (moduleId) => ({
            kind: "module",
            moduleId,
          }))
        }
        onRemove={onRemove}
      />
    );
  }

  if (selection.kind === "new-topic") {
    return (
      <AdminTopicForm
        title={copy.newTopic}
        initial={{ names: { ...emptyLocalizedText } }}
        issues={issues}
        onDirty={onDirty}
        onSave={(draft) =>
          apply(createTopic(selection.moduleId, draft), (topicId) => ({
            kind: "topic",
            moduleId: selection.moduleId,
            topicId,
          }))
        }
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
        initial={{ names: { ...topic.names } }}
        issues={issues}
        onDirty={onDirty}
        onSave={(draft) =>
          apply(
            updateTopic(selection.moduleId, selection.topicId, draft),
            (topicId) => ({
              kind: "topic",
              moduleId: selection.moduleId,
              topicId,
            }),
          )
        }
        onRemove={onRemove}
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
        onSave={(draft) =>
          apply(createCard(selection.moduleId, selection.topicId, draft), (cardId) => ({
            kind: "card",
            moduleId: selection.moduleId,
            topicId: selection.topicId,
            cardId,
          }))
        }
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
      onSave={(draft) =>
        apply(
          updateCard(
            selection.moduleId,
            selection.topicId,
            selection.cardId,
            draft,
          ),
          (cardId) => ({
            kind: "card",
            moduleId: selection.moduleId,
            topicId: selection.topicId,
            cardId,
          }),
        )
      }
      onRemove={onRemove}
    />
  );
}
