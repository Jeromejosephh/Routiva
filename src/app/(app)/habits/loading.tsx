// src/app/(app)/habits/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 rounded border p-2 flex items-center gap-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="h-6 flex-1 bg-zinc-800 rounded animate-pulse" />
        <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="h-6 w-32 rounded bg-zinc-800 animate-pulse" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded border p-3 flex items-center justify-between backdrop-blur-sm bg-white/60 dark:bg-gray-700/60"
        >
          <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
          <div className="h-9 w-32 bg-zinc-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
