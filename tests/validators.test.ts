import { describe, it, expect } from 'vitest';
import { habitCreate, logCreate } from '@/lib/validators';

describe('validators', () => {
  it('validates habitCreate happy path', () => {
    const data = { name: 'Read', description: 'Read books', targetDays: 3 };
    const parsed = habitCreate.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('rejects empty name', () => {
    const data = { name: '', description: 'x' };
    const parsed = habitCreate.safeParse(data);
    expect(parsed.success).toBe(false);
  });

  it('validates logCreate with date string', () => {
    const data = { date: '2025-10-02', status: 'done' };
    const parsed = logCreate.safeParse(data);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe('done');
      expect(parsed.data.date instanceof Date).toBe(true);
    }
  });

  it('defaults status to done', () => {
    const data = { date: '2025-10-02' };
    const parsed = logCreate.safeParse(data);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.status).toBe('done');
  });
});
