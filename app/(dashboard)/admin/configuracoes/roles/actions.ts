"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createGlobalRole, deleteGlobalRole, updateGlobalRolePermissions } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const createSchema = z.object({
  nome: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  descricao: z.string().min(2, { message: "Mínimo 2 caracteres." }),
});

export async function createRoleAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requirePermission(PERMISSIONS.adminRoleCreate);

  const parsed = createSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createGlobalRole(parsed.data);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath("/admin/configuracoes/roles");
  return { success: true };
}

export async function deleteRoleAction(roleId: string) {
  await requirePermission(PERMISSIONS.adminRoleDelete);
  await deleteGlobalRole(roleId);
  revalidatePath("/admin/configuracoes/roles");
}

export async function updateRolePermissionsAction(
  roleId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requirePermission(PERMISSIONS.adminRoleUpdate);

  const codes = formData.getAll("permission_codes").map(String);

  try {
    await updateGlobalRolePermissions(roleId, codes);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath(`/admin/configuracoes/roles/${roleId}`);
  return { success: true };
}
