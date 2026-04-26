'use client';

import { icons } from 'lucide-react';
import { COLOR_OPTIONS, type Habit } from '@/lib/types';
import { HabitMenu } from './HabitMenu';
import { CheckButton } from './CheckButton';

interface HabitCardProps {
  habit: Habit;
  checked: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, checked, onToggle, onEdit, onDelete }: HabitCardProps) {
  const Icon = icons[habit.iconName];
  const color = COLOR_OPTIONS.find((c) => c.name === habit.color) ?? COLOR_OPTIONS[0];

  const cardBg = checked
    ? `${color.bgSoftClass} border-transparent dark:bg-zinc-800/60`
    : 'bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700';

  return (
    <article
      data-checked={checked}
      className={`group flex items-center gap-3 rounded-xl border p-4 transition hover:shadow-sm ${cardBg}`}
    >
      <CheckButton
        checked={checked}
        color={habit.color}
        habitName={habit.name}
        onToggle={onToggle}
      />
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color.bgSoftClass} ${color.textClass} dark:brightness-110`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 truncate">
        <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {habit.name}
        </h3>
      </div>
      <HabitMenu onEdit={onEdit} onDelete={onDelete} />
    </article>
  );
}
