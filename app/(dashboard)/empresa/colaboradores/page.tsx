import { unstable_rethrow } from "next/navigation";

import { CollaboratorRowActions } from "./collaborator-row-actions";
import { CreateCollaboratorForm } from "./create-collaborator-form";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { flags } from "@/config/flags";
import {
  getAssignableCompanyPermissions,
  getCompanyRoles,
  getCompanyUsers,
  type CompanyPermission,
  type CompanyRoleSummary,
} from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    unstable_rethrow(error);
    return fallback;
  }
}

export default async function ColaboradoresPage() {
  await requirePermission(PERMISSIONS.companyReadUsers);
  const [canCreate, canAssignAccess] = await Promise.all([
    can(PERMISSIONS.companyCreateUser),
    can(PERMISSIONS.companyRoleAssign),
  ]);

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

  // Catálogo para o form combinado — só faz sentido buscar se der para criar E atribuir acesso.
  let roles: CompanyRoleSummary[] = [];
  let permissions: CompanyPermission[] = [];
  if (canCreate && canAssignAccess) {
    [roles, permissions] = await Promise.all([
      safe(getCompanyRoles(), [] as CompanyRoleSummary[]),
      safe(getAssignableCompanyPermissions(), [] as CompanyPermission[]),
    ]);
    // Roles globais do sistema só entram se a flag permitir (igual à página de permissões).
    if (!flags.ENABLE_GLOBAL_ROLE_ASSIGNMENT) {
      roles = roles.filter((role) => role.empresa_id !== null);
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Colaboradores
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A conta e o acesso definem-se de uma vez — ou deixa sem acesso e
          ajusta depois.
        </p>
      </div>
      {canCreate ? (
        <CreateCollaboratorForm
          roles={roles}
          permissions={permissions}
          canAssignAccess={canAssignAccess}
        />
      ) : null}
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
