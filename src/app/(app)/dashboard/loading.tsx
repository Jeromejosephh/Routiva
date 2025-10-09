// src/app/(app)/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-28 rounded bg-zinc-800 animate-pulse" />
      <div className="h-28 rounded border p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="h-4 w-32 rounded bg-zinc-800 animate-pulse mb-3" />
        <div className="flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded border p-3 flex items-center justify-between"
        >
          <div className="h-4 w-40 bg-zinc-800 rounded animate-pulse" />
          <div className="h-9 w-24 bg-zinc-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
