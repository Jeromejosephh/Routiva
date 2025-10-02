// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

const handler = NextAuth(authOptions);

export const GET = async (req: Request) => {
	try {
		// Delegate to NextAuth handler
		return await handler(req);
	} catch (error) {
		logger.error("NextAuth handler GET error", { error: error instanceof Error ? error : new Error(String(error)) });
		throw error;
	}
};

export const POST = async (req: Request) => {
	try {
		return await handler(req);
	} catch (error) {
		logger.error("NextAuth handler POST error", { error: error instanceof Error ? error : new Error(String(error)) });
		throw error;
	}
};
