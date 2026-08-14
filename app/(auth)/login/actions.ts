"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { login } from "@/lib/api/auth";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  email: z.string().email({ message: "Introduz um email válido." }),
  password: z.string().min(1, { message: "Introduz a password." }),
});

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { access_token: accessToken } = await login(parsed.data);

    const store = await cookies();
    store.set(SESSION_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // O backend não tem refresh token — o cookie expira alinhado ao token (24h).
      maxAge: 60 * 60 * 24,
    });
  } catch (error) {
    return actionErrorState(error);
  }

  // A decisão de ir para /empresa ou /admin fica em app/page.tsx, a partir do role.
  redirect("/");
}
