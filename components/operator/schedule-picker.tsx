"use client";

import { usePathname, useRouter } from "next/navigation";

import type { OperatorSchedule } from "@/lib/api/operator";

const selectClass =
  "h-9 min-w-56 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Escolha da viagem a operar, guardada em `?schedule_id=`. Compacto de propósito
 * — vive na barra de topo do embarque, ao lado da nav.
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
    <select
      aria-label="Viagem"
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
          {s.departure_time} · {s.origin} → {s.destination}
        </option>
      ))}
    </select>
  );
}
