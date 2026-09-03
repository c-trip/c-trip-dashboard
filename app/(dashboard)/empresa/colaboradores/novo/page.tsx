import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { CollaboratorWizard } from "./collaborator-wizard";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import {
  getAssignableCompanyPermissions,
  type CompanyPermission,
} from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";

export default async function NovoColaboradorPage() {
  await requirePermission(PERMISSIONS.companyCreateUser);
  const canAssignPermissions = await can(PERMISSIONS.companyRoleAssign);

  let permissions: CompanyPermission[] = [];
  if (canAssignPermissions) {
    try {
      permissions = await getAssignableCompanyPermissions();
    } catch (error) {
      return (
        <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Novo colaborador
            </h2>
          </div>
          <ApiErrorState error={error} />
        </div>
      );
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/empresa/colaboradores"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Colaboradores
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Novo colaborador
        </h2>
        <p className="text-sm text-muted-foreground">
          Cria a conta e define o acesso — em dois passos.
        </p>
      </div>
      <CollaboratorWizard
        permissions={permissions}
        canAssignPermissions={canAssignPermissions}
      />
    </div>
  );
}
