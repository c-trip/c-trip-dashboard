import { ValidatePanel } from "./validate-panel";
import { ApiErrorState } from "@/components/feedback/api-error-state";
import { EmbarqueNav } from "@/components/operator/embarque-nav";
import { SchedulePicker } from "@/components/operator/schedule-picker";
import { getOperatorSchedules } from "@/lib/api/operator";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EmbarquePage({
  searchParams,
}: PageProps<"/empresa/embarque">) {
  await requirePermission(PERMISSIONS.boardingValidate);
  const scheduleId = str((await searchParams)?.schedule_id);

  let schedules;
  try {
    schedules = await getOperatorSchedules();
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

  const selected = schedules.find((s) => s.schedule_id === scheduleId);

  return (
    <div className="flex max-w-2xl flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Embarque
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {selected
            ? `${selected.origin} → ${selected.destination} · ${selected.departure_date} ${selected.departure_time}`
            : "Escolhe a viagem para recusar bilhetes de outra."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SchedulePicker schedules={schedules} selected={scheduleId} />
        <EmbarqueNav scheduleId={scheduleId} />
      </div>

      <ValidatePanel scheduleId={scheduleId} />
    </div>
  );
}
