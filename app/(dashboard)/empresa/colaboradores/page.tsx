import { CollaboratorRowActions } from "./collaborator-row-actions";
import { CreateCollaboratorForm } from "./create-collaborator-form";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { SimpleTable } from "@/components/tables/simple-table";
import { getCompanyUsers } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function ColaboradoresPage() {
  await requirePermission(PERMISSIONS.companyReadUsers);

  let users;
  try {
    users = await getCompanyUsers();
  } catch {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Colaboradores</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Colaboradores</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uma conta nova nasce sem permissões — o segundo passo é sempre defini-las.
        </p>
      </div>
      <CreateCollaboratorForm />
      <SimpleTable
        rows={users}
        rowKey={(user) => user.id}
        emptyTitle="Ainda não há colaboradores"
        emptyDescription="Adiciona o primeiro colaborador para começar a atribuir tarefas e permissões."
        columns={[
          { header: "Nome", cell: (u) => <span className="font-medium">{u.name}</span> },
          { header: "Email", cell: (u) => u.email },
          {
            header: "Estado",
            cell: (u) => (
              <span className={u.is_active ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
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
