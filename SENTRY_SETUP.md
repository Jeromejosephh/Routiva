# Sentry Integration

This project uses Sentry for error tracking and performance monitoring in production.

## Setup

1. **Create a Sentry account** at [sentry.io](https://sentry.io)

2. **Create a new project** in Sentry:
   - Choose "Next.js" as the platform
   - Note your DSN (Data Source Name)

3. **Add environment variables** to `.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_name
SENTRY_PROJECT=your_sentry_project_name
```

4. **For Vercel deployment**, add these environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
   - `SENTRY_AUTH_TOKEN` (for uploading source maps)

## Features

### Error Tracking
- Automatic capture of unhandled errors
- Client-side and server-side error tracking
- Edge runtime support
- Error boundaries integration

### Session Replay
- Records user sessions when errors occur
- Masks sensitive data automatically
- 10% sample rate for normal sessions
- 100% sample rate for error sessions

### Performance Monitoring
- Tracks page load times
- API route performance
- Database query performance

### User Context
- Automatically tracks authenticated users
- Links errors to specific user sessions

## Usage

### Manual Error Tracking

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// Capture an exception with context
try {
  // your code
} catch (error) {
  captureException(error, { feature: 'habit-creation', userId: user.id });
}

// Capture a message
captureMessage('User completed onboarding', 'info');
```

### Set User Context

```typescript
import { setUserContext, clearUserContext } from '@/lib/sentry';

// After login
setUserContext({ id: user.id, email: user.email, name: user.name });

// After logout
clearUserContext();
```

### Add Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb('User clicked create habit button', { habitName: 'Exercise' });
```

## Privacy

- All text and media are masked in session replays
- User emails are tracked only for authenticated users
- No sensitive data is logged
- Errors in development are not sent to Sentry

## Monitoring

Access your Sentry dashboard at: `https://sentry.io/organizations/{your-org}/issues/`

## Cost

- Free tier: 5,000 errors/month, 50 replays/month
- Recommended for production use

