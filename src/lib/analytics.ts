export function computeCompletionRate(logs: { status: string; date: Date }[]) {
  if (!logs || logs.length === 0) return 0;
  const done = logs.filter(l => l.status === 'done').length;
  return done / logs.length;
}
