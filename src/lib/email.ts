'use server';
import 'server-only';

export async function sendMail(options: { to: string; subject: string; text?: string; html?: string }) {
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    ...options,
  });
}