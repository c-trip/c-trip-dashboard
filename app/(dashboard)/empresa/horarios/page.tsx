import Link from "next/link";

import { ApiErrorState } from "@/components/feedback/api-error-state";
import { ScheduleRowActions } from "./schedule-row-actions";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getCompanySchedules } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { can, requirePermission } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

export default async function HorariosPage() {
  await requirePermission(PERMISSIONS.scheduleRead);
  const [canEdit, canCancel] = await Promise.all([
    can(PERMISSIONS.scheduleUpdate),
    can(PERMISSIONS.scheduleCancel),
  ]);

  let schedules;
  try {
    schedules = await getCompanySchedules();
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Horários
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Horários
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Viagens agendadas pela empresa, em todas as rotas.
          </p>
        </div>
        <Link
          href="/empresa/horarios/novo"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Novo horário
        </Link>
      </div>
      <SimpleTable
        rows={schedules}
        rowKey={(schedule) => schedule.schedule_id}
        emptyTitle="Ainda não há horários"
        emptyDescription="Cria uma rota primeiro — sem rota não há como agendar uma viagem."
        columns={[
          {
            header: "Rota",
            cell: (s) => (
              <span className="font-medium">
                {s.origin} → {s.destination}
              </span>
            ),
          },
          {
            header: "Partida",
            cell: (s) => `${s.departure_date} · ${s.departure_time}`,
          },
          {
            header: "Lugares",
            cell: (s) => (
              <span className="tabular-nums">{`${s.available_seats}/${s.total_seats} livres`}</span>
            ),
          },
          {
            header: "Estado",
            cell: (s) => <StatusBadge domain="schedule" status={s.status} />,
          },
          {
            header: "",
            cell: (s) =>
              s.status === "scheduled" ? (
                <ScheduleRowActions
                  scheduleId={s.schedule_id}
                  origin={s.origin}
                  destination={s.destination}
                  canEdit={canEdit}
                  canCancel={canCancel}
                />
              ) : null,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
