// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import './sentry.server.config';

export async function onRequestError(
  err: Error & { digest?: string },
  _request: {
    path: string;
    method: string;
    headers: { [key: string]: string };
  },
  _context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
  }
) {
  Sentry.captureException(err);
}
