import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

function maskUrl(u?: string) {
  try {
    if (!u) return null;
    const parsed = new URL(u);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = {
      nextauthUrl: maskUrl(env.NEXTAUTH_URL),
      nextauthSecretSet: Boolean(env.NEXTAUTH_SECRET),
      emailFrom: env.EMAIL_FROM ? env.EMAIL_FROM : null,
      resendApiKeySet: Boolean(env.RESEND_API_KEY),
    };

    logger.info('Auth debug (pages) endpoint accessed', { metadata: { env: { nextauthUrl: payload.nextauthUrl, nextauthSecretSet: payload.nextauthSecretSet } } });

    res.status(200).json(payload);
  } catch (error) {
    logger.error('Auth debug (pages) endpoint error', { error: error instanceof Error ? error : new Error(String(error)) });
    res.status(500).json({ error: 'internal' });
  }
}
