export function computeCompletionRate(logs: { status: string; date: Date }[]) {
  if (!logs || logs.length === 0) return 0;
  const done = logs.filter(l => l.status === 'done').length;
  return done / logs.length;
}

//Compute current streak: consecutive 'done' entries up to the most recent date
export function computeCurrentStreak(logs: { status: string; date: Date }[]) {
  if (!logs || logs.length === 0) return 0;
  // normalize dates to UTC midnight and build a map
  const map = new Map<string, string>();
  for (const l of logs) {
    const d = new Date(l.date);
    d.setUTCHours(0,0,0,0);
    map.set(d.toISOString(), l.status);
  }

  // start from today UTC
  let cursor = new Date();
  cursor.setUTCHours(0,0,0,0);
  let streak = 0;
  while (true) {
    const key = cursor.toISOString();
    const status = map.get(key);
    if (status === 'done') {
      streak++;
    } else {
      break;
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function buildSeries(from: Date, to: Date, logs: { status: string; date: Date }[]) {
  const rows: { date: string; done: number }[] = [];
  const map = new Map<number, boolean>();
  for (const l of logs) {
    const d = new Date(l.date);
    d.setUTCHours(0,0,0,0);
    map.set(d.getTime(), l.status === 'done');
  }

  const cursor = new Date(from);
  while (cursor <= to) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth()+1).padStart(2,'0')}-${String(cursor.getUTCDate()).padStart(2,'0')}`;
    const done = map.get(cursor.getTime()) ? 1 : 0;
    rows.push({ date: key, done });
    cursor.setUTCDate(cursor.getUTCDate()+1);
  }
  return rows;
}
