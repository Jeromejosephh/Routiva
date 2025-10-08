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

export type RateLimitConfig = {
  maxRequests: number;
  window: string;
};

const RATE_LIMITS = {
  auth: { maxRequests: 20, window: "1 m" },
  api: { maxRequests: 100, window: "1 m" },
} as const;

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : null;

const rateLimiters = new Map<string, UpstashRatelimit>();

function getRateLimiter(type: keyof typeof RATE_LIMITS): UpstashRatelimit {
  if (!rateLimiters.has(type)) {
    if (!hasUpstash || !redis) {
      const noOpLimiter = {
        limit: async () => ({
          success: true,
          limit: 999999,
          remaining: 999998,
          reset: Date.now() + 60000,
        }),
      };
      return noOpLimiter as unknown as UpstashRatelimit;
    }

    const config = RATE_LIMITS[type];


    const limiter = new UpstashRatelimit({
      redis,
      limiter: UpstashRatelimit.slidingWindow(config.maxRequests, config.window),
      analytics: false,
      prefix: `rl_${type}`,
    });

    rateLimiters.set(type, limiter);
  }

  return rateLimiters.get(type)!;
}

export async function rateLimit(key: string, type: keyof typeof RATE_LIMITS = 'api'): Promise<LimitResult> {
  const limiter = getRateLimiter(type);
  return limiter.limit(key) as Promise<LimitResult>;
}

export function rateLimitRequest(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip =
    (fwd ? fwd.split(",")[0] : undefined) ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-client-ip") ??
    "127.0.0.1";

  const userAgent = req.headers.get("user-agent") || 'unknown';
  const method = req.method;
  const identifier = `${ip.trim()}_${userAgent.substring(0, 50)}_${method}`;
  
  return identifier;
}
