"use client";

import { useTransition } from "react";

import { updateBusStatusAction } from "./actions";
import type { BusStatus } from "@/lib/api/types";

interface BusRowActionsProps {
  busId: string;
  currentStatus: BusStatus;
}

const STATUS_OPTIONS: { value: BusStatus; label: string }[] = [
  { value: "active", label: "Activo" },
  { value: "maintenance", label: "Manutenção" },
  { value: "inactive", label: "Inactivo" },
];

export function BusRowActions({ busId, currentStatus }: BusRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    const status = value as BusStatus;
    if (status === currentStatus) return;
    startTransition(async () => {
      await updateBusStatusAction(busId, status);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
