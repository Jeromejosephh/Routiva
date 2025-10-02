'use client';

import { useEffect } from 'react';
import { toast } from '@/lib/toast';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
    toast('An error occurred. Please try again.');
  }, [error]);

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Oops! Something went wrong</h2>
        <p className="text-gray-600">
          We&apos;re having trouble loading this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
