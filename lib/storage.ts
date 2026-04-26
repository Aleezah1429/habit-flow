import type { Habit, HabitColor, HabitIconName, Completions, DateKey } from './types';
import { newId } from './ids';

const STORAGE_KEY = 'habit-flow:v1';

interface StorageShape {
  habits: Habit[];
  completions: Completions;
}

function emptyShape(): StorageShape {
  return { habits: [], completions: {} };
}

function read(): StorageShape {
  if (typeof window === 'undefined') return emptyShape();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyShape();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return emptyShape();
    const obj = parsed as Partial<StorageShape>;
    const habits = Array.isArray(obj.habits) ? obj.habits : [];
    const completions =
      obj.completions && typeof obj.completions === 'object' && !Array.isArray(obj.completions)
        ? sanitizeCompletions(obj.completions as Record<string, unknown>)
        : {};
    return { habits, completions };
  } catch {
    return emptyShape();
  }
}

function sanitizeCompletions(raw: Record<string, unknown>): Completions {
  const out: Completions = {};
  for (const [habitId, dates] of Object.entries(raw)) {
    if (Array.isArray(dates) && dates.every((d) => typeof d === 'string')) {
      out[habitId] = dates as DateKey[];
    }
  }
  return out;
}

function write(data: StorageShape): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getHabits(): Habit[] {
  return read().habits;
}

export function getCompletions(): Completions {
  return read().completions;
}

export interface HabitInput {
  name: string;
  iconName: HabitIconName;
  color: HabitColor;
}

export function addHabit(input: HabitInput): Habit {
  const habit: Habit = {
    id: newId(),
    name: input.name.trim(),
    iconName: input.iconName,
    color: input.color,
    createdAt: new Date().toISOString(),
  };
  const data = read();
  data.habits = [...data.habits, habit];
  write(data);
  return habit;
}

export function updateHabit(id: string, patch: Partial<HabitInput>): void {
  const data = read();
  data.habits = data.habits.map((h) =>
    h.id === id
      ? {
          ...h,
          ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
          ...(patch.iconName !== undefined ? { iconName: patch.iconName } : {}),
          ...(patch.color !== undefined ? { color: patch.color } : {}),
        }
      : h,
  );
  write(data);
}

export function deleteHabit(id: string): void {
  const data = read();
  data.habits = data.habits.filter((h) => h.id !== id);
  if (id in data.completions) {
    const next = { ...data.completions };
    delete next[id];
    data.completions = next;
  }
  write(data);
}

export function markDone(habitId: string, dateKey: DateKey): void {
  const data = read();
  const existing = data.completions[habitId] ?? [];
  if (existing.includes(dateKey)) return;
  data.completions = { ...data.completions, [habitId]: [...existing, dateKey] };
  write(data);
}

export function unmarkDone(habitId: string, dateKey: DateKey): void {
  const data = read();
  const existing = data.completions[habitId];
  if (!existing || !existing.includes(dateKey)) return;
  data.completions = {
    ...data.completions,
    [habitId]: existing.filter((d) => d !== dateKey),
  };
  write(data);
}

export function isDone(habitId: string, dateKey: DateKey): boolean {
  const dates = read().completions[habitId];
  return Array.isArray(dates) && dates.includes(dateKey);
}
