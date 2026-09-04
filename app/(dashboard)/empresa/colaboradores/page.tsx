import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { CollaboratorList } from "./collaborator-list";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { PageHeader } from "@/components/layout/page-header";
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
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <PageHeader context="Empresa" title="Colaboradores" />
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        context="Empresa"
        title="Colaboradores"
        description="Contas da empresa e o que cada uma pode fazer."
        actions={
          canCreate ? (
            <Link
              href="/empresa/colaboradores/novo"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <IconPlus size={16} data-icon="inline-start" />
              Novo colaborador
            </Link>
          ) : null
        }
      />
      <CollaboratorList users={users} />
    </div>
  );
}
