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
  access_mode: z.enum(["none", "role", "permissions"]).catch("none"),
  role_id: z.string().optional().or(z.literal("")),
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
    access_mode: formData.get("access_mode"),
    role_id: formData.get("role_id"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, access_mode, role_id } = parsed.data;
  const permissionCodes = formData.getAll("permission_codes").map(String);

  if (access_mode === "role" && !role_id) {
    return { fieldErrors: { role_id: ["Escolhe uma role."] } };
  }
  if (access_mode === "permissions" && permissionCodes.length === 0) {
    return {
      fieldErrors: { permission_codes: ["Escolhe pelo menos uma permissão."] },
    };
  }

  // Passo 1 — criar a conta (nasce sem nenhum acesso).
  let user;
  try {
    user = await createCollaborator({ name, email, password });
  } catch (error) {
    return actionErrorState(error);
  }

  // Passo 2 — atribuir acesso. A API não tem endpoint atómico: a conta já existe,
  // por isso qualquer falha aqui leva o gestor à página de permissões para terminar.
  if (access_mode !== "none" && (await can(PERMISSIONS.companyRoleAssign))) {
    try {
      if (access_mode === "role" && role_id) {
        await assignCompanyRole(user.id, role_id);
      } else if (access_mode === "permissions") {
        await replaceCollaboratorPermissions(user.id, permissionCodes);
      }
    } catch {
      revalidatePath("/empresa/colaboradores");
      redirect(`/empresa/colaboradores/${user.id}/permissoes?criado=1`);
    }
  }

  revalidatePath("/empresa/colaboradores");
  return { success: true };
}

export async function removeCollaboratorAction(userId: string) {
  await requirePermission(PERMISSIONS.companyDeleteUser);
  await removeCollaborator(userId);
  revalidatePath("/empresa/colaboradores");
}
