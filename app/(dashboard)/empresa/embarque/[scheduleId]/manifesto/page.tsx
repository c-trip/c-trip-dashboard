import { unstable_rethrow } from "next/navigation";

import { ReprintButton } from "./reprint-button";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { EmbarqueNav } from "@/components/operator/embarque-nav";
import { SchedulePicker } from "@/components/operator/schedule-picker";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getManifest, getOperatorSchedules } from "@/lib/api/operator";
import { getSchedule } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    unstable_rethrow(error);
    return fallback;
  }
}

export default async function ManifestoPage({
  params,
}: PageProps<"/empresa/embarque/[scheduleId]/manifesto">) {
  await requirePermission(PERMISSIONS.boardingValidate);
  const { scheduleId } = await params;

  let manifest, detail, schedules;
  try {
    [manifest, detail, schedules] = await Promise.all([
      getManifest(scheduleId),
      safe(getSchedule(scheduleId), null),
      safe(getOperatorSchedules(), []),
    ]);
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Embarque
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  const confirmed = manifest.filter((row) => row.status === "confirmed").length;
  const trip = schedules.find((s) => s.schedule_id === scheduleId);

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Embarque
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {trip ? `${trip.origin} → ${trip.destination} · ` : null}
          {detail
            ? `${detail.departure_date} ${detail.departure_time} · `
            : null}
          {confirmed} de {manifest.length} lugar(es) confirmado(s)
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SchedulePicker schedules={schedules} selected={scheduleId} />
        <EmbarqueNav scheduleId={scheduleId} />
      </div>

      <p className="text-xs text-muted-foreground">
        A API do manifesto não devolve o nome do passageiro — só lugar, reserva
        e estado. O nome aparece ao validar o QR de cada bilhete.
      </p>

      <SimpleTable
        rows={[...manifest].sort((a, b) => a.seat - b.seat)}
        rowKey={(row) => row.booking_id}
        emptyTitle="Sem reservas"
        emptyDescription="Ainda não há reservas para esta viagem."
        columns={[
          {
            header: "Lugar",
            cell: (row) => (
              <span className="font-semibold tabular-nums">{row.seat}</span>
            ),
          },
          {
            header: "Reserva",
            cell: (row) => (
              <span className="font-mono text-xs text-muted-foreground">
                {row.booking_id.slice(0, 8).toUpperCase()}
              </span>
            ),
          },
          {
            header: "Estado",
            cell: (row) => <StatusBadge domain="booking" status={row.status} />,
          },
          {
            header: "",
            cell: (row) =>
              row.status === "confirmed" ? (
                <ReprintButton scheduleId={scheduleId} seat={row.seat} />
              ) : null,
            className: "text-right",
          },
        ]}
      />
    </div>
  );
}
