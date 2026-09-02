import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { CollaboratorRowActions } from "./collaborator-row-actions";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { buttonVariants } from "@/components/ui/button";
import { getCompanyUsers } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function ColaboradoresPage() {
  await requirePermission(PERMISSIONS.companyReadUsers);
  const canCreate = await can(PERMISSIONS.companyCreateUser);

  let users;
  try {
    users = await getCompanyUsers();
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Colaboradores
          </h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Colaboradores
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contas da empresa e o que cada uma pode fazer.
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/empresa/colaboradores/novo"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <IconPlus size={16} data-icon="inline-start" />
            Novo colaborador
          </Link>
        ) : null}
      </div>
      <SimpleTable
        rows={users}
        rowKey={(user) => user.id}
        emptyTitle="Ainda não há colaboradores"
        emptyDescription="Adiciona o primeiro colaborador para começar a atribuir tarefas e permissões."
        columns={[
          {
            header: "Nome",
            cell: (u) => <span className="font-medium">{u.name}</span>,
          },
          { header: "Email", cell: (u) => u.email },
          {
            header: "Estado",
            cell: (u) => (
              <span
                className={
                  u.is_active
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground"
                }
              >
                {u.is_active ? "Activo" : "Desactivado"}
              </span>
            ),
          },
          {
            header: "",
            cell: (u) => <CollaboratorRowActions userId={u.id} name={u.name} />,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
