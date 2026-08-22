import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { loginWithGoogle } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const { id_token: idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ ok: false, message: "id_token em falta." }, { status: 400 });
  }

  try {
    const { access_token } = await loginWithGoogle(idToken);

    const store = await cookies();
    store.set(SESSION_COOKIE, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
