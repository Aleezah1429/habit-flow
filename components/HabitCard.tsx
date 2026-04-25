'use client';

import { icons } from 'lucide-react';
import { COLOR_OPTIONS, type Habit } from '@/lib/types';
import { HabitMenu } from './HabitMenu';

interface HabitCardProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const Icon = icons[habit.iconName];
  const color = COLOR_OPTIONS.find((c) => c.name === habit.color) ?? COLOR_OPTIONS[0];

  return (
    <article className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color.bgSoftClass} ${color.textClass} dark:brightness-110`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 truncate">
        <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{habit.name}</h3>
      </div>
      <HabitMenu onEdit={onEdit} onDelete={onDelete} />
    </article>
  );
}
