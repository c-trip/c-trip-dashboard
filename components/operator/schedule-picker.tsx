"use client";

import { usePathname, useRouter } from "next/navigation";

import { FormField } from "@/components/forms/form-field";
import type { OperatorSchedule } from "@/lib/api/operator";

const selectClass =
  "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Escolha da viagem a operar. Guarda a selecção em `?schedule_id=` para o Server
 * Component reagir (ex.: fixar a viagem na validação de QR).
 */
export function SchedulePicker({
  schedules,
  selected,
}: {
  schedules: OperatorSchedule[];
  selected?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <FormField htmlFor="schedule_id" label="Viagem" className="max-w-md">
      <select
        id="schedule_id"
        className={selectClass}
        defaultValue={selected ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          router.push(value ? `${pathname}?schedule_id=${value}` : pathname);
        }}
      >
        <option value="">Todas as viagens abertas</option>
        {schedules.map((s) => (
          <option key={s.schedule_id} value={s.schedule_id}>
            {s.origin} → {s.destination} · {s.departure_date} {s.departure_time}
          </option>
        ))}
      </select>
    </FormField>
  );
}
