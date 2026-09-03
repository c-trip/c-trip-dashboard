"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  assignCompanyRole,
  createCollaborator,
  removeCollaborator,
  replaceCollaboratorPermissions,
} from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";
import { actionErrorState, type ActionState } from "@/lib/forms/action-state";

const schema = z.object({
  name: z.string().min(2, { message: "Mínimo 2 caracteres." }),
  email: z.string().email({ message: "Introduz um email válido." }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
  role_id: z.string().trim().optional().or(z.literal("")),
});

export async function createCollaboratorAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requirePermission(PERMISSIONS.companyCreateUser);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role_id: formData.get("role_id"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { role_id, ...identity } = parsed.data;
  const permissionCodes = formData
    .getAll("permission_codes")
    .map(String)
    .filter(Boolean);

  // Passo 1 — criar a conta (nasce sem nenhum acesso).
  let user;
  try {
    user = await createCollaborator(identity);
  } catch (error) {
    return actionErrorState(error);
  }

  // Passo 2 — dar acesso. A role tem prioridade (traz o pacote certo); as
  // permissões soltas ficam para casos especiais. A API não tem endpoint
  // atómico: a conta já existe, por isso uma falha aqui leva o gestor à página
  // de permissões desse colaborador para terminar à mão.
  const canAssign = await can(PERMISSIONS.companyRoleAssign);
  if (canAssign && (role_id || permissionCodes.length > 0)) {
    try {
      if (role_id) await assignCompanyRole(user.id, role_id);
      else await replaceCollaboratorPermissions(user.id, permissionCodes);
    } catch {
      revalidatePath("/empresa/colaboradores");
      redirect(`/empresa/colaboradores/${user.id}/permissoes?criado=1`);
    }
  }

  revalidatePath("/empresa/colaboradores");
  redirect("/empresa/colaboradores");
}

export async function removeCollaboratorAction(userId: string) {
  await requirePermission(PERMISSIONS.companyDeleteUser);
  await removeCollaborator(userId);
  revalidatePath("/empresa/colaboradores");
}
