import Link from "next/link";

import { RoleRowActions } from "./role-row-actions";
import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { getGlobalRoles } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function GlobalRolesPage() {
  await requirePermission(PERMISSIONS.adminRoleRead);
  const roles = await getGlobalRoles();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Roles &amp; permissões globais</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuração avançada de RBAC — uso raro, tipicamente só na configuração inicial da plataforma.
          </p>
        </div>
        <Link
          href="/admin/configuracoes/roles/nova"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Nova role
        </Link>
      </div>
      <SimpleTable
        rows={roles}
        rowKey={(role) => role.id}
        emptyTitle="Sem roles globais"
        columns={[
          { header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
          { header: "Descrição", cell: (r) => r.descricao },
          { header: "Permissões", cell: (r) => <span className="tabular-nums">{String(r.permission_count)}</span> },
          { header: "Sistema", cell: (r) => (r.is_system ? "Sim" : "Não") },
          {
            header: "",
            cell: (r) => <RoleRowActions roleId={r.id} roleName={r.nome} isSystem={r.is_system} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
