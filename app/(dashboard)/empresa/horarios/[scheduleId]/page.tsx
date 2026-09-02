import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { EditScheduleForm } from "./edit-schedule-form";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { getBuses, getDrivers } from "@/lib/api/fleet";
import { getCompanySchedules } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function EditarHorarioPage({ params }: PageProps<"/empresa/horarios/[scheduleId]">) {
  await requirePermission(PERMISSIONS.scheduleUpdate);
  const { scheduleId } = await params;

  let schedules, buses, drivers;
  try {
    [schedules, buses, drivers] = await Promise.all([
      getCompanySchedules(),
      getBuses(),
      getDrivers(),
    ]);
  } catch {
    return (
      <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Editar horário</h2>
        </div>
        <CompanyBlocked />
      </div>
    );
  }

  const schedule = schedules.find((item) => item.schedule_id === scheduleId);
  if (!schedule) notFound();

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
          Partida actual: {schedule.departure_date} · {schedule.departure_time}. Só os campos que
          preencheres são alterados.
        </p>
      </div>
      {schedule.status === "cancelled" ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-400">
          Esta viagem está cancelada — a edição pode ser recusada pelo servidor.
        </p>
      ) : null}
      <EditScheduleForm schedule={schedule} buses={buses} drivers={drivers} />
    </div>
  );
}
