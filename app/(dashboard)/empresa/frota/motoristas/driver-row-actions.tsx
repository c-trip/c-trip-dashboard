"use client";

import { useTransition } from "react";

import { toggleDriverAvailabilityAction } from "./actions";

interface DriverRowActionsProps {
  driverId: string;
  available: boolean;
}

export function DriverRowActions({ driverId, available }: DriverRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleDriverAvailabilityAction(driverId, available);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className="h-8 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
    >
      {available ? "Desactivar" : "Activar"}
    </button>
  );
}
