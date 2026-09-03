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

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

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
  searchParams,
}: PageProps<"/empresa/embarque/[scheduleId]/manifesto">) {
  await requirePermission(PERMISSIONS.boardingValidate);
  const { scheduleId } = await params;
  const showAll = str((await searchParams)?.status) === "all";

  let manifest, detail, schedules;
  try {
    [manifest, detail, schedules] = await Promise.all([
      getManifest(scheduleId, showAll ? "all" : undefined),
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

  const rows = [...manifest].sort((a, b) => a.seat - b.seat);
  const confirmed = rows.filter((r) => r.status === "confirmed");
  const boarded = confirmed.filter((r) => r.boarded).length;
  const trip = schedules.find((s) => s.schedule_id === scheduleId);
  const base = `/empresa/embarque/${scheduleId}/manifesto`;

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
          <span className="font-medium text-foreground tabular-nums">
            {boarded}/{confirmed.length}
          </span>{" "}
          embarcados
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SchedulePicker schedules={schedules} selected={scheduleId} />
        <EmbarqueNav scheduleId={scheduleId} />
        <a
          href={showAll ? base : `${base}?status=all`}
          className="ms-auto text-sm text-primary hover:underline"
        >
          {showAll ? "Só confirmadas" : "Ver canceladas"}
        </a>
      </div>

      <SimpleTable
        rows={rows}
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
            header: "Passageiro",
            cell: (row) => (
              <div>
                <p className="font-medium text-foreground">
                  {row.passenger?.trim() || "Sem nome"}
                </p>
                {row.phone || row.id_doc ? (
                  <p className="text-xs text-muted-foreground">
                    {[row.phone, row.id_doc].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </div>
            ),
          },
          {
            header: "Estado",
            cell: (row) =>
              row.boarded ? (
                <span className="inline-flex flex-col gap-0.5">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Embarcou
                  </span>
                  {row.boarded_at ? (
                    <span className="text-xs text-muted-foreground">
                      {new Date(row.boarded_at).toLocaleTimeString("pt-AO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : null}
                </span>
              ) : (
                <StatusBadge domain="booking" status={row.status} />
              ),
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
