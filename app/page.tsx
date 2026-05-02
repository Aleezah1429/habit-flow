'use client';

import { useState } from 'react';
import { Plus, Sprout } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/HabitCard';
import { HabitFormDialog, type HabitFormValues } from '@/components/HabitFormDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TodayHeader } from '@/components/TodayHeader';
import { todayKey } from '@/lib/date';
import type { Habit } from '@/lib/types';

type DialogState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; habit: Habit };

export default function Home() {
  const {
    habits,
    completions,
    hydrated,
    add,
    update,
    remove,
    toggleToday,
    toggleDate,
    isDoneToday,
  } = useHabits();
  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' });
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  const today = todayKey();
  const total = habits.length;
  const doneCount = hydrated ? habits.filter((h) => isDoneToday(h.id)).length : 0;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const allDone = total > 0 && doneCount === total;

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
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm shadow-blue-500/25"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5l4 4 10-11" />
            </svg>
          </span>
          <div>
            <p className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-xs font-semibold uppercase tracking-[0.18em] text-transparent dark:from-blue-400 dark:to-cyan-300">
              HabitFlow
            </p>
            <TodayHeader />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ kind: 'create' })}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition hover:brightness-110 active:scale-[0.98]"
        >
          <Plus size={16} /> New habit
        </button>
      </header>

      {hydrated && total > 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-200/70 bg-white/60 p-4 backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/40">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {allDone ? 'All done for today 🎉' : "Today's progress"}
            </p>
            <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{doneCount}</span>
              <span> / {total}</span>
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-[width] duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <section className="mt-8">
        {hydrated && habits.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/40">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-400/10 text-blue-500 dark:text-blue-400">
              <Sprout size={28} />
            </span>
            <p className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
              No habits yet
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Click <span className="font-medium text-zinc-700 dark:text-zinc-200">New habit</span> to start your first one.
            </p>
          </div>
        )}

        {habits.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                checked={isDoneToday(habit.id)}
                dates={completions[habit.id] ?? []}
                todayKey={today}
                onToggle={() => toggleToday(habit.id)}
                onToggleDate={(dateKey) => toggleDate(habit.id, dateKey)}
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
