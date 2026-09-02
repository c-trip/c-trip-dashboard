import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { UserRolesForm } from "./user-roles-form";
import { getAllUsers, getGlobalRoles, getUserRoles } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";

export default async function UtilizadorRolesPage({
  params,
}: PageProps<"/admin/utilizadores/[userId]/roles">) {
  await requirePermission(PERMISSIONS.adminRoleRead);
  const { userId } = await params;
  const canAssign = await can(PERMISSIONS.adminRoleAssign);

  const [users, roles, userRoles] = await Promise.all([
    getAllUsers(100, 0),
    getGlobalRoles(),
    getUserRoles(userId),
  ]);

  const user = users.find((item) => item.id === userId);

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/utilizadores"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Utilizadores
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Roles de {user ? user.name : "utilizador"}
        </h2>
        {user ? <p className="text-sm text-muted-foreground">{user.email}</p> : null}
      </div>
      <UserRolesForm
        userId={userId}
        currentRoles={userRoles}
        allRoles={roles}
        canAssign={canAssign}
      />
    </div>
  );
}
