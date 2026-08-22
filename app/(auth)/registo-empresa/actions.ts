"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

import { login } from "@/lib/api/auth";
import { registerCompany } from "@/lib/api/companies";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  name: z.string().min(1, { message: "Nome da empresa é obrigatório." }),
  email: z.string().email({ message: "Introduz um email válido." }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
  phone: z
    .string()
    .min(1, { message: "Campo obrigatório." })
    .refine((value) => isValidPhoneNumber(value), {
      message: "Número de telefone inválido para o país escolhido.",
    }),
  nif: z.string().min(1, { message: "Campo obrigatório." }),
  address: z.string().min(1, { message: "Campo obrigatório." }),
  responsible_name: z.string().min(1, { message: "Campo obrigatório." }),
  responsible_id_document: z.string().min(1, { message: "Campo obrigatório." }),
});

export async function registerCompanyAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await registerCompany(parsed.data);
    const { access_token: accessToken } = await login({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    const store = await cookies();
    store.set(SESSION_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (error) {
    return actionErrorState(error);
  }

  redirect("/empresa?onboarding=1");
}
