import type { Habit, HabitColor, HabitIconName } from './types';
import { newId } from './ids';

const STORAGE_KEY = 'habit-flow:v1';

interface StorageShape {
  habits: Habit[];
}

function read(): StorageShape {
  if (typeof window === 'undefined') return { habits: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'habits' in parsed &&
      Array.isArray((parsed as StorageShape).habits)
    ) {
      return parsed as StorageShape;
    }
    return { habits: [] };
  } catch {
    return { habits: [] };
  }
}

function write(data: StorageShape): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getHabits(): Habit[] {
  return read().habits;
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
  write(data);
}
