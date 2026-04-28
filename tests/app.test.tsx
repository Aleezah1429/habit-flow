import { describe, test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  getCompletions,
  markDone,
  unmarkDone,
  isDone,
} from '@/lib/storage';
import { todayKey, previousDay } from '@/lib/date';
import { currentStreak, longestStreak, computeStreaks } from '@/lib/streak';

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

describe('completions storage', () => {
  test('markDone then isDone reflects the new state', () => {
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    expect(isDone(h.id, '2026-04-26')).toBe(false);
    markDone(h.id, '2026-04-26');
    expect(isDone(h.id, '2026-04-26')).toBe(true);
    expect(getCompletions()[h.id]).toEqual(['2026-04-26']);
  });

  test('markDone is idempotent — calling twice for same date does not duplicate', () => {
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    markDone(h.id, '2026-04-26');
    markDone(h.id, '2026-04-26');
    expect(getCompletions()[h.id]).toEqual(['2026-04-26']);
  });

  test('unmarkDone removes the date; calling on absent date is a no-op', () => {
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    markDone(h.id, '2026-04-26');
    unmarkDone(h.id, '2026-04-26');
    expect(isDone(h.id, '2026-04-26')).toBe(false);
    expect(() => unmarkDone(h.id, '2026-04-26')).not.toThrow();
  });

  test('deleteHabit also removes its completions (no orphans)', () => {
    const a = addHabit({ name: 'A', iconName: 'Book', color: 'blue' });
    const b = addHabit({ name: 'B', iconName: 'Heart', color: 'red' });
    markDone(a.id, '2026-04-26');
    markDone(b.id, '2026-04-26');
    deleteHabit(a.id);
    const completions = getCompletions();
    expect(completions[a.id]).toBeUndefined();
    expect(completions[b.id]).toEqual(['2026-04-26']);
  });

  test('getCompletions returns {} when localStorage has habits but no completions key (forward-compat)', () => {
    localStorage.setItem(
      'habit-flow:v1',
      JSON.stringify({ habits: [{ id: 'x', name: 'Old', iconName: 'Book', color: 'blue', createdAt: '' }] }),
    );
    expect(getCompletions()).toEqual({});
    expect(getHabits()).toHaveLength(1);
  });

  test('getCompletions returns {} when completions value is corrupt', () => {
    localStorage.setItem(
      'habit-flow:v1',
      JSON.stringify({ habits: [], completions: 'garbage' }),
    );
    expect(getCompletions()).toEqual({});
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

describe('Home page — daily check-in', () => {
  test('check button toggles a habit done for today and persists to storage', async () => {
    const user = userEvent.setup();
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    render(<Home />);
    const check = await screen.findByRole('checkbox', { name: /mark read as done today/i });
    expect(check).toHaveAttribute('aria-checked', 'false');

    await user.click(check);
    expect(check).toHaveAttribute('aria-checked', 'true');
    expect(isDone(h.id, todayKey())).toBe(true);

    const uncheck = screen.getByRole('checkbox', { name: /unmark read as done today/i });
    await user.click(uncheck);
    expect(uncheck).toHaveAttribute('aria-checked', 'false');
    expect(isDone(h.id, todayKey())).toBe(false);
  });

  test('toggling one habit does not affect siblings', async () => {
    const user = userEvent.setup();
    addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    addHabit({ name: 'Walk', iconName: 'Footprints', color: 'green' });
    render(<Home />);
    const readToggle = await screen.findByRole('checkbox', { name: /mark read as done today/i });
    const walkToggle = screen.getByRole('checkbox', { name: /mark walk as done today/i });

    await user.click(readToggle);
    expect(readToggle).toHaveAttribute('aria-checked', 'true');
    expect(walkToggle).toHaveAttribute('aria-checked', 'false');
  });

  test('today header renders a date string (weekday + month + day)', async () => {
    render(<Home />);
    const header = await screen.findByLabelText(/today/i);
    expect(header.textContent).toMatch(
      /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), [A-Z][a-z]+ \d{1,2}$/,
    );
  });

  test('clicking the check button does not open the three-dot menu', async () => {
    const user = userEvent.setup();
    addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    render(<Home />);
    const check = await screen.findByRole('checkbox', { name: /mark read as done today/i });
    await user.click(check);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('deleting a habit while it is checked also wipes its completions', async () => {
    const user = userEvent.setup();
    const h = addHabit({ name: 'Meditate', iconName: 'Brain', color: 'purple' });
    markDone(h.id, todayKey());
    render(<Home />);
    await user.click(await screen.findByRole('button', { name: /habit options/i }));
    await user.click(screen.getByRole('menuitem', { name: /delete/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(getCompletions()[h.id]).toBeUndefined();
  });

  test('on hydrate, an already-done habit shows checked state', async () => {
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    markDone(h.id, todayKey());
    render(<Home />);
    const check = await screen.findByRole('checkbox', { name: /unmark read as done today/i });
    expect(check).toHaveAttribute('aria-checked', 'true');
    // also assert no extra DOM lookup needed beyond the role query
    within(check).getByText('', { selector: 'svg' }); // check icon present (lucide renders <svg>)
  });
});

describe('date helpers', () => {
  test('previousDay subtracts one day across month boundaries', () => {
    expect(previousDay('2026-04-26')).toBe('2026-04-25');
    expect(previousDay('2026-05-01')).toBe('2026-04-30');
    expect(previousDay('2026-01-01')).toBe('2025-12-31');
  });
});

describe('streak math', () => {
  const TODAY = '2026-04-26';

  test('currentStreak returns 0 when today is not in dates', () => {
    expect(currentStreak([], TODAY)).toBe(0);
    expect(currentStreak(['2026-04-25'], TODAY)).toBe(0);
    expect(currentStreak(['2026-04-20', '2026-04-21'], TODAY)).toBe(0);
  });

  test('currentStreak counts consecutive days ending today', () => {
    expect(currentStreak([TODAY], TODAY)).toBe(1);
    expect(currentStreak(['2026-04-25', TODAY], TODAY)).toBe(2);
    expect(currentStreak(
      ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', TODAY],
      TODAY,
    )).toBe(7);
  });

  test('currentStreak stops at the first gap walking back from today', () => {
    expect(currentStreak(['2026-04-23', TODAY], TODAY)).toBe(1);
    expect(currentStreak(['2026-04-23', '2026-04-25', TODAY], TODAY)).toBe(2);
  });

  test('longestStreak returns 0 for empty input', () => {
    expect(longestStreak([])).toBe(0);
  });

  test('longestStreak finds the longest consecutive run anywhere in history', () => {
    expect(longestStreak(['2026-04-20', '2026-04-21', '2026-04-22'])).toBe(3);
    expect(
      longestStreak([
        '2026-04-20', '2026-04-21',
        '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29',
      ]),
    ).toBe(5);
    expect(longestStreak(['2026-04-20', '2026-04-22', '2026-04-24'])).toBe(1);
  });

  test('longestStreak ignores duplicate dates', () => {
    expect(longestStreak(['2026-04-25', '2026-04-25', '2026-04-26'])).toBe(2);
  });

  test('longestStreak ignores future-dated entries when given todayKey', () => {
    expect(longestStreak(['2026-04-25', '2026-04-26', '2099-01-01'], TODAY)).toBe(2);
  });

  test('computeStreaks satisfies longest >= current', () => {
    const dates = ['2026-04-15', '2026-04-16', '2026-04-17', TODAY];
    const { current, longest } = computeStreaks(dates, TODAY);
    expect(current).toBe(1);
    expect(longest).toBe(3);
    expect(longest).toBeGreaterThanOrEqual(current);
  });

  test('computeStreaks: 7 days through today = current 7 / longest 7 (roadmap definition of done)', () => {
    const week = ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24', '2026-04-25', TODAY];
    expect(computeStreaks(week, TODAY)).toEqual({ current: 7, longest: 7 });
  });

  test('computeStreaks preserves longest after current resets to 0', () => {
    const dates = ['2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19'];
    expect(computeStreaks(dates, TODAY)).toEqual({ current: 0, longest: 5 });
  });
});

describe('Home page — streak display', () => {
  test('a brand-new habit shows "No streak yet"', async () => {
    addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    render(<Home />);
    expect(await screen.findByLabelText(/no streak yet/i)).toBeInTheDocument();
  });

  test('marking a habit done today shows the streak badge with current and best', async () => {
    const user = userEvent.setup();
    addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    render(<Home />);
    await user.click(await screen.findByRole('checkbox', { name: /mark read as done today/i }));
    expect(await screen.findByLabelText(/1 day current streak, best 1/i)).toBeInTheDocument();
  });

  test('un-marking today: current goes to 0; longest reflects what remains in data', async () => {
    const user = userEvent.setup();
    const h = addHabit({ name: 'Read', iconName: 'Book', color: 'blue' });
    const today = todayKey();
    const yesterday = previousDay(today);
    markDone(h.id, yesterday);
    markDone(h.id, today);
    render(<Home />);
    expect(await screen.findByLabelText(/2 days current streak, best 2/i)).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /unmark read as done today/i }));
    // After un-marking today, only yesterday remains → longest = 1 (a single-day run).
    expect(await screen.findByLabelText(/0 days current streak, best 1/i)).toBeInTheDocument();
  });
});
