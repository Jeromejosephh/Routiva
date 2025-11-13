import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception in Sentry with additional context
 */
export function captureException(error: Error | unknown, context?: Record<string, unknown>) {
  if (context) {
    Sentry.setContext('additional_context', context);
  }
  Sentry.captureException(error);
}

/**
 * Capture a message in Sentry
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: { id: string; email?: string | null; name?: string | null }) {
  Sentry.setUser({
    id: user.id,
    email: user.email ?? undefined,
    username: user.name ?? undefined,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  functionName: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error, { function: functionName, args });
      throw error;
    }
  }) as T;
}

export { Sentry };
