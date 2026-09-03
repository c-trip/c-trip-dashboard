import { CreateDriverForm } from "./create-driver-form";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { getCompanyUsers } from "@/lib/api/companies";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function NovoMotoristaPage() {
  await requirePermission(PERMISSIONS.driverCreate);

  let users;
  try {
    users = await getCompanyUsers();
  } catch (error) {
    return (
      <div className="flex max-w-md flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Adicionar motorista
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  const activeUsers = users.filter((user) => user.is_active);

  return (
    <div className="flex max-w-md flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Adicionar motorista
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O motorista tem de ter primeiro uma conta de colaborador. Cria-a em
          Colaboradores e depois associa-a aqui.
        </p>
      </div>
      <CreateDriverForm users={activeUsers} />
    </div>
  );
}
