'use client';

import { useEffect } from 'react';
import { toast } from '@/lib/toast';
import { useThemeClasses } from '@/components/ThemeProvider';
import { captureException } from '@/lib/sentry';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const themeClasses = useThemeClasses();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      captureException(error, { digest: error.digest, component: 'AppErrorBoundary' });
    } else {
      console.error('App error:', error);
    }
    toast('An error occurred. Please try again.');
  }, [error]);

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Oops! Something went wrong</h2>
        <p className="text-white/70">
          We&apos;re having trouble loading this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className={`px-4 py-2 rounded text-white ${themeClasses.button}`}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
