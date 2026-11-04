"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import { ModuleGlyph, ModuleStop, type ModuleStopConnector } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { sessionIsAdmin } from "@/lib/mock-auth";
import { moduleStopState } from "@/lib/module-stop";
import { studyCopy } from "@/lib/study-copy";
import { useFinishedCards, useFirstAttempts } from "@/lib/study-progress";

/** Modules per row on the study map. The path snakes back on the next row. */
const MAP_COLUMNS = 4;

function snakeCell(
  index: number,
  columns: number,
  count: number,
): { row: number; column: number; connector: ModuleStopConnector | null } {
  const row = Math.floor(index / columns);
  const indexInRow = index % columns;
  const reversed = row % 2 === 1;
  const column = reversed ? columns - indexInRow : indexInRow + 1;
  const nextIndex = index + 1;
  if (nextIndex >= count) return { row, column, connector: null };

  const nextSameRow = Math.floor(nextIndex / columns) === row;
  return {
    row,
    column,
    connector: nextSameRow ? (reversed ? "left" : "right") : "down",
  };
}

export function StudyView() {
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = studyCopy[locale];
  const modules = useCurriculumModules();
  const unlockAll = sessionIsAdmin(session);
  const finished = useFinishedCards();
  const firstClean = useFirstAttempts();
  const stops = modules.map((item, index) => ({
    item,
    state: moduleStopState(item, finished, firstClean, unlockAll),
    cell: snakeCell(index, MAP_COLUMNS, modules.length),
  }));
  const currentModuleId = stops.find((stop) => stop.state.kind === "open")?.item.id;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-6">
        <h1 id="module-list-label" className="text-3xl font-bold tracking-tight text-ink">
          {copy.title}
        </h1>
      </header>

      <ol
        className="mt-8 grid gap-x-3 gap-y-10 sm:gap-x-8 sm:gap-y-14"
        style={{ gridTemplateColumns: `repeat(${MAP_COLUMNS}, minmax(0, 1fr))` }}
        aria-labelledby="module-list-label"
      >
        {stops.map(({ item, state, cell }) => {
          return (
            <li
              key={item.id}
              className="relative"
              style={{ gridColumn: cell.column, gridRow: cell.row + 1 }}
            >
              <ModuleStop
                name={item.names[locale]}
                state={state}
                accessibleLabel={copy.folder}
                copy={copy}
                href={`/study/${item.id}`}
                connector={cell.connector}
                current={item.id === currentModuleId}
                leading={<ModuleGlyph moduleId={item.id} state={state} />}
              />
            </li>
          );
        })}
      </ol>
    </main>
  );
}
