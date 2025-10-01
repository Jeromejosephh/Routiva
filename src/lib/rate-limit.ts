import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance (fallback to in-memory for development)
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create rate limiter
export const rateLimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
      analytics: true,
    })
  : null;

// Fallback rate limiter for development (in-memory)
class InMemoryRateLimit {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;
    
    const key = identifier;
    const current = this.requests.get(key);
    
    if (!current || now > current.resetTime) {
      // Reset window
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
    }
    
    if (current.count >= maxRequests) {
      return { success: false, limit: maxRequests, remaining: 0, reset: current.resetTime };
    }
    
    current.count++;
    return { success: true, limit: maxRequests, remaining: maxRequests - current.count, reset: current.resetTime };
  }
}

const fallbackRateLimit = new InMemoryRateLimit();

/**
 * Rate limit a request by identifier (IP or user ID)
 */
export async function rateLimitRequest(identifier: string) {
  const limiter = rateLimit || fallbackRateLimit;
  const result = await limiter.limit(identifier);
  
  if (!result.success) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  return result;
}
