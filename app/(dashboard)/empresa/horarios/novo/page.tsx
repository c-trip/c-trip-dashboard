import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { CreateScheduleForm } from "./create-schedule-form";
import { getCompanyRoutes } from "@/lib/api/routes";
import { getBuses, getDrivers } from "@/lib/api/fleet";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function NovoHorarioPage() {
  await requirePermission(PERMISSIONS.scheduleCreate);

  let routes, buses, drivers;
  try {
    [routes, buses, drivers] = await Promise.all([
      getCompanyRoutes(),
      getBuses(),
      getDrivers(),
    ]);
  } catch {
    return (
      <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Novo horário</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Novo horário</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Agenda uma viagem numa rota existente, atribuindo autocarro e motorista.
        </p>
      </div>
      <CreateScheduleForm routes={routes} buses={buses} drivers={drivers} />
    </div>
  );
}
