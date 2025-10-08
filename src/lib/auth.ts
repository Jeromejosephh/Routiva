import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      maxAge: 10 * 60, //magic links expire in 10 minutes
      generateVerificationToken: () => {
        return Array.from(crypto.getRandomValues(new Uint8Array(24)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      },
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = provider.server ? await import('nodemailer').then(m => m.default.createTransport(provider.server)) : null;
        
        if (!transport) {
          throw new Error('Email transport not configured');
        }

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ${host}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Main content card -->
    <div style="background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">
          Sign in to Routiva
        </h1>
      </div>

      <!-- Sign-in button - PROMINENTLY PLACED AT TOP -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" 
           style="display: inline-block; 
                  background: #000000; 
                  color: white; 
                  padding: 16px 32px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: 600; 
                  font-size: 16px;
                  min-width: 200px;
                  text-align: center;">
          ✨ Sign In Now
        </a>
      </div>

      <!-- Instructions -->
      <div style="margin: 24px 0; text-align: center;">
        <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
          Click the button above to securely sign in to your account.
        </p>
      </div>

      <!-- Alternative link -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="margin: 8px 0 0 0; word-break: break-all;">
          <a href="${url}" style="color: #2563eb; text-decoration: none; font-size: 13px;">
            ${url}
          </a>
        </p>
      </div>

      <!-- Footer info -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.4;">
          This link will expire in 10 minutes for security.<br>
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

        const text = `Sign in to ${host}

Click this link to sign in:
${url}

This link will expire in 10 minutes.

If you didn't request this email, you can safely ignore it.`;

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text,
          html,
        });
      },
    }),
    //database adapter for nextauth
  ],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {
      }
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: process.env.NODE_ENV !== "production",
};
