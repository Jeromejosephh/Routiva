import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'EMAIL_FROM'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );
    
    if (missingEnvVars.length > 0) {
      logger.warn("Missing environment variables", { 
        missing: missingEnvVars 
      });
      return NextResponse.json({
        status: "degraded",
        message: "Missing environment variables",
        missing: missingEnvVars
      }, { status: 200 });
    }
    
    logger.info("Health check passed");
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown"
    });
  } catch (error) {
    logger.error("Health check failed", { 
      error: error instanceof Error ? error : new Error(String(error))
    });
    
    return NextResponse.json({
      status: "unhealthy",
      error: "Database connection failed",
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
