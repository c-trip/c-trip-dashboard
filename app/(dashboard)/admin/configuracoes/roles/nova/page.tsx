import { CreateRoleForm } from "./create-role-form";
import { getAllPermissions } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function NovaRolePage() {
  await requirePermission(PERMISSIONS.adminRoleCreate);
  const permissions = await getAllPermissions();

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Nova role global</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define o nome, a descrição e as permissões que esta role terá na plataforma.
        </p>
      </div>
      <CreateRoleForm permissions={permissions} />
    </div>
  );
}
