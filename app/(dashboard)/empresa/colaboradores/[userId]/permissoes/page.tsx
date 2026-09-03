import { ApiErrorState } from "@/components/feedback/api-error-state";
import { CollaboratorRoles } from "./collaborator-roles";
import { PermissionForm } from "./permission-form";
import { assignableRoles } from "@/config/flags";
import {
  getAssignableCompanyPermissions,
  getCollaboratorRoles,
  getCompanyRoles,
} from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";

export default async function ColaboradorPermissoesPage({
  params,
  searchParams,
}: PageProps<"/empresa/colaboradores/[userId]/permissoes">) {
  await requirePermission(PERMISSIONS.companyRoleRead);
  const { userId } = await params;
  const justCreated = (await searchParams)?.criado === "1";
  const canAssignRoles = await can(PERMISSIONS.companyRoleAssign);

  let options, current, companyRoles;
  try {
    [options, current, companyRoles] = await Promise.all([
      getAssignableCompanyPermissions(),
      getCollaboratorRoles(userId),
      canAssignRoles ? getCompanyRoles() : Promise.resolve([]),
    ]);
  } catch (error) {
    return (
      <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Permissões do colaborador
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  const roles = assignableRoles(companyRoles);

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      {justCreated ? (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-400">
          A conta foi criada, mas não foi possível atribuir o acesso
          automaticamente. Define-o aqui.
        </div>
      ) : null}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Permissões de {current.user_name}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          O caminho normal é atribuir uma <strong>role</strong> — por exemplo{" "}
          <strong>operador_balcao</strong>, que já traz o pacote do balcão
          (vender, ver viagens, validar QR, registar embarque e ver caixa) num
          clique. As permissões soltas em baixo ficam para casos especiais.
        </p>
      </div>

      {canAssignRoles ? (
        <CollaboratorRoles
          userId={userId}
          currentRoles={current.roles}
          assignableRoles={roles}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          Permissões soltas{" "}
          <span className="font-normal text-muted-foreground">
            (casos especiais)
          </span>
        </h3>
        {current.roles.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Este colaborador já tem roles atribuídas (
            {current.roles.map((role) => role.nome).join(", ")}). A API não
            devolve os códigos de cada role aqui, por isso a lista abaixo não
            vem pré-marcada — confirma o estado actual antes de gravar.
          </p>
        ) : null}
        <PermissionForm
          userId={userId}
          options={options}
          defaultSelected={[]}
        />
      </div>
    </div>
  );
}
