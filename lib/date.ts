import { addDays as addDaysFns, format, parseISO, startOfWeek, subDays } from 'date-fns';
import type { DateKey } from './types';

const KEY = 'yyyy-MM-dd';

export function todayKey(): DateKey {
  return format(new Date(), KEY);
}

export function formatToday(date: Date): string {
  return format(date, 'EEEE, MMMM d');
}

export function previousDay(dateKey: DateKey): DateKey {
  return format(subDays(parseISO(dateKey), 1), KEY);
}

export function addDays(dateKey: DateKey, n: number): DateKey {
  return format(addDaysFns(parseISO(dateKey), n), KEY);
}

export function mondayOfWeek(dateKey: DateKey): DateKey {
  return format(startOfWeek(parseISO(dateKey), { weekStartsOn: 1 }), KEY);
}

export function buildHeatmapGrid(todayKey: DateKey, weeks = 12): DateKey[][] {
  const lastMonday = mondayOfWeek(todayKey);
  const firstMonday = addDays(lastMonday, -(weeks - 1) * 7);
  const cols: DateKey[][] = [];
  for (let w = 0; w < weeks; w++) {
    const colStart = addDays(firstMonday, w * 7);
    const col: DateKey[] = [];
    for (let d = 0; d < 7; d++) {
      col.push(addDays(colStart, d));
    }
    cols.push(col);
  }
  return cols;
}

export function formatHeatmapTitle(dateKey: DateKey, done: boolean): string {
  return `${format(parseISO(dateKey), 'EEE, MMM d')} — ${done ? 'done' : 'not done'}`;
}
