// Skeleton components for loading states
"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function HabitListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Habit form skeleton */}
      <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-6 w-32 mx-auto" />

      {/* Group manager skeleton */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>

      {/* Habit groups skeleton */}
      {[...Array(2)].map((_, groupIndex) => (
        <div
          key={groupIndex}
          className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
        >
          {/* Group header */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Habit items */}
          <div className="space-y-2">
            {[...Array(3)].map((_, habitIndex) => (
              <div
                key={habitIndex}
                className="border p-3 rounded backdrop-blur-sm bg-white/60 dark:bg-gray-700/60"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Ungrouped habits skeleton */}
      <div className="mt-8">
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="border p-3 rounded backdrop-blur-sm bg-white/60 dark:bg-gray-700/60"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
          >
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Today's habits skeleton */}
      <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-48 mx-auto" />

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
          >
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
          >
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-80 w-full" />
          </div>
        ))}
      </div>

      {/* Habit list skeleton */}
      <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-32 mx-auto" />

      {/* Theme settings skeleton */}
      <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 space-y-4">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      {/* User settings skeleton */}
      <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 space-y-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Data management skeleton */}
      <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 space-y-4">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
