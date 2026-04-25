'use client';

import { useState } from 'react';
import { Plus, Sprout } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { HabitFormDialog, type HabitFormValues } from '@/components/HabitFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Habit } from '@/lib/types';

type DialogState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; habit: Habit };

export default function Home() {
  const { habits, hydrated, add, update, remove } = useHabits();
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' });
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  function handleSubmit(values: HabitFormValues) {
    if (dialog.kind === 'create') add(values);
    if (dialog.kind === 'edit') update(dialog.habit.id, values);
    setDialog({ kind: 'closed' });
  }

  function confirmDelete() {
    if (pendingDelete) remove(pendingDelete.id);
    setPendingDelete(null);
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            HabitFlow
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Build daily habits, one tick at a time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ kind: 'create' })}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={16} /> New habit
        </button>
      </header>

      <section className="mt-8">
        {hydrated && habits.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            <Sprout size={32} className="text-zinc-400" />
            <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              No habits yet
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Click <span className="font-medium">New habit</span> to start your first one.
            </p>
          </div>
        )}

        {habits.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={() => setDialog({ kind: 'edit', habit })}
                onDelete={() => setPendingDelete(habit)}
              />
            ))}
          </div>
        )}
      </section>

      <HabitFormDialog
        open={dialog.kind !== 'closed'}
        mode={dialog.kind === 'edit' ? 'edit' : 'create'}
        initial={
          dialog.kind === 'edit'
            ? {
                name: dialog.habit.name,
                iconName: dialog.habit.iconName,
                color: dialog.habit.color,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => setDialog({ kind: 'closed' })}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete habit?"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </main>
  );
}
