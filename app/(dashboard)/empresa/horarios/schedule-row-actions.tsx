"use client";

import { useTransition } from "react";

import { cancelScheduleAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";

interface ScheduleRowActionsProps {
  scheduleId: string;
  origin: string;
  destination: string;
}

export function ScheduleRowActions({ scheduleId, origin, destination }: ScheduleRowActionsProps) {
  const [, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      await cancelScheduleAction(scheduleId);
    });
  }

  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="ghost" size="icon-sm" title="Cancelar horário">
          <span className="text-xs">Cancelar</span>
        </Button>
      }
      title={`Cancelar viagem ${origin} → ${destination}?`}
      description="Esta acção não pode ser desfeita. Os passageiros com bilhetes serão notificados."
      onConfirm={handleCancel}
    />
  );
}
