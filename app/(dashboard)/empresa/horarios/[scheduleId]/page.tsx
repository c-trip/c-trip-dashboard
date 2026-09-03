import Link from "next/link";
import { notFound, unstable_rethrow } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { EditScheduleForm } from "./edit-schedule-form";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { SeatMap } from "@/components/schedules/seat-map";
import { Card, CardContent } from "@/components/ui/card";
import { getBuses, getDrivers } from "@/lib/api/fleet";
import {
  getCompanySchedules,
  getSchedule,
  getScheduleSeats,
} from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function EditarHorarioPage({
  params,
}: PageProps<"/empresa/horarios/[scheduleId]">) {
  await requirePermission(PERMISSIONS.scheduleUpdate);
  const { scheduleId } = await params;

  let schedules, buses, drivers;
  try {
    [schedules, buses, drivers] = await Promise.all([
      getCompanySchedules(),
      getBuses(),
      getDrivers(),
    ]);
  } catch (error) {
    return (
      <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Editar horário
          </h2>
        </div>
        <ApiErrorState error={error} />
      </div>
    );
  }

  const schedule = schedules.find((item) => item.schedule_id === scheduleId);
  if (!schedule) notFound();

  // Detalhe (autocarro/motorista) e mapa de lugares são acessórios — se a API falhar,
  // continuamos a mostrar o formulário de edição (mas deixamos passar redirects do Next).
  const [detail, seats] = await Promise.all([
    getSchedule(scheduleId).catch((error) => {
      unstable_rethrow(error);
      return null;
    }),
    getScheduleSeats(scheduleId).catch((error) => {
      unstable_rethrow(error);
      return null;
    }),
  ]);

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/empresa/horarios"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Horários
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Editar {schedule.origin} → {schedule.destination}
        </h2>
        <p className="text-sm text-muted-foreground">
          Partida actual: {schedule.departure_date} · {schedule.departure_time}.
          Só os campos que preencheres são alterados.
        </p>
      </div>

      {detail || seats ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            {detail ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Autocarro</dt>
                <dd className="font-medium">
                  {detail.bus_model} ·{" "}
                  <span className="font-mono text-xs">{detail.bus_plate}</span>
                </dd>
                <dt className="text-muted-foreground">Motorista</dt>
                <dd className="font-medium">{detail.driver_name}</dd>
                <dt className="text-muted-foreground">Corte de embarque</dt>
                <dd className="font-medium tabular-nums">
                  {detail.boarding_cutoff_minutes} min
                </dd>
              </dl>
            ) : null}
            {seats ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">
                  Lugares{" "}
                  <span className="font-normal text-muted-foreground tabular-nums">
                    ({seats.available.length}/{seats.total_seats} livres)
                  </span>
                </p>
                <SeatMap
                  totalSeats={seats.total_seats}
                  available={seats.available}
                  occupied={seats.occupied}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {schedule.status === "cancelled" ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-400">
          Esta viagem está cancelada — a edição pode ser recusada pelo servidor.
        </p>
      ) : null}
      <EditScheduleForm schedule={schedule} buses={buses} drivers={drivers} />
    </div>
  );
}
