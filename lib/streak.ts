import { previousDay } from './date';
import type { DateKey } from './types';

export interface StreakSummary {
  current: number;
  longest: number;
}

export function currentStreak(dates: readonly DateKey[], todayKey: DateKey): number {
  const set = new Set(dates);
  if (!set.has(todayKey)) return 0;
  let count = 0;
  let cursor = todayKey;
  while (set.has(cursor)) {
    count += 1;
    cursor = previousDay(cursor);
  }
  return count;
}

export function longestStreak(dates: readonly DateKey[], todayKey?: DateKey): number {
  const cleaned = Array.from(new Set(dates))
    .filter((d) => (todayKey ? d <= todayKey : true))
    .sort();
  if (cleaned.length === 0) return 0;

  let best = 1;
  let run = 1;
  for (let i = 1; i < cleaned.length; i++) {
    if (previousDay(cleaned[i]) === cleaned[i - 1]) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

export function computeStreaks(dates: readonly DateKey[], todayKey: DateKey): StreakSummary {
  return {
    current: currentStreak(dates, todayKey),
    longest: longestStreak(dates, todayKey),
  };
}
