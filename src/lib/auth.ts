// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,

      async sendVerificationRequest({ identifier, url }) {
        const from = process.env.EMAIL_FROM!;

        if (process.env.RESEND_API_KEY) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from,
              to: identifier,
              subject: "Your Routiva sign-in link",
              html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
            }),
          });
          return;
        }

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
      },
    }),
  ],

  session: { strategy: "database" },
  // pages: { signIn: "/sign-in" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
