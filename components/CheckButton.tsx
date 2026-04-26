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
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 dark:focus-visible:ring-offset-zinc-900';

  const variant = checked
    ? `${palette.swatchClass} text-white shadow-sm hover:brightness-110 active:scale-95`
    : 'border-2 border-zinc-300 text-transparent hover:border-zinc-500 hover:bg-zinc-50 active:scale-95 dark:border-zinc-600 dark:hover:border-zinc-400 dark:hover:bg-zinc-800';

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
      <Check
        size={16}
        strokeWidth={3.5}
        className={`transition-all duration-200 ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
      />
    </button>
  );
}
