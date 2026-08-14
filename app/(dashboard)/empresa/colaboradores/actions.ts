"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createCollaborator, removeCollaborator } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  name: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  email: z.string().email({ message: "Introduz um email válido." }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
});

export async function createCollaboratorAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.companyCreateUser);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createCollaborator(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/empresa/colaboradores");
  return { success: true };
}

export async function removeCollaboratorAction(userId: string) {
  await requirePermission(PERMISSIONS.companyDeleteUser);
  await removeCollaborator(userId);
  revalidatePath("/empresa/colaboradores");
}
