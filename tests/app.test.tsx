import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from '@/lib/storage';

describe('storage layer', () => {
  test('addHabit then getHabits round-trips the data', () => {
    addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0]).toMatchObject({
      name: 'Read',
      iconName: 'Book',
      color: 'blue',
    });
    expect(habits[0].id).toBeTruthy();
    expect(habits[0].createdAt).toBeTruthy();
  });

  test('getHabits returns [] when localStorage is corrupt', () => {
    localStorage.setItem('habit-flow:v1', 'not-json{{{');
    expect(getHabits()).toEqual([]);
  });

  test('deleteHabit removes only the matching habit', () => {
    const a = addHabit({ name: 'A', iconName: 'Book', color: 'blue' });
    const b = addHabit({ name: 'B', iconName: 'Heart', color: 'red' });
    deleteHabit(a.id);
    const remaining = getHabits();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(b.id);
  });

  test('updateHabit applies the patch to only the matching habit', () => {
    const a = addHabit({ name: 'A', iconName: 'Book', color: 'blue' });
    const b = addHabit({ name: 'B', iconName: 'Heart', color: 'red' });
    updateHabit(a.id, { name: 'A renamed', color: 'green' });
    const habits = getHabits();
    expect(habits.find((h) => h.id === a.id)).toMatchObject({
      name: 'A renamed',
      color: 'green',
    });
    expect(habits.find((h) => h.id === b.id)).toMatchObject({
      name: 'B',
      color: 'red',
    });
  });
});

describe('Home page — user flows', () => {
  test('shows empty state when there are no habits', async () => {
    render(<Home />);
    expect(await screen.findByText(/no habits yet/i)).toBeInTheDocument();
  });

  test('clicking "New habit" opens the dialog with a focused name input', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /new habit/i }));
    expect(screen.getByPlaceholderText(/read 20 mins/i)).toBeInTheDocument();
  });

  test('Save is disabled while the name field is empty', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /new habit/i }));
    expect(screen.getByRole('button', { name: /^save$/i })).toBeDisabled();
  });

  test('submitting the form creates a habit that appears in the list', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole('button', { name: /new habit/i }));
    await user.type(
      screen.getByPlaceholderText(/read 20 mins/i),
      'Drink water',
    );
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByText('Drink water')).toBeInTheDocument();
    expect(getHabits()).toHaveLength(1);
  });

  test('delete flow asks for confirmation before removing', async () => {
    const user = userEvent.setup();
    addHabit({ name: 'Meditate', iconName: 'Brain', color: 'purple' });
    render(<Home />);
    await user.click(await screen.findByRole('button', { name: /habit options/i }));
    await user.click(screen.getByRole('menuitem', { name: /delete/i }));
    expect(screen.getByText(/delete "meditate"/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(screen.queryByText('Meditate')).not.toBeInTheDocument();
    expect(getHabits()).toHaveLength(0);
  });
});
