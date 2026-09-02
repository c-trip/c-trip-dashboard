"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assignGlobalRole, removeGlobalRoleUser } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const assignSchema = z.object({
  role_id: z.string().uuid({ message: "Escolhe uma role." }),
});

export async function assignUserRoleAction(
  userId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requirePermission(PERMISSIONS.adminRoleAssign);

  const parsed = assignSchema.safeParse({ role_id: formData.get("role_id") });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await assignGlobalRole(userId, parsed.data.role_id);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath(`/admin/utilizadores/${userId}/roles`);
  return { success: true };
}

export async function removeUserRoleAction(userId: string, roleId: string) {
  await requirePermission(PERMISSIONS.adminRoleAssign);
  await removeGlobalRoleUser(roleId, userId);
  revalidatePath(`/admin/utilizadores/${userId}/roles`);
}
