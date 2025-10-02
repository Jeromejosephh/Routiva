import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

function maskUrl(u?: string) {
  try {
    if (!u) return null;
    const parsed = new URL(u);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const payload = {
      nextauthUrl: maskUrl(env.NEXTAUTH_URL),
      nextauthSecretSet: Boolean(env.NEXTAUTH_SECRET),
      emailFrom: env.EMAIL_FROM ? env.EMAIL_FROM : null,
      resendApiKeySet: Boolean(env.RESEND_API_KEY),
    };

    logger.info("Auth debug endpoint accessed", { metadata: { env: { nextauthUrl: payload.nextauthUrl, nextauthSecretSet: payload.nextauthSecretSet } } });

    return NextResponse.json(payload);
  } catch (error) {
    logger.error("Auth debug endpoint error", { error: error instanceof Error ? error : new Error(String(error)) });
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
