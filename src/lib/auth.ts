// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,

      async sendVerificationRequest({ identifier, url }) {
        const from = env.EMAIL_FROM;

        // Helper: mask the verification URL to avoid leaking tokens in logs
        const maskUrl = (u: string) => {
          try {
            const parsed = new URL(u);
            const pathname = parsed.pathname + parsed.search;
            const tail = pathname.slice(-12);
            return `${parsed.protocol}//${parsed.host}...${tail}`;
          } catch (e) {
            return '(invalid-url)';
          }
        };

        // Log generation attempt (safe fields only)
        try {
          logger.info("Generating verification email", {
            metadata: { identifier, host: new URL(url).host, urlPreview: maskUrl(url) },
          });

          if (env.RESEND_API_KEY) {
            const response = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from,
                to: identifier,
                subject: "Your Routiva sign-in link",
                html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              logger.error("Resend API error", { metadata: { status: response.status, body: errorText } });
              throw new Error(`Resend API error: ${response.status}`);
            }

            logger.info("Email sent successfully via Resend", { metadata: { identifier } });
            return;
          }

          // Fallback to Ethereal in development
          logger.info("Using Ethereal as fallback for verification email", { metadata: { identifier } });
          const test = await nodemailer.createTestAccount();
          const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: { user: test.user, pass: test.pass },
          });
          const info = await transporter.sendMail({
            from,
            to: identifier,
            subject: "Your Routiva sign-in link",
            html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
          });
          const preview = nodemailer.getTestMessageUrl(info) ?? "(no-preview)";
          logger.info("Ethereal preview URL", { metadata: { preview } });
        } catch (error) {
          logger.error("Failed to send verification email", { error: error instanceof Error ? error : new Error(String(error)), metadata: { identifier } });
          //Don't throw to avoid breaking auth flow; NextAuth will surface a generic error to the user
        }
      },
    }),
  ],

  session: { strategy: "database" },
  // pages: { signIn: "/sign-in" },
  secret: env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Lightweight event hooks for additional server-side debugging
  events: {
    async signIn({ user, account }) {
      try {
        logger.info("NextAuth signIn event", { metadata: { userId: user?.id, provider: account?.provider } });
      } catch (e) {
        // swallow logging errors
      }
    },
    async createUser({ user }) {
      try {
        logger.info("NextAuth createUser event", { metadata: { userId: user?.id, email: user?.email } });
      } catch (e) {}
    },
  },
};
