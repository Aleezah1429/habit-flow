'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Habit } from '@/lib/types';
import {
  getHabits,
  addHabit as addHabitStorage,
  updateHabit as updateHabitStorage,
  deleteHabit as deleteHabitStorage,
  type HabitInput,
} from '@/lib/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(getHabits());
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
  }, []);

  return { habits, hydrated, add, update, remove };
}
