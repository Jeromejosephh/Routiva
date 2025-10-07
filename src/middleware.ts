//src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, rateLimitRequest } from "@/lib/rate-limit";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const key = rateLimitRequest(req);

  // Determine rate limit type based on route
  const limitType = pathname.startsWith("/api/auth") ? "auth" : "api";
  const { success } = await rateLimit(key, limitType);

  if (!success) {
    const isAuthRoute = limitType === "auth";
    return new NextResponse(
      JSON.stringify({
        error: isAuthRoute
          ? "Too many sign-in attempts. Please try again later."
          : "Too many requests. Please try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Reset": String(Date.now() + 60000),
        },
      }
    );
  }

  // Security headers
  const response = NextResponse.next();
  
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  
  // CORS headers for API routes
  if (pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXTAUTH_URL || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
  }

  // Only if you're using HTTPS (which you should in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

// Include sign-in and auth routes in the matcher
export const config = {
  matcher: [
    "/api/:path*",
    "/sign-in",
    "/auth/:path*"
  ],
};
