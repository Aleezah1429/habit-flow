'use client';

import { icons } from 'lucide-react';
import { ICON_OPTIONS, type HabitIconName } from '@/lib/types';

interface IconPickerProps {
  value: HabitIconName;
  onChange: (value: HabitIconName) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICON_OPTIONS.map((name) => {
        const Icon = icons[name];
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-label={name}
            aria-pressed={selected}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              selected
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
