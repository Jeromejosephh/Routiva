import { describe, it, expect } from 'vitest';
import { computeCurrentStreak, buildSeries } from '@/lib/analytics';

function d(s: string) { const dt = new Date(s); dt.setUTCHours(0,0,0,0); return dt; }

describe('streaks', () => {
  it('computes current streak correctly', () => {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const logs = [
      { status: 'done', date: today },
      { status: 'done', date: yesterday },
      { status: 'fail', date: d('2025-09-28') },
    ];
    expect(computeCurrentStreak(logs)).toBe(2);
  });

  it('builds series for a date range', () => {
    const from = d('2025-09-01');
    const to = d('2025-09-03');
    const logs = [
      { status: 'done', date: d('2025-09-01') },
      { status: 'fail', date: d('2025-09-02') },
    ];
    const series = buildSeries(from, to, logs);
    expect(series.length).toBe(3);
    expect(series[0].done).toBe(1);
    expect(series[1].done).toBe(0);
    expect(series[2].done).toBe(0);
  });
});
