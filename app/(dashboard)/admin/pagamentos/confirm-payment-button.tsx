"use client";

import { confirmPaymentAction } from "./actions";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmPaymentButton({ paymentId }: { paymentId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="outline" size="sm">
          Confirmar manualmente
        </Button>
      }
      title="Confirmar pagamento manualmente?"
      description="Usa isto só quando o webhook do gateway falhou — em produção a confirmação normal é automática."
      variant="default"
      confirmLabel="Confirmar"
      onConfirm={() => confirmPaymentAction(paymentId)}
    />
  );
}
