'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ICON_OPTIONS,
  COLOR_OPTIONS,
  NAME_MAX_LENGTH,
  type HabitColor,
  type HabitIconName,
} from '@/lib/types';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';

export interface HabitFormValues {
  name: string;
  iconName: HabitIconName;
  color: HabitColor;
}

interface HabitFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: HabitFormValues;
  onSubmit: (values: HabitFormValues) => void;
  onCancel: () => void;
}

const DEFAULTS: HabitFormValues = {
  name: '',
  iconName: ICON_OPTIONS[0],
  color: COLOR_OPTIONS[0].name,
};

export function HabitFormDialog({
  open,
  mode,
  initial,
  onSubmit,
  onCancel,
}: HabitFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<HabitFormValues>(initial ?? DEFAULTS);

  useEffect(() => {
    if (open) setValues(initial ?? DEFAULTS);
  }, [open, initial]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const trimmed = values.name.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSubmit({ ...values, name: trimmed });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="m-auto rounded-2xl p-0 shadow-2xl backdrop:bg-zinc-900/40 backdrop:backdrop-blur-md"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-[min(92vw,440px)] bg-white p-6 dark:bg-zinc-900"
      >
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {mode === 'create' ? 'New habit' : 'Edit habit'}
        </h2>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</span>
          <input
            ref={inputRef}
            type="text"
            value={values.name}
            maxLength={NAME_MAX_LENGTH}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="e.g. Read 20 mins"
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
          />
          {!canSave && trimmed.length === 0 && (
            <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
              Give your habit a short name.
            </span>
          )}
        </label>

        <div className="mt-5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Icon</span>
          <div className="mt-2">
            <IconPicker
              value={values.iconName}
              onChange={(iconName) => setValues((v) => ({ ...v, iconName }))}
            />
          </div>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Color</span>
          <div className="mt-2">
            <ColorPicker
              value={values.color}
              onChange={(color) => setValues((v) => ({ ...v, color }))}
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
