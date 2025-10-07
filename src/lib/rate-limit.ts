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

export type RateLimitConfig = {
  maxRequests: number;
  window: string;
};

// Define rate limit configurations
export const RATE_LIMITS = {
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

// Create rate limiters for different routes
const rateLimiters = new Map<string, UpstashRatelimit>();

function getRateLimiter(type: keyof typeof RATE_LIMITS): UpstashRatelimit {
  if (!rateLimiters.has(type)) {
    if (!hasUpstash || !redis) {
      // Return a no-op rate limiter in development
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
    const [amount, duration] = config.window.split(" ");
    const durationInSeconds = duration === "m" ? 60 : 3600;

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

//stable key from request
export function rateLimitRequest(req: NextRequest): string {
  // Get IP address
  const fwd = req.headers.get("x-forwarded-for");
  const ip =
    (fwd ? fwd.split(",")[0] : undefined) ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-client-ip") ??
    "127.0.0.1";

  // Get basic request info for more accurate rate limiting
  const userAgent = req.headers.get("user-agent") || 'unknown';
  const method = req.method;
  
  // Create a hash of the identifying information
  const identifier = `${ip.trim()}_${userAgent.substring(0, 50)}_${method}`;
  
  return identifier;
}
