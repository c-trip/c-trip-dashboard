"use server";

import { z } from "zod";

import { changePassword } from "@/lib/api/auth";
import { requireAuth } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Introduz a palavra-passe actual." }),
    new_password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
    confirm: z.string().min(1, { message: "Confirma a nova palavra-passe." }),
  })
  .refine((data) => data.new_password === data.confirm, {
    path: ["confirm"],
    message: "As palavras-passe não coincidem.",
  });

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = schema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await changePassword({
      current_password: parsed.data.current_password,
      new_password: parsed.data.new_password,
    });
  } catch (error) {
    return actionErrorState(error);
  }

  return { success: true };
}
