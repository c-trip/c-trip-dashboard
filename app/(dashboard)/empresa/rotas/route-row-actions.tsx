"use client";

import { useTransition } from "react";

import { setRouteActiveAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";

interface RouteRowActionsProps {
  routeId: string;
  routeLabel: string;
  isActive: boolean;
  canActivate: boolean;
  canDeactivate: boolean;
}

export function RouteRowActions({
  routeId,
  routeLabel,
  isActive,
  canActivate,
  canDeactivate,
}: RouteRowActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (isActive && !canDeactivate) return null;
  if (!isActive && !canActivate) return null;

  function handleToggle() {
    startTransition(async () => {
      await setRouteActiveAction(routeId, !isActive);
    });
  }

  if (isActive) {
    return (
      <ConfirmDialog
        trigger={
          <Button type="button" variant="ghost" size="sm" disabled={isPending}>
            Desactivar
          </Button>
        }
        title={`Desactivar a rota ${routeLabel}?`}
        description="Deixa de estar disponível para novos horários e vendas. Os horários já criados mantêm-se."
        onConfirm={handleToggle}
      />
    );
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleToggle} disabled={isPending}>
      Activar
    </Button>
  );
}
