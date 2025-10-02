// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import nodemailer from "nodemailer";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,

      async sendVerificationRequest({ identifier, url }) {
        const from = env.EMAIL_FROM;

        try {
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
              console.error("Resend API error:", response.status, errorText);
              throw new Error(`Resend API error: ${response.status}`);
            }

            console.log("Email sent successfully via Resend");
            return;
          }

          //Fallback to Ethereal
          console.log("Using Ethereal email for development...");
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
          console.log(
            "Ethereal preview URL:",
            nodemailer.getTestMessageUrl(info)
          );
        } catch (error) {
          console.error("Failed to send verification email:", error);
          //Don't throw to avoid breaking auth flow
          //User sees a generic error message
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
};
