'use client';

import { useState } from 'react';
import { icons, ChevronDown } from 'lucide-react';
import { COLOR_OPTIONS, type Habit, type DateKey } from '@/lib/types';
import { computeStreaks } from '@/lib/streak';
import { HabitMenu } from './HabitMenu';
import { CheckButton } from './CheckButton';
import { StreakBadge } from './StreakBadge';
import { Heatmap } from './Heatmap';

interface HabitCardProps {
  habit: Habit;
  checked: boolean;
  dates: readonly DateKey[];
  todayKey: DateKey;
  onToggle: () => void;
  onToggleDate: (dateKey: DateKey) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({
  habit,
  checked,
  dates,
  todayKey,
  onToggle,
  onToggleDate,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const Icon = icons[habit.iconName];
  const color = COLOR_OPTIONS.find((c) => c.name === habit.color) ?? COLOR_OPTIONS[0];
  const summary = computeStreaks(dates, todayKey);
  const [expanded, setExpanded] = useState(false);

  const cardBase =
    'group relative flex flex-col rounded-2xl border p-5 pr-10 transition-all duration-200';
  const cardVariant = checked
    ? `${color.bgSoftClass} border-transparent shadow-sm dark:bg-zinc-800/60 dark:border-zinc-700/40`
    : 'border-zinc-200/70 bg-white/80 backdrop-blur-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700';

  return (
    <article data-checked={checked} className={`${cardBase} ${cardVariant}`}>
      {/* Top row — identity */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.bgSoftClass} ${color.textClass} ring-1 ring-inset ring-black/5 dark:ring-white/10 dark:brightness-110`}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={`truncate text-base font-medium text-zinc-900 dark:text-zinc-50 ${
              checked ? 'line-through decoration-zinc-400/60 decoration-2' : ''
            }`}
          >
            {habit.name}
          </h3>
        </div>
      </div>

      {/* Bottom row — actions + status */}
      <div className="mt-4 flex items-center gap-3">
        <CheckButton
          checked={checked}
          color={habit.color}
          habitName={habit.name}
          onToggle={onToggle}
        />
        <div className="flex-1">
          <StreakBadge summary={summary} />
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? 'Hide history' : 'Show history'}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Heatmap when expanded */}
      {expanded && (
        <div className="mt-4 border-t border-zinc-200/60 pt-4 dark:border-zinc-700/50">
          <Heatmap
            dates={dates}
            todayKey={todayKey}
            color={habit.color}
            habitName={habit.name}
            onToggle={onToggleDate}
          />
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            Last 12 weeks · click a cell to toggle that day
          </p>
        </div>
      )}

      <div className="absolute right-2 top-2">
        <HabitMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}
