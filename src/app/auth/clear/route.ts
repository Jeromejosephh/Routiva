import { NextRequest, NextResponse } from "next/server";

const NAMES = [
  "next-auth.callback-url",
  "next-auth.state",
  "next-auth.csrf-token",
  "authjs.callback-url",
  "authjs.state",
  "authjs.csrf-token",
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/sign-in";

  const res = NextResponse.redirect(new URL(redirectTo, req.url));

  for (const name of NAMES) {
    res.cookies.set({ name, value: "", maxAge: 0, path: "/" });
    res.cookies.set({ name: `__Secure-${name}`, value: "", maxAge: 0, path: "/" });
  }

  return res;
}
