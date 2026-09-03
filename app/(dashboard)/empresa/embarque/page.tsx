import Link from "next/link";

import { ValidatePanel } from "./validate-panel";
import { ApiErrorState } from "@/components/feedback/api-error-state";
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
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Embarque
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Valida o QR do passageiro e regista o embarque. Fixa uma viagem para
          recusar bilhetes de outra.
        </p>
      </div>

      <SchedulePicker schedules={schedules} selected={scheduleId} />

      <ValidatePanel scheduleId={scheduleId} />

      {selected ? (
        <Link
          href={`/empresa/embarque/${selected.schedule_id}/manifesto`}
          className="text-sm text-primary hover:underline"
        >
          Ver manifesto de {selected.origin} → {selected.destination}
        </Link>
      ) : null}
    </div>
  );
}
