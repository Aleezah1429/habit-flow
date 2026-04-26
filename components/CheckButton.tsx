'use client';

import { Check } from 'lucide-react';
import { COLOR_OPTIONS, type HabitColor } from '@/lib/types';

interface CheckButtonProps {
  checked: boolean;
  color: HabitColor;
  habitName: string;
  onToggle: () => void;
}

export function CheckButton({ checked, color, habitName, onToggle }: CheckButtonProps) {
  const palette = COLOR_OPTIONS.find((c) => c.name === color) ?? COLOR_OPTIONS[0];

  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500';

  const variant = checked
    ? `${palette.swatchClass} text-white hover:brightness-110`
    : 'border-2 border-zinc-300 text-transparent hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500';

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={
        checked
          ? `Unmark ${habitName} as done today`
          : `Mark ${habitName} as done today`
      }
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`${base} ${variant}`}
    >
      <Check size={16} strokeWidth={3} className={checked ? 'opacity-100' : 'opacity-0'} />
    </button>
  );
}
