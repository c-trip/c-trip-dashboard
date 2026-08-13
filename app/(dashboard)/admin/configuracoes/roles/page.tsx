import { SimpleTable } from "@/components/tables/simple-table";
import { getGlobalRoles } from "@/lib/api/admin";

export default async function GlobalRolesPage() {
  const roles = await getGlobalRoles();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Roles &amp; permissões globais</h2>
        <p className="text-sm text-muted-foreground">
          Configuração avançada de RBAC — uso raro, tipicamente só na configuração inicial da plataforma.
        </p>
      </div>
      <SimpleTable
        rows={roles}
        rowKey={(role) => role.id}
        emptyTitle="Sem roles globais"
        columns={[
          { header: "Nome", cell: (r) => r.nome },
          { header: "Descrição", cell: (r) => r.descricao },
          { header: "Permissões", cell: (r) => String(r.permission_count) },
          { header: "Sistema", cell: (r) => (r.is_system ? "Sim" : "Não") },
        ]}
      />
    </div>
  );
}
