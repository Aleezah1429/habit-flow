'use client';

import { COLOR_OPTIONS, type HabitColor } from '@/lib/types';

interface ColorPickerProps {
  value: HabitColor;
  onChange: (value: HabitColor) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((opt) => {
        const selected = value === opt.name;
        return (
          <button
            key={opt.name}
            type="button"
            onClick={() => onChange(opt.name)}
            aria-label={opt.name}
            aria-pressed={selected}
            className={`h-8 w-8 rounded-full ${opt.swatchClass} transition ${
              selected ? `ring-2 ring-offset-2 ${opt.ringClass} dark:ring-offset-zinc-900` : ''
            }`}
          />
        );
      })}
    </div>
  );
}
