import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const { access_token } = await login({ email, password });

    const store = await cookies();
    store.set(SESSION_COOKIE, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // O backend não tem refresh token — o cookie expira alinhado ao token (24h).
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    throw error;
  }
}
