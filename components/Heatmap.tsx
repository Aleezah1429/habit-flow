'use client';

import { useMemo } from 'react';
import { COLOR_OPTIONS, type DateKey, type HabitColor } from '@/lib/types';
import { buildHeatmapGrid, formatHeatmapTitle } from '@/lib/date';

interface HeatmapProps {
  dates: readonly DateKey[];
  todayKey: DateKey;
  color: HabitColor;
  habitName: string;
  onToggle: (dateKey: DateKey) => void;
}

const WEEKS = 12;

export function Heatmap({ dates, todayKey, color, habitName, onToggle }: HeatmapProps) {
  const palette = COLOR_OPTIONS.find((c) => c.name === color) ?? COLOR_OPTIONS[0];
  const grid = useMemo(() => buildHeatmapGrid(todayKey, WEEKS), [todayKey]);
  const doneSet = useMemo(() => new Set(dates), [dates]);

  return (
    <div
      role="grid"
      aria-label={`${habitName} — last ${WEEKS} weeks of history`}
      className="grid grid-flow-col gap-1"
      style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))', gridAutoColumns: 'minmax(0, 1fr)' }}
    >
      {grid.map((week) =>
        week.map((dateKey) => {
          const isFuture = dateKey > todayKey;
          const isToday = dateKey === todayKey;
          const isDone = doneSet.has(dateKey);

          if (isFuture) {
            return (
              <span
                key={dateKey}
                role="gridcell"
                aria-disabled="true"
                aria-label={`${dateKey} — upcoming`}
                className="aspect-square rounded-[3px] bg-zinc-100/40 ring-1 ring-zinc-200/60 dark:bg-zinc-800/40 dark:ring-zinc-700/40"
              />
            );
          }

          const fill = isDone
            ? `${palette.swatchClass} hover:brightness-110`
            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700';
          const todayRing = isToday && !isDone ? ' ring-1 ring-zinc-400 dark:ring-zinc-500' : '';

          return (
            <button
              key={dateKey}
              type="button"
              role="gridcell"
              title={formatHeatmapTitle(dateKey, isDone)}
              aria-label={formatHeatmapTitle(dateKey, isDone)}
              aria-pressed={isDone}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(dateKey);
              }}
              className={`aspect-square rounded-[3px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${fill}${todayRing}`}
            />
          );
        }),
      )}
    </div>
  );
}
