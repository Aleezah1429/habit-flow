import { format } from 'date-fns';
import type { DateKey } from './types';

export function todayKey(): DateKey {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatToday(date: Date): string {
  return format(date, 'EEEE, MMMM d');
}
