import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { CollaboratorList } from "./collaborator-list";
import { ApiErrorState } from "@/components/feedback/api-error-state";
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
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Colaboradores
          </h2>
        </div>
        <ApiErrorState error={error} />
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
      <CollaboratorList users={users} />
    </div>
  );
}
