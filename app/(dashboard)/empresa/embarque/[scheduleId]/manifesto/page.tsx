import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { ReprintButton } from "./reprint-button";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { SimpleTable } from "@/components/tables/simple-table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { getManifest } from "@/lib/api/operator";
import { getSchedule } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function ManifestoPage({
  params,
}: PageProps<"/empresa/embarque/[scheduleId]/manifesto">) {
  await requirePermission(PERMISSIONS.boardingValidate);
  const { scheduleId } = await params;

  let manifest, detail;
  try {
    [manifest, detail] = await Promise.all([
      getManifest(scheduleId),
      getSchedule(scheduleId).catch((error) => {
        unstable_rethrow(error);
        return null;
      }),
    ]);
  } catch (error) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Manifesto
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  const confirmed = manifest.filter((row) => row.status === "confirmed").length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/empresa/embarque"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Embarque
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Manifesto
        </h2>
        <p className="text-sm text-muted-foreground">
          {detail
            ? `${detail.departure_date} · ${detail.departure_time} · `
            : null}
          {confirmed} lugar(es) confirmado(s) de {manifest.length} reserva(s).
        </p>
      </div>
      <SimpleTable
        rows={manifest}
        rowKey={(row) => row.booking_id}
        emptyTitle="Sem reservas"
        emptyDescription="Ainda não há reservas para esta viagem."
        columns={[
          {
            header: "Lugar",
            cell: (row) => (
              <span className="font-medium tabular-nums">{row.seat}</span>
            ),
          },
          {
            header: "Reserva",
            cell: (row) => (
              <span className="font-mono text-xs">
                {row.booking_id.slice(0, 8)}
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
