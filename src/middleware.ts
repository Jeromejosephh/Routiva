//src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, rateLimitRequest } from "@/lib/rate-limit";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  //bypass auth
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  //limit by client key
  const key = rateLimitRequest(req);
  const { success } = await rateLimit.limit(key);
  if (!success) return new NextResponse("Too Many Requests", { status: 429 });

  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
