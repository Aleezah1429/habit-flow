'use client';

import { icons } from 'lucide-react';
import { COLOR_OPTIONS, type Habit, type DateKey } from '@/lib/types';
import { computeStreaks } from '@/lib/streak';
import { HabitMenu } from './HabitMenu';
import { CheckButton } from './CheckButton';
import { StreakBadge } from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  checked: boolean;
  dates: readonly DateKey[];
  todayKey: DateKey;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({
  habit,
  checked,
  dates,
  todayKey,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const Icon = icons[habit.iconName];
  const color = COLOR_OPTIONS.find((c) => c.name === habit.color) ?? COLOR_OPTIONS[0];
  const summary = computeStreaks(dates, todayKey);

  const cardBase =
    'group relative flex items-center gap-3 rounded-2xl border p-4 pr-10 transition-all duration-200';
  const cardVariant = checked
    ? `${color.bgSoftClass} border-transparent shadow-sm dark:bg-zinc-800/60 dark:border-zinc-700/40`
    : 'border-zinc-200/70 bg-white/80 backdrop-blur-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700';

  return (
    <article data-checked={checked} className={`${cardBase} ${cardVariant}`}>
      <CheckButton
        checked={checked}
        color={habit.color}
        habitName={habit.name}
        onToggle={onToggle}
      />
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color.bgSoftClass} ${color.textClass} ring-1 ring-inset ring-black/5 dark:ring-white/10 dark:brightness-110`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className={`truncate text-sm font-medium text-zinc-900 dark:text-zinc-50 ${
            checked ? 'line-through decoration-zinc-400/60 decoration-2' : ''
          }`}
        >
          {habit.name}
        </h3>
      </div>
      <StreakBadge summary={summary} />
      <div className="absolute right-2 top-2">
        <HabitMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}
