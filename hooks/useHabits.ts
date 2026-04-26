'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Habit, Completions } from '@/lib/types';
import {
  getHabits,
  getCompletions,
  addHabit as addHabitStorage,
  updateHabit as updateHabitStorage,
  deleteHabit as deleteHabitStorage,
  markDone,
  unmarkDone,
  type HabitInput,
} from '@/lib/storage';
import { todayKey } from '@/lib/date';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completions>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(getHabits());
    setCompletions(getCompletions());
    setHydrated(true);
  }, []);

  const add = useCallback((input: HabitInput) => {
    const habit = addHabitStorage(input);
    setHabits((prev) => [...prev, habit]);
  }, []);

  const update = useCallback((id: string, patch: Partial<HabitInput>) => {
    updateHabitStorage(id, patch);
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
              ...(patch.iconName !== undefined ? { iconName: patch.iconName } : {}),
              ...(patch.color !== undefined ? { color: patch.color } : {}),
            }
          : h,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    deleteHabitStorage(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleToday = useCallback((habitId: string) => {
    const key = todayKey();
    setCompletions((prev) => {
      const existing = prev[habitId] ?? [];
      const isOn = existing.includes(key);
      if (isOn) {
        unmarkDone(habitId, key);
        return { ...prev, [habitId]: existing.filter((d) => d !== key) };
      }
      markDone(habitId, key);
      return { ...prev, [habitId]: [...existing, key] };
    });
  }, []);

  const isDoneToday = useCallback(
    (habitId: string): boolean => {
      const key = todayKey();
      return completions[habitId]?.includes(key) ?? false;
    },
    [completions],
  );

  return { habits, completions, hydrated, add, update, remove, toggleToday, isDoneToday };
}
