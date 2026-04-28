import { format, parseISO, subDays } from 'date-fns';
import type { DateKey } from './types';

export function todayKey(): DateKey {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatToday(date: Date): string {
  return format(date, 'EEEE, MMMM d');
}

export function previousDay(dateKey: DateKey): DateKey {
  return format(subDays(parseISO(dateKey), 1), 'yyyy-MM-dd');
}
