"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateCompanyProfile } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  name: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email({ message: "Introduz um email válido." }).optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
});

export async function updateProfileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.companyUpdateProfile);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // PATCH — só envia o que o gestor de facto preencheu, nunca strings vazias.
  const body = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => Boolean(value)));

  try {
    await updateCompanyProfile(body);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/perfil");
  return { success: true };
}
