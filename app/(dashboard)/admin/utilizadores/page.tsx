import Link from "next/link";

import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { getAllUsers } from "@/lib/api/admin";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const LIMIT = 50;

export default async function UtilizadoresPage({ searchParams }: PageProps<"/admin/utilizadores">) {
  const params = await searchParams;
  const offset = Number(params?.offset ?? 0) || 0;
  const [users, canReadRoles] = await Promise.all([
    getAllUsers(LIMIT, offset),
    can(PERMISSIONS.adminRoleRead),
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Utilizadores</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas as contas da plataforma — passageiros, colaboradores, gestores.
        </p>
      </div>
      <SimpleTable
        rows={users}
        rowKey={(user) => user.id}
        emptyTitle="Nenhum utilizador nesta página"
        columns={[
          { header: "Nome", cell: (u) => <span className="font-medium">{u.name}</span> },
          { header: "Email", cell: (u) => u.email },
          { header: "Papel", cell: (u) => u.role },
          {
            header: "Estado",
            cell: (u) => (
              <span className={u.is_active ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                {u.is_active ? "Activo" : "Desactivado"}
              </span>
            ),
          },
          ...(canReadRoles
            ? [
                {
                  header: "",
                  cell: (u: (typeof users)[number]) => (
                    <Link
                      href={`/admin/utilizadores/${u.id}/roles`}
                      className="text-primary hover:underline"
                    >
                      Roles
                    </Link>
                  ),
                  className: "text-right",
                },
              ]
            : []),
        ]}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>A mostrar {users.length} a partir de {offset}.</span>
        <div className="flex gap-2">
          {offset > 0 ? (
            <Link
              href={`/admin/utilizadores?offset=${Math.max(offset - LIMIT, 0)}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Anterior
            </Link>
          ) : null}
          {users.length === LIMIT ? (
            <Link
              href={`/admin/utilizadores?offset=${offset + LIMIT}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Seguinte
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
