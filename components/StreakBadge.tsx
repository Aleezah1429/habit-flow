'use client';

import { Flame } from 'lucide-react';
import type { StreakSummary } from '@/lib/streak';

interface StreakBadgeProps {
  summary: StreakSummary;
}

export function StreakBadge({ summary }: StreakBadgeProps) {
  const { current, longest } = summary;

  if (current === 0 && longest === 0) {
    return (
      <div
        aria-label="No streak yet"
        className="text-right text-xs text-zinc-400 dark:text-zinc-500"
      >
        No streak yet
      </div>
    );
  }

  const dayWord = current === 1 ? 'day' : 'days';

  return (
    <div
      aria-label={`${current} ${dayWord} current streak, best ${longest}`}
      className="flex flex-col items-end leading-tight"
    >
      <span className="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
        <Flame size={14} strokeWidth={2.5} />
        {current} {dayWord}
      </span>
      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
        Best {longest}
      </span>
    </div>
  );
}
