"use client";

import type { ReactNode } from "react";
import {
  cardLabel,
  topicListMeta,
  type CurriculumModule,
} from "@/lib/curriculum";
import { adminCopy } from "@/lib/admin-copy";
import { studyCopy, topicListLine } from "@/lib/study-copy";
import type { AdminSelection } from "@/lib/admin-selection";
import { MoveButtons } from "@/components/admin-fields";
import { useLocale } from "@/components/locale-provider";

export function AdminTree({
  modules,
  selection,
  onSelect,
  onAddModule,
  onAddTopic,
  onAddCard,
  onMoveModule,
  onMoveTopic,
  onMoveCard,
}: {
  modules: CurriculumModule[];
  selection: AdminSelection;
  onSelect: (next: AdminSelection) => void;
  onAddModule: () => void;
  onAddTopic: (moduleId: string) => void;
  onAddCard: (
    moduleId: string,
    topicId: string,
    cardType: "theory" | "exercise",
  ) => void;
  onMoveModule: (moduleId: string, direction: -1 | 1) => void;
  onMoveTopic: (moduleId: string, topicId: string, direction: -1 | 1) => void;
  onMoveCard: (
    moduleId: string,
    topicId: string,
    cardId: string,
    direction: -1 | 1,
  ) => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  const selectedModuleId =
    selection.kind === "pick" || selection.kind === "new-module"
      ? undefined
      : selection.moduleId;
  const selectedTopicId =
    selection.kind === "topic" ||
    selection.kind === "card" ||
    selection.kind === "new-card"
      ? selection.topicId
      : undefined;

  return (
    <nav
      className="rounded-lg border border-line bg-white p-4"
      aria-label={copy.modules}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium tracking-wide text-muted uppercase">
          {copy.modules}
        </h2>
        <button
          type="button"
          onClick={onAddModule}
          className="cursor-pointer rounded-md border border-line bg-highlight px-2.5 py-1 text-xs font-bold text-accent-deep hover:border-accent"
        >
          {copy.addModule}
        </button>
      </div>

      <TreeLevel
        empty={copy.emptyModules}
        items={modules.map((item) => ({
          id: item.id,
          label: item.names[locale],
          meta: item.status === "open" ? copy.statusOpen : copy.statusLater,
          selected:
            selection.kind === "module" && selection.moduleId === item.id,
          onSelect: () => onSelect({ kind: "module", moduleId: item.id }),
          onMove: (direction) => onMoveModule(item.id, direction),
          expanded:
            selectedModuleId === item.id ? (
              <>
                <TreeLevel
                  nested
                  empty={copy.emptyTopics}
                  items={item.topics.map((topic) => ({
                    id: topic.id,
                    label: topic.names[locale],
                    meta: topicListLine(
                      topicListMeta(topic),
                      studyCopy[locale],
                    ),
                    selected:
                      selection.kind === "topic" &&
                      selection.topicId === topic.id,
                    onSelect: () =>
                      onSelect({
                        kind: "topic",
                        moduleId: item.id,
                        topicId: topic.id,
                      }),
                    onMove: (direction) =>
                      onMoveTopic(item.id, topic.id, direction),
                    expanded:
                      selectedTopicId === topic.id ? (
                        <>
                          <TreeLevel
                            nested
                            empty={copy.emptyCards}
                            items={topic.cards.map((card) => ({
                              id: card.id,
                              label: cardLabel(card, locale),
                              meta:
                                card.type === "theory"
                                  ? copy.theoryBadge
                                  : copy.exerciseBadge,
                              selected:
                                selection.kind === "card" &&
                                selection.cardId === card.id,
                              onSelect: () =>
                                onSelect({
                                  kind: "card",
                                  moduleId: item.id,
                                  topicId: topic.id,
                                  cardId: card.id,
                                }),
                              onMove: (direction) =>
                                onMoveCard(
                                  item.id,
                                  topic.id,
                                  card.id,
                                  direction,
                                ),
                            }))}
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            <GhostButton
                              onClick={() =>
                                onAddCard(item.id, topic.id, "theory")
                              }
                            >
                              {copy.addTheory}
                            </GhostButton>
                            <GhostButton
                              onClick={() =>
                                onAddCard(item.id, topic.id, "exercise")
                              }
                            >
                              {copy.addExercise}
                            </GhostButton>
                          </div>
                        </>
                      ) : undefined,
                  }))}
                />
                <div className="mt-2">
                  <GhostButton onClick={() => onAddTopic(item.id)}>
                    {copy.addTopic}
                  </GhostButton>
                </div>
              </>
            ) : undefined,
        }))}
      />
    </nav>
  );
}

function TreeLevel({
  items,
  empty,
  nested = false,
}: {
  items: {
    id: string;
    label: string;
    meta?: string;
    selected: boolean;
    onSelect: () => void;
    onMove: (direction: -1 | 1) => void;
    expanded?: ReactNode;
  }[];
  empty: string;
  nested?: boolean;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];

  if (items.length === 0) {
    return (
      <p
        className={
          nested ? "mb-2 text-xs text-muted" : "mt-4 text-sm text-muted"
        }
      >
        {empty}
      </p>
    );
  }

  return (
    <ol className={nested ? "space-y-2" : "mt-4 space-y-2"}>
      {items.map((item, index) => (
        <li key={item.id}>
          <TreeRow
            label={item.label}
            meta={item.meta}
            selected={item.selected}
            nested={nested}
            onClick={item.onSelect}
          >
            <MoveButtons
              upLabel={copy.moveUp}
              downLabel={copy.moveDown}
              disableUp={index === 0}
              disableDown={index === items.length - 1}
              onUp={() => item.onMove(-1)}
              onDown={() => item.onMove(1)}
            />
          </TreeRow>
          {item.expanded ? (
            <div className="mt-2 ml-3 border-l border-line pl-3">
              {item.expanded}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function GhostButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-md border border-dashed border-line px-2.5 py-1 text-xs font-bold text-muted hover:border-accent hover:text-ink"
    >
      {children}
    </button>
  );
}

function TreeRow({
  label,
  meta,
  selected,
  nested,
  onClick,
  children,
}: {
  label: string;
  meta?: string;
  selected: boolean;
  nested?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
        selected
          ? "border-accent bg-highlight"
          : "border-transparent bg-space hover:border-line"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="min-w-0 flex-1 cursor-pointer text-left"
      >
        <span
          className={`block truncate ${nested ? "text-sm" : "text-sm font-medium"} text-ink`}
        >
          {label}
        </span>
        {meta ? (
          <span className="block text-[11px] text-muted">{meta}</span>
        ) : null}
      </button>
      {children}
    </div>
  );
}
