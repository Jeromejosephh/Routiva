import { describe, it, expect } from 'vitest';
import { computeCompletionRate } from '@/lib/analytics';

describe('analytics', () => {
  it('computes completion rate', () => {
    const logs = [
      { status: 'done', date: new Date() },
      { status: 'fail', date: new Date() },
      { status: 'done', date: new Date() },
    ];
    expect(computeCompletionRate(logs)).toBeCloseTo(2/3);
  });

  it('returns 0 for empty logs', () => {
    expect(computeCompletionRate([])).toBe(0);
  });
});
