import { PermissionForm } from "./permission-form";
import { getAssignableCompanyPermissions, getCollaboratorRoles } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function ColaboradorPermissoesPage({
  params,
}: PageProps<"/empresa/colaboradores/[userId]/permissoes">) {
  await requirePermission(PERMISSIONS.companyRoleRead);
  const { userId } = await params;

  const [options, current] = await Promise.all([
    getAssignableCompanyPermissions(),
    getCollaboratorRoles(userId),
  ]);

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Permissões de {current.user_name}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Cada gravação substitui a lista inteira de permissões desta pessoa — marca tudo o que queres que fique
          válido, não só o que estás a acrescentar.
        </p>
        {current.roles.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Roles já atribuídas por outro caminho: {current.roles.map((role) => role.nome).join(", ")}. A API não
            devolve os códigos de permissão de cada role aqui, por isso a lista abaixo não vem pré-marcada —
            confirma o estado actual antes de gravar.
          </p>
        ) : null}
      </div>
      <PermissionForm userId={userId} options={options} defaultSelected={[]} />
    </div>
  );
}
