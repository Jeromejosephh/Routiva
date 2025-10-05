//src/lib/rate-limit.ts
import type { NextRequest } from "next/server";
import { Ratelimit as UpstashRatelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending?: Promise<unknown>;
};

export type Limiter = { limit: (key: string) => Promise<LimitResult> };

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

function createLimiter(): Limiter {
  if (hasUpstash) {
    const rl = new UpstashRatelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL as string,
        token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
      }),
      limiter: UpstashRatelimit.slidingWindow(100, "1 m"),
      analytics: false,
      prefix: "rl",
    });
    return {
      limit: async (key: string) => rl.limit(key) as unknown as LimitResult,
    };
  }
  //fallback no-op
  return {
    limit: async () => ({
      success: true,
      limit: 999999,
      remaining: 999998,
      reset: Date.now() + 60000,
      pending: undefined,
    }),
  };
}

export const rateLimit: Limiter = createLimiter();

//stable key from request
export function rateLimitRequest(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip =
    (fwd ? fwd.split(",")[0] : undefined) ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";
  return ip.trim();
}
