"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  assignCompanyRole,
  removeCompanyRole,
  replaceCollaboratorPermissions,
} from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

// `userId` fica pré-associado via `.bind(null, userId)` no componente cliente —
// é o padrão do Next.js para Server Actions com argumentos extra além do FormData.
export async function replacePermissionsAction(
  userId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requirePermission(PERMISSIONS.companyRoleAssign);

  const codes = formData.getAll("permission_codes").map(String);

  try {
    // SUBSTITUI a lista inteira — ver lib/api/companies.ts.
    await replaceCollaboratorPermissions(userId, codes);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath(`/empresa/colaboradores/${userId}/permissoes`);
  return { success: true };
}

const assignRoleSchema = z.object({
  role_id: z.string().uuid({ message: "Escolhe uma role." }),
});

export async function assignCollaboratorRoleAction(
  userId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requirePermission(PERMISSIONS.companyRoleAssign);

  const parsed = assignRoleSchema.safeParse({ role_id: formData.get("role_id") });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await assignCompanyRole(userId, parsed.data.role_id);
  } catch (error) {
    return actionErrorState(error);
  }

  revalidatePath(`/empresa/colaboradores/${userId}/permissoes`);
  return { success: true };
}

export async function removeCollaboratorRoleAction(userId: string, roleId: string) {
  await requirePermission(PERMISSIONS.companyRoleAssign);
  await removeCompanyRole(roleId, userId);
  revalidatePath(`/empresa/colaboradores/${userId}/permissoes`);
}
