"use client";

import { useTransition } from "react";
import Link from "next/link";
import { IconPencil } from "@tabler/icons-react";

import { cancelScheduleAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleRowActionsProps {
  scheduleId: string;
  origin: string;
  destination: string;
  canEdit: boolean;
  canCancel: boolean;
}

export function ScheduleRowActions({
  scheduleId,
  origin,
  destination,
  canEdit,
  canCancel,
}: ScheduleRowActionsProps) {
  const [, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      await cancelScheduleAction(scheduleId);
    });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {canEdit ? (
        <Link
          href={`/empresa/horarios/${scheduleId}`}
          title="Editar horário"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        >
          <IconPencil size={16} />
        </Link>
      ) : null}
      {canCancel ? (
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
      ) : null}
    </div>
  );
}
