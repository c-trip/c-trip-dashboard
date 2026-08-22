import { notFound } from "next/navigation";

import { EditRoleForm } from "./edit-role-form";
import { getAllPermissions, getGlobalRole } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

interface PageProps {
  params: Promise<{ roleId: string }>;
}

export default async function EditRolePage({ params }: PageProps) {
  await requirePermission(PERMISSIONS.adminRoleUpdate);
  const { roleId } = await params;

  const [role, allPermissions] = await Promise.all([
    getGlobalRole(roleId).catch(() => null),
    getAllPermissions(),
  ]);

  if (!role) notFound();

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Editar role</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {role.nome} — {role.descricao}
        </p>
      </div>
      <EditRoleForm
        roleId={role.id}
        roleName={role.nome}
        isSystem={role.is_system}
        currentPermissions={role.permissions.map((p) => p.codigo)}
        allPermissions={allPermissions}
      />
    </div>
  );
}
