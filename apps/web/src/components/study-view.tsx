"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import { FolderMark, ModuleStop } from "@/components/study-row";
import { useLocale } from "@/components/locale-provider";
import { moduleAvailability } from "@/lib/curriculum";
import { useCurriculumModules } from "@/lib/curriculum-store";
import { sessionIsAdmin } from "@/lib/mock-auth";
import { studyCopy } from "@/lib/study-copy";

/** Modules per row on the study map. The path snakes back on the next row. */
const MAP_COLUMNS = 4;

type SnakeConnector = "left" | "right" | "down";

function snakeCell(
  index: number,
  columns: number,
  count: number,
): { row: number; column: number; connector: SnakeConnector | null } {
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

function MapDots({
  axis,
  className,
}: {
  axis: "x" | "y";
  className: string;
}) {
  const horizontal = axis === "x";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--color-accent) 1.5px, transparent 1.7px)",
        backgroundSize: horizontal ? "7px 4px" : "4px 7px",
        backgroundRepeat: horizontal ? "repeat-x" : "repeat-y",
        backgroundPosition: "center",
      }}
    />
  );
}

export function StudyView() {
  const { locale } = useLocale();
  const { session } = useMockAuth();
  const copy = studyCopy[locale];
  const modules = useCurriculumModules();
  const unlockAll = sessionIsAdmin(session);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <header className="border-b border-line pb-6">
        <h1 id="module-list-label" className="text-3xl font-bold tracking-tight text-ink">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-xl text-muted">{copy.intro}</p>
      </header>

      <ol
        className="mt-8 grid gap-x-3 gap-y-10 sm:gap-x-8 sm:gap-y-14"
        style={{ gridTemplateColumns: `repeat(${MAP_COLUMNS}, minmax(0, 1fr))` }}
        aria-labelledby="module-list-label"
      >
        {modules.map((item, index) => {
          const lock = moduleAvailability(item.status, unlockAll);
          const open = lock !== "locked";
          const cell = snakeCell(index, MAP_COLUMNS, modules.length);

          return (
            <li
              key={item.id}
              className="relative"
              style={{ gridColumn: cell.column, gridRow: cell.row + 1 }}
            >
              {cell.connector === "left" || cell.connector === "right" ? (
                <MapDots
                  axis="x"
                  className={`top-1/2 h-1 w-3 -translate-y-1/2 sm:w-8 ${
                    cell.connector === "left" ? "right-full" : "left-full"
                  }`}
                />
              ) : null}
              {cell.connector === "down" ? (
                <MapDots
                  axis="y"
                  className="top-full left-1/2 h-10 w-1 -translate-x-1/2 sm:h-14"
                />
              ) : null}
              <ModuleStop
                name={item.names[locale]}
                badge={item.status === "open" ? copy.open : copy.comingLater}
                accessibleLabel={copy.folder}
                locked={!open}
                href={`/study/${item.id}`}
                leading={<FolderMark active={open} locked={!open} />}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">{copy.mockNote}</p>
    </main>
  );
}
