import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getCompanySchedules } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function HorariosPage() {
  await requirePermission(PERMISSIONS.scheduleRead);
  const schedules = await getCompanySchedules();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Horários</h2>
        <p className="text-sm text-muted-foreground">Viagens agendadas pela empresa, em todas as rotas.</p>
      </div>
      <SimpleTable
        rows={schedules}
        rowKey={(schedule) => schedule.schedule_id}
        emptyTitle="Ainda não há horários"
        emptyDescription="Cria uma rota primeiro — sem rota não há como agendar uma viagem."
        columns={[
          { header: "Rota", cell: (s) => `${s.origin} → ${s.destination}` },
          { header: "Partida", cell: (s) => `${s.departure_date} · ${s.departure_time}` },
          { header: "Lugares", cell: (s) => `${s.available_seats}/${s.total_seats} livres` },
          { header: "Estado", cell: (s) => <StatusBadge domain="schedule" status={s.status} /> },
        ]}
      />
    </div>
  );
}
