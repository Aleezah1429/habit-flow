'use client';

import { useEffect, useState } from 'react';
import { formatToday } from '@/lib/date';

export function TodayHeader() {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    setLabel(formatToday(new Date()));
  }, []);

  return (
    <h2
      aria-label="Today"
      className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
    >
      {label || ' '}
    </h2>
  );
}
